"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import { Check, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePathname } from "next/navigation";
import { localizeHref } from "@/i18n/routing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  defaultIntakeFormData,
  intakeSchema,
  type IntakeFormData,
} from "@/server/schemas/intake";
import {
  sanitizeEmail,
  sanitizeMultilineText,
  sanitizePhone,
  sanitizeSingleLineText,
} from "@/lib/sanitize";
import { cn } from "@/lib/utils";
import { getRuntimeUiLocale, runtimeUiCopy } from "@/i18n/runtime-ui";

type IntakeField = keyof IntakeFormData;
type IntakeErrors = Partial<Record<IntakeField, string>>;
type IntakeCopy = (typeof runtimeUiCopy)[keyof typeof runtimeUiCopy]["intake"];

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 30 : -30,
    opacity: 0,
  }),
};

function getStepErrors(
  step: number,
  formData: IntakeFormData,
  copy: IntakeCopy,
): IntakeErrors {
  const errors: IntakeErrors = {};
  const normalizedName = sanitizeSingleLineText(formData.name);
  const normalizedEmail = sanitizeEmail(formData.email);
  const normalizedPhone = sanitizePhone(formData.phone);
  const normalizedLanguage = sanitizeSingleLineText(formData.language);
  const normalizedCaseType = sanitizeSingleLineText(formData.caseType);
  const normalizedSummary = sanitizeMultilineText(formData.summary);

  if (step === 1) {
    if (normalizedName.length < 2) {
      errors.name = copy.errors.name;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      errors.email = copy.errors.email;
    }

    if (normalizedPhone.length < 7) {
      errors.phone = copy.errors.phone;
    }

    if (!normalizedLanguage) {
      errors.language = copy.errors.language;
    }
  }

  if (step === 2) {
    if (!normalizedCaseType) {
      errors.caseType = copy.errors.caseType;
    }

    if (normalizedSummary.length < 30) {
      errors.summary = copy.errors.summary;
    }
  }

  if (step === 3 && !formData.consent) {
    errors.consent = copy.errors.consent;
  }

  return errors;
}

function getErrorId(field: IntakeField) {
  return `${field}-error`;
}

export default function IntakeForm() {
  const locale = useLocale();
  const uiLocale = getRuntimeUiLocale(locale);
  const copy = runtimeUiCopy[uiLocale].intake;
  const steps = copy.steps;
  const pathname = usePathname();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState(0);
  const [errors, setErrors] = useState<IntakeErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [retryAfterSeconds, setRetryAfterSeconds] = useState(0);
  const [formData, setFormData] = useState<IntakeFormData>({
    ...defaultIntakeFormData,
  });

  useEffect(() => {
    if (retryAfterSeconds <= 0) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setRetryAfterSeconds((currentValue) => Math.max(currentValue - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [retryAfterSeconds]);

  function sanitizeFieldValue<K extends IntakeField>(
    name: K,
    value: IntakeFormData[K],
  ) {
    if (typeof value !== "string") {
      return value;
    }

    switch (name) {
      case "email":
        return sanitizeEmail(value, { trim: false }) as IntakeFormData[K];
      case "phone":
        return sanitizePhone(value, { trim: false }) as IntakeFormData[K];
      case "summary":
        return sanitizeMultilineText(value, {
          trim: false,
        }) as IntakeFormData[K];
      default:
        return sanitizeSingleLineText(value, {
          trim: false,
        }) as IntakeFormData[K];
    }
  }

  function handleChange<K extends IntakeField>(
    name: K,
    value: IntakeFormData[K],
  ) {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: sanitizeFieldValue(name, value),
    }));
    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
    }));
    setServerError(null);
  }

  function nextStep() {
    const stepErrors = getStepErrors(step, formData, copy);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      toast.error(copy.toasts.completeRequired);
      return;
    }

    setDirection(1);
    setStep((currentStep) => currentStep + 1);
  }

  function prevStep() {
    setDirection(-1);
    setStep((currentStep) => currentStep - 1);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const stepErrors = getStepErrors(3, formData, copy);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      toast.error(copy.toasts.confirmDisclosure);
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    try {
      const parsedPayload = intakeSchema.safeParse(formData);
      if (!parsedPayload.success) {
        const flattenedErrors = parsedPayload.error.flatten().fieldErrors;
        setErrors({
          name: flattenedErrors.name?.[0],
          email: flattenedErrors.email?.[0],
          phone: flattenedErrors.phone?.[0],
          language: flattenedErrors.language?.[0],
          caseType: flattenedErrors.caseType?.[0],
          summary: flattenedErrors.summary?.[0],
          consent: flattenedErrors.consent?.[0],
          website: flattenedErrors.website?.[0],
        });
        toast.error(copy.toasts.reviewFields);
        return;
      }

      setFormData(parsedPayload.data);

      const response = await fetch("/api/intake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedPayload.data),
      });

      const data = (await response.json()) as {
        error?: string;
        confirmationSent?: boolean;
      };

      if (!response.ok) {
        const retryAfter = Number(response.headers.get("Retry-After") ?? "0");
        if (
          response.status === 429 &&
          Number.isFinite(retryAfter) &&
          retryAfter > 0
        ) {
          setRetryAfterSeconds(retryAfter);
        }

        const message = data.error || copy.toasts.submitError;
        setServerError(message);
        toast.error(message);
        return;
      }

      toast.success(copy.toasts.success, {
        description: data.confirmationSent
          ? copy.toasts.successSent
          : copy.toasts.successDefault,
      });

      setStep(1);
      setDirection(0);
      setErrors({});
      setServerError(null);
      setRetryAfterSeconds(0);
      setFormData({ ...defaultIntakeFormData });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : copy.toasts.submitError;
      setServerError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderError(field: IntakeField) {
    const error = errors[field];
    if (!error) {
      return null;
    }

    return (
      <p id={getErrorId(field)} role="alert" className="text-sm text-red-600">
        {error}
      </p>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="relative mb-10">
        <div className="absolute left-0 top-5 -z-10 h-0.5 w-full bg-zinc-100" />
        <motion.div
          className="absolute left-0 top-5 -z-10 h-0.5 bg-foreground"
          initial={{ width: "0%" }}
          animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        <div className="flex justify-between">
          {copy.steps.map((title, index) => {
            const currentStep = { id: index + 1, title };
            return (
              <div
                key={currentStep.id}
                className="group flex cursor-default flex-col items-center"
              >
                <motion.div
                  className={cn(
                    "z-10 mb-3 flex h-10 w-10 items-center justify-center rounded-full border-4 text-sm font-semibold transition-all duration-300",
                    step >= currentStep.id
                      ? "border-foreground bg-foreground text-background shadow-lg"
                      : "border-border bg-card text-muted-foreground",
                  )}
                  animate={{
                    scale: step === currentStep.id ? 1.1 : 1,
                  }}
                >
                  {step > currentStep.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    currentStep.id
                  )}
                </motion.div>
                <span
                  className={cn(
                    "text-xs font-medium uppercase tracking-wider transition-colors duration-300",
                    step >= currentStep.id ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {currentStep.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <Card className="overflow-hidden border-border bg-card shadow-2xl shadow-primary/5 backdrop-blur-md">
        <CardContent className="p-8 md:p-10">
          <form onSubmit={(event) => void handleSubmit(event)}>
            <div className="sr-only" aria-hidden="true">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                autoComplete="off"
                tabIndex={-1}
                maxLength={0}
                value={formData.website}
                onChange={(event) =>
                  handleChange("website", event.target.value)
                }
              />
            </div>

            <AnimatePresence mode="wait" custom={direction}>
              {step === 1 ? (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="mb-2 text-2xl font-bold">{copy.contactInfoTitle}</h3>
                    <p className="text-muted-foreground">
                      {copy.contactInfoDesc}
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">{copy.fullName}</Label>
                      <Input
                        id="name"
                        name="name"
                        autoComplete="name"
                        placeholder="John Doe"
                        maxLength={120}
                        value={formData.name}
                        onChange={(event) =>
                          handleChange("name", event.target.value)
                        }
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={
                          errors.name ? getErrorId("name") : undefined
                        }
                        className="h-12 bg-background"
                      />
                      {renderError("name")}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{copy.emailAddress}</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="john@example.com"
                        maxLength={160}
                        value={formData.email}
                        onChange={(event) =>
                          handleChange("email", event.target.value)
                        }
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={
                          errors.email ? getErrorId("email") : undefined
                        }
                        className="h-12 bg-background"
                      />
                      {renderError("email")}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                      <Label htmlFor="phone">{copy.phone}</Label>
                        <Input
                          id="phone"
                          name="phone"
                          autoComplete="tel"
                          placeholder="+1 (555) 000-0000"
                          maxLength={40}
                          value={formData.phone}
                          onChange={(event) =>
                            handleChange("phone", event.target.value)
                          }
                          aria-invalid={Boolean(errors.phone)}
                          aria-describedby={
                            errors.phone ? getErrorId("phone") : undefined
                          }
                          className="h-12 bg-background"
                        />
                        {renderError("phone")}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="language">{copy.preferredLanguage}</Label>
                        <Select
                          name="language"
                          onValueChange={(value) =>
                            handleChange("language", value)
                          }
                          value={formData.language}
                        >
                          <SelectTrigger
                            id="language"
                            aria-invalid={Boolean(errors.language)}
                            aria-describedby={
                              errors.language
                                ? getErrorId("language")
                                : undefined
                            }
                            className="h-12 bg-background"
                          >
                            <SelectValue placeholder={copy.select} />
                          </SelectTrigger>
                          <SelectContent>
                            {copy.languages.map((language, index) => (
                              <SelectItem key={language} value={["English","Spanish","Urdu","Punjabi","French"][index]}>
                                {language}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {renderError("language")}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="button"
                      onClick={nextStep}
                      size="lg"
                      className="h-12 w-full rounded-full font-semibold"
                    >
                      {copy.continue} <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ) : null}

              {step === 2 ? (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="mb-2 text-2xl font-bold">{copy.caseDetailsTitle}</h3>
                    <p className="text-muted-foreground">
                      {copy.caseDetailsDesc}
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="caseType">{copy.caseType}</Label>
                      <Select
                        name="caseType"
                        onValueChange={(value) =>
                          handleChange("caseType", value)
                        }
                        value={formData.caseType}
                      >
                        <SelectTrigger
                          id="caseType"
                          aria-invalid={Boolean(errors.caseType)}
                          aria-describedby={
                            errors.caseType ? getErrorId("caseType") : undefined
                          }
                          className="h-12 bg-background"
                        >
                          <SelectValue placeholder={copy.selectServiceType} />
                        </SelectTrigger>
                        <SelectContent>
                          {copy.caseTypeLabels.map((label, index) => (
                            <SelectItem key={label} value={copy.caseTypes[index]}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {renderError("caseType")}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="summary">{copy.summary}</Label>
                      <Textarea
                        id="summary"
                        name="summary"
                        autoComplete="off"
                        placeholder={copy.summaryPlaceholder}
                        rows={5}
                        maxLength={2000}
                        value={formData.summary}
                        onChange={(event) =>
                          handleChange("summary", event.target.value)
                        }
                        aria-invalid={Boolean(errors.summary)}
                        aria-describedby={
                          errors.summary ? getErrorId("summary") : undefined
                        }
                        className="resize-none bg-background"
                      />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                          {copy.summaryHelp}
                        </span>
                        <span>{formData.summary.trim().length}/2000</span>
                      </div>
                      {renderError("summary")}
                    </div>

                    <div className="space-y-3">
                      <Label>{copy.documentsAvailable}</Label>
                      <div className="flex flex-wrap gap-6">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            name="hasPassport"
                            id="hasPassport"
                            checked={formData.hasPassport}
                            onCheckedChange={(checked) =>
                              handleChange("hasPassport", checked === true)
                            }
                          />
                          <Label
                            htmlFor="hasPassport"
                            className="cursor-pointer font-normal"
                          >
                            {copy.passport}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            name="hasReceipts"
                            id="hasReceipts"
                            checked={formData.hasReceipts}
                            onCheckedChange={(checked) =>
                              handleChange("hasReceipts", checked === true)
                            }
                          />
                          <Label
                            htmlFor="hasReceipts"
                            className="cursor-pointer font-normal"
                          >
                            {copy.receipts}
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      size="lg"
                      className="h-12 flex-1 rounded-full font-semibold"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" /> {copy.back}
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      size="lg"
                      className="h-12 flex-1 rounded-full font-semibold"
                    >
                      {copy.continue} <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ) : null}

              {step === 3 ? (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="mb-2 text-2xl font-bold">{copy.reviewTitle}</h3>
                    <p className="text-muted-foreground">
                      {copy.reviewDesc}
                    </p>
                  </div>

                  <div className="space-y-3 rounded-xl border border-border bg-muted/50 p-6 text-sm">
                    <div className="flex justify-between border-b border-border/50 py-2">
                      <span className="text-muted-foreground">{copy.reviewLabels.name}</span>
                      <span className="font-medium">
                        {formData.name || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-border/50 py-2">
                      <span className="text-muted-foreground">{copy.reviewLabels.email}</span>
                      <span className="font-medium">
                        {formData.email || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-border/50 py-2">
                      <span className="text-muted-foreground">{copy.reviewLabels.phone}</span>
                      <span className="font-medium">
                        {formData.phone || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-border/50 py-2">
                      <span className="text-muted-foreground">{copy.reviewLabels.language}</span>
                      <span className="font-medium">
                        {formData.language || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-border/50 py-2">
                      <span className="text-muted-foreground">{copy.reviewLabels.caseType}</span>
                      <span className="font-medium">
                        {formData.caseType || "—"}
                      </span>
                    </div>
                    <div className="py-2">
                      <span className="text-muted-foreground">{copy.reviewLabels.summary}</span>
                      <p className="mt-2 rounded-lg bg-background p-4 leading-relaxed text-foreground">
                        {formData.summary || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 pt-2">
                    <Checkbox
                      id="consent"
                      name="consent"
                      checked={formData.consent}
                      onCheckedChange={(checked) =>
                        handleChange("consent", checked === true)
                      }
                      aria-invalid={Boolean(errors.consent)}
                      aria-describedby={
                        errors.consent ? getErrorId("consent") : undefined
                      }
                    />
                    <Label
                      htmlFor="consent"
                      className="cursor-pointer text-sm font-normal leading-relaxed text-muted-foreground"
                    >
                      {copy.consentPrefix}{" "}
                      <Link
                        href={localizeHref(pathname, "/privacy")}
                        className="font-medium text-foreground underline hover:text-foreground/80"
                      >
                        {copy.privacyPolicy}
                      </Link>
                      .
                    </Label>
                  </div>
                  {renderError("consent")}

                  {serverError ? (
                    <div
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                      role="alert"
                    >
                      {serverError}
                      {retryAfterSeconds > 0
                        ? ` Please wait about ${retryAfterSeconds} seconds before trying again.`
                        : ""}
                    </div>
                  ) : null}

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      size="lg"
                      className="h-12 flex-1 rounded-full font-semibold"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" /> {copy.back}
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      className="h-12 flex-1 rounded-full font-semibold"
                      disabled={isSubmitting || retryAfterSeconds > 0}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {copy.submitting}
                        </>
                      ) : retryAfterSeconds > 0 ? (
                        copy.pleaseWait.replace("{seconds}", String(retryAfterSeconds))
                      ) : (
                        copy.submitRequest
                      )}
                    </Button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

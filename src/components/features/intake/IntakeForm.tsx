'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';
import { Check, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function IntakeForm() {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [direction, setDirection] = useState(0); // -1 for prev, 1 for next
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', language: '',
        caseType: '', summary: '',
        hasPassport: false, hasReceipts: false,
        consent: false
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (name: string, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => {
        setDirection(1);
        setStep(step + 1);
    };

    const prevStep = () => {
        setDirection(-1);
        setStep(step - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        toast.success('Thank you! We will review your case and contact you within 24-48 hours.', {
            description: 'Check your email for confirmation.',
        });

        // Reset form
        setStep(1);
        setDirection(0);
        setFormData({
            name: '', email: '', phone: '', language: '',
            caseType: '', summary: '',
            hasPassport: false, hasReceipts: false,
            consent: false
        });
    };

    const steps = [
        { id: 1, title: "Contact" },
        { id: 2, title: "Case Details" },
        { id: 3, title: "Review" }
    ];

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 30 : -30,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 30 : -30,
            opacity: 0
        })
    };

    return (
        <div className="max-w-2xl mx-auto w-full">
            {/* Step Indicator - Apple style */}
            <div className="mb-10 relative">
                <div className="absolute top-5 left-0 w-full h-0.5 bg-zinc-100 -z-10"></div>
                <motion.div
                    className="absolute top-5 left-0 h-0.5 bg-foreground -z-10"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                />

                <div className="flex justify-between">
                    {steps.map((s) => (
                        <div key={s.id} className="flex flex-col items-center group cursor-default">
                            <motion.div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 mb-3 z-10 border-4",
                                    step >= s.id
                                        ? "bg-foreground text-background border-foreground shadow-lg"
                                        : "bg-white text-zinc-400 border-zinc-100"
                                )}
                                animate={{
                                    scale: step === s.id ? 1.1 : 1,
                                    borderColor: step >= s.id ? "var(--foreground)" : "rgb(244 244 245)"
                                }}
                            >
                                {step > s.id ? <Check className="w-5 h-5" /> : s.id}
                            </motion.div>
                            <span className={cn(
                                "text-xs font-medium uppercase tracking-wider transition-colors duration-300",
                                step >= s.id ? "text-foreground" : "text-zinc-400"
                            )}>
                                {s.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <Card className="shadow-2xl shadow-zinc-200/50 border-zinc-100 overflow-hidden bg-white/80 backdrop-blur-md">
                <CardContent className="p-8 md:p-10">
                    <form onSubmit={handleSubmit}>
                        <AnimatePresence mode="wait" custom={direction}>
                            {/* Step 1: Contact */}
                            {step === 1 && (
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
                                        <h3 className="text-2xl font-bold mb-2">Contact Information</h3>
                                        <p className="text-muted-foreground">Let&apos;s start with your contact details.</p>
                                    </div>

                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                autoComplete="name"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={(e) => handleChange("name", e.target.value)}
                                                className="h-12 bg-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                placeholder="john@example.com"
                                                value={formData.email}
                                                onChange={(e) => handleChange("email", e.target.value)}
                                                className="h-12 bg-white"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone</Label>
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    autoComplete="tel"
                                                    placeholder="+1 (555) 000-0000"
                                                    value={formData.phone}
                                                    onChange={(e) => handleChange("phone", e.target.value)}
                                                    className="h-12 bg-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="language">Language</Label>
                                                <Select name="language" onValueChange={(val) => handleChange("language", val)} value={formData.language}>
                                                    <SelectTrigger id="language" className="h-12 bg-white">
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="English">English</SelectItem>
                                                        <SelectItem value="Spanish">Spanish</SelectItem>
                                                        <SelectItem value="Urdu">Urdu</SelectItem>
                                                        <SelectItem value="French">French</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <Button type="button" onClick={nextStep} size="lg" className="w-full h-12 rounded-full font-semibold">
                                            Continue <ChevronRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Case Details */}
                            {step === 2 && (
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
                                        <h3 className="text-2xl font-bold mb-2">Case Details</h3>
                                        <p className="text-muted-foreground">Tell us about your immigration needs.</p>
                                    </div>

                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="caseType">Case Type</Label>
                                            <Select name="caseType" onValueChange={(val) => handleChange("caseType", val)} value={formData.caseType}>
                                                <SelectTrigger id="caseType" className="h-12 bg-white">
                                                    <SelectValue placeholder="Select service type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Visitor Visa">Visitor Visa (B1/B2)</SelectItem>
                                                    <SelectItem value="Student Visa">Student Visa (F-1)</SelectItem>
                                                    <SelectItem value="Change of Status">Change of Status</SelectItem>
                                                    <SelectItem value="Marriage-Based">Marriage-Based Green Card</SelectItem>
                                                    <SelectItem value="Work Permit">Work Permit (EAD)</SelectItem>
                                                    <SelectItem value="Asylum">Asylum</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="summary">Brief Summary</Label>
                                            <Textarea
                                                id="summary"
                                                name="summary"
                                                autoComplete="off"
                                                placeholder="Describe your situation and what you need help with..."
                                                rows={4}
                                                value={formData.summary}
                                                onChange={(e) => handleChange("summary", e.target.value)}
                                                className="resize-none bg-white"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <Label>Documents Available</Label>
                                            <div className="flex flex-wrap gap-6">
                                                <div className="flex items-center space-x-3">
                                                    <Checkbox name="hasPassport" id="hasPassport" checked={formData.hasPassport} onCheckedChange={(c) => handleChange("hasPassport", c)} />
                                                    <Label htmlFor="hasPassport" className="font-normal cursor-pointer">Passport</Label>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <Checkbox name="hasReceipts" id="hasReceipts" checked={formData.hasReceipts} onCheckedChange={(c) => handleChange("hasReceipts", c)} />
                                                    <Label htmlFor="hasReceipts" className="font-normal cursor-pointer">USCIS Receipts</Label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <Button type="button" variant="outline" onClick={prevStep} size="lg" className="flex-1 h-12 rounded-full font-semibold">
                                            <ChevronLeft className="w-4 h-4 mr-2" /> Back
                                        </Button>
                                        <Button type="button" onClick={nextStep} size="lg" className="flex-1 h-12 rounded-full font-semibold">
                                            Continue <ChevronRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Review */}
                            {step === 3 && (
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
                                        <h3 className="text-2xl font-bold mb-2">Review & Submit</h3>
                                        <p className="text-muted-foreground">Please verify your information.</p>
                                    </div>

                                    <div className="bg-zinc-50 p-6 rounded-xl space-y-3 text-sm border border-zinc-100">
                                        <div className="flex justify-between py-2 border-b border-border/50">
                                            <span className="text-muted-foreground">Name</span>
                                            <span className="font-medium">{formData.name || '—'}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-border/50">
                                            <span className="text-muted-foreground">Email</span>
                                            <span className="font-medium">{formData.email || '—'}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-border/50">
                                            <span className="text-muted-foreground">Phone</span>
                                            <span className="font-medium">{formData.phone || '—'}</span>
                                        </div>
                                        <div className="flex justify-between py-2">
                                            <span className="text-muted-foreground">Case Type</span>
                                            <span className="font-medium">{formData.caseType || '—'}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3 pt-2">
                                        <Checkbox
                                            id="consent"
                                            name="consent"
                                            checked={formData.consent}
                                            onCheckedChange={(c) => handleChange("consent", c)}
                                        />
                                        <Label htmlFor="consent" className="text-sm font-normal text-muted-foreground leading-relaxed cursor-pointer">
                                            I understand this form is for intake purposes only and does not create an attorney-client relationship. I agree to the Privacy Policy.
                                        </Label>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <Button type="button" variant="outline" onClick={prevStep} size="lg" className="flex-1 h-12 rounded-full font-semibold">
                                            <ChevronLeft className="w-4 h-4 mr-2" /> Back
                                        </Button>
                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="flex-1 h-12 rounded-full font-semibold"
                                            disabled={!formData.consent || isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                'Submit Request'
                                            )}
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

function readPublicValue(value: string | undefined, fallback: string) {
  const trimmedValue = value?.trim();
  return trimmedValue || fallback;
}

function normalizePhoneHref(phoneDisplay: string, configuredHref?: string) {
  const trimmedHref = configuredHref?.trim();
  if (trimmedHref) {
    return trimmedHref;
  }

  const digits = phoneDisplay.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : "tel:+15551234567";
}

function normalizeEmailHref(email: string, configuredHref?: string) {
  const trimmedHref = configuredHref?.trim();
  if (trimmedHref) {
    return trimmedHref;
  }

  return `mailto:${email}`;
}

const phoneDisplay = readPublicValue(
  process.env.NEXT_PUBLIC_FIRM_PHONE_DISPLAY,
  "(555) 123-4567",
);
const email = readPublicValue(
  process.env.NEXT_PUBLIC_FIRM_EMAIL,
  "help@mtimmigration.com",
);

export const firmConfig = {
  name: readPublicValue(
    process.env.NEXT_PUBLIC_FIRM_NAME,
    "M&T Immigration Law Firm",
  ),
  shortName: readPublicValue(
    process.env.NEXT_PUBLIC_FIRM_SHORT_NAME,
    "M&T Immigration",
  ),
  brand: {
    logoSrc: "/brand/mtlogo.png",
    logoAlt: "M&T Immigration logo mark",
  },
  contact: {
    phoneDisplay,
    phoneHref: normalizePhoneHref(
      phoneDisplay,
      process.env.NEXT_PUBLIC_FIRM_PHONE_HREF,
    ),
    email,
    emailHref: normalizeEmailHref(
      email,
      process.env.NEXT_PUBLIC_FIRM_EMAIL_HREF,
    ),
    city: readPublicValue(process.env.NEXT_PUBLIC_FIRM_CITY, "New York, NY"),
    regionLabel: readPublicValue(
      process.env.NEXT_PUBLIC_FIRM_REGION_LABEL,
      "Virtual consultations nationwide",
    ),
    hours: readPublicValue(
      process.env.NEXT_PUBLIC_FIRM_HOURS,
      "Mon-Fri, 9AM - 6PM EST",
    ),
    responseTime: readPublicValue(
      process.env.NEXT_PUBLIC_FIRM_RESPONSE_TIME,
      "1-2 business days",
    ),
  },
} as const;

const CONTROL_CHAR_PATTERN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const MULTISPACE_PATTERN = /[^\S\r\n]+/g;
const MULTIBREAK_PATTERN = /\n{3,}/g;
const ANGLE_BRACKET_PATTERN = /[<>]/g;
const PHONE_ALLOWED_PATTERN = /[^0-9+().\-\sx]/gi;

type SanitizeOptions = {
  trim?: boolean;
  multiline?: boolean;
  lowercase?: boolean;
  maxLength?: number;
};

function sanitizeText(value: string, options: SanitizeOptions = {}) {
  const { trim = true, multiline = false, lowercase = false, maxLength } = options;

  // Early return for empty values
  if (!value || typeof value !== 'string') {
    return '';
  }

  // Enforce maximum length to prevent DoS
  const truncatedValue = maxLength ? value.slice(0, maxLength) : value;

  let nextValue = truncatedValue
    .replace(/\r\n?/g, '\n')
    .replace(CONTROL_CHAR_PATTERN, '')
    .replace(ANGLE_BRACKET_PATTERN, '')
    .replace(MULTISPACE_PATTERN, ' ');

  if (multiline) {
    nextValue = nextValue.replace(MULTIBREAK_PATTERN, '\n\n');
  } else {
    nextValue = nextValue.replace(/\n+/g, ' ');
  }

  if (lowercase) {
    nextValue = nextValue.toLowerCase();
  }

  return trim ? nextValue.trim() : nextValue;
}

// Default maximum lengths for different input types
const DEFAULT_MAX_LENGTHS = {
  singleLine: 200,
  multiline: 2000,
  email: 254, // RFC 5321
  phone: 40,
} as const;

export function sanitizeSingleLineText(
  value: string,
  options?: Omit<SanitizeOptions, 'multiline'> & { maxLength?: number }
) {
  const maxLength = options?.maxLength ?? DEFAULT_MAX_LENGTHS.singleLine;
  return sanitizeText(value, { ...options, multiline: false, maxLength });
}

export function sanitizeMultilineText(
  value: string,
  options?: Omit<SanitizeOptions, 'multiline'> & { maxLength?: number }
) {
  const maxLength = options?.maxLength ?? DEFAULT_MAX_LENGTHS.multiline;
  return sanitizeText(value, { ...options, multiline: true, maxLength });
}

export function sanitizeEmail(
  value: string,
  options?: Omit<SanitizeOptions, 'multiline'> & { maxLength?: number }
) {
  const maxLength = options?.maxLength ?? DEFAULT_MAX_LENGTHS.email;
  return sanitizeText(value, { ...options, multiline: false, lowercase: true, maxLength });
}

export const PHONE_MIN_DIGITS = 7;
export const PHONE_MAX_DIGITS = 15;

export function countPhoneDigits(value: string) {
  return value.replace(/\D/g, '').length;
}

export function hasReachablePhone(value: string) {
  const digits = countPhoneDigits(value);
  return digits >= PHONE_MIN_DIGITS && digits <= PHONE_MAX_DIGITS;
}

export function sanitizePhone(
  value: string,
  options?: Omit<SanitizeOptions, 'multiline' | 'lowercase'> & { maxLength?: number }
) {
  const maxLength = options?.maxLength ?? DEFAULT_MAX_LENGTHS.phone;
  if (!value || typeof value !== 'string') {
    return '';
  }

  const cleaned = value
    .replace(/\r\n?/g, ' ')
    .replace(CONTROL_CHAR_PATTERN, '')
    .replace(PHONE_ALLOWED_PATTERN, '')
    .replace(MULTISPACE_PATTERN, ' ')
    .trim();

  return cleaned.slice(0, maxLength);
}

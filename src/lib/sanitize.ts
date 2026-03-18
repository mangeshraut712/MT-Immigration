const CONTROL_CHAR_PATTERN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const MULTISPACE_PATTERN = /[^\S\r\n]+/g;
const MULTIBREAK_PATTERN = /\n{3,}/g;
const ANGLE_BRACKET_PATTERN = /[<>]/g;
const PHONE_ALLOWED_PATTERN = /[^0-9+().\-\sx]/gi;

type SanitizeOptions = {
  trim?: boolean;
  multiline?: boolean;
  lowercase?: boolean;
};

function sanitizeText(value: string, options: SanitizeOptions = {}) {
  const { trim = true, multiline = false, lowercase = false } = options;

  let nextValue = value
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

export function sanitizeSingleLineText(value: string, options?: Omit<SanitizeOptions, 'multiline'>) {
  return sanitizeText(value, { ...options, multiline: false });
}

export function sanitizeMultilineText(value: string, options?: Omit<SanitizeOptions, 'multiline'>) {
  return sanitizeText(value, { ...options, multiline: true });
}

export function sanitizeEmail(value: string, options?: Omit<SanitizeOptions, 'multiline'>) {
  return sanitizeText(value, { ...options, multiline: false, lowercase: true });
}

export function sanitizePhone(value: string, options?: Omit<SanitizeOptions, 'multiline' | 'lowercase'>) {
  const sanitized = sanitizeText(value, { ...options, multiline: false, lowercase: false });
  return sanitized.replace(PHONE_ALLOWED_PATTERN, '');
}

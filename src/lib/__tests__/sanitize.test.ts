import { sanitizeSingleLineText, sanitizeMultilineText, sanitizeEmail, sanitizePhone } from '../sanitize';

describe('sanitizeSingleLineText', () => {
    it('should return empty string for null input', () => {
        expect(sanitizeSingleLineText(null as unknown as string)).toBe('');
    });

    it('should return empty string for undefined input', () => {
        expect(sanitizeSingleLineText(undefined as unknown as string)).toBe('');
    });

    it('should trim whitespace from input', () => {
        expect(sanitizeSingleLineText('  test  ')).toBe('test');
    });

    it('should limit input length to default max (200 characters)', () => {
        const longInput = 'a'.repeat(300);
        const result = sanitizeSingleLineText(longInput);
        expect(result.length).toBe(200);
        expect(result).toBe('a'.repeat(200));
    });

    it('should remove angle brackets', () => {
        expect(sanitizeSingleLineText('<script>alert("xss")</script>Hello')).toBe('scriptalert("xss")/scriptHello');
    });

    it('should remove control characters', () => {
        expect(sanitizeSingleLineText('Hello\x00World')).toBe('HelloWorld');
    });

    it('should preserve safe text', () => {
        expect(sanitizeSingleLineText('Hello World 123')).toBe('Hello World 123');
    });

    it('should handle empty string', () => {
        expect(sanitizeSingleLineText('')).toBe('');
    });

    it('should handle string with only whitespace', () => {
        expect(sanitizeSingleLineText('   \n\t   ')).toBe('');
    });

    it('should return empty string for non-string input', () => {
        expect(sanitizeSingleLineText(123 as unknown as string)).toBe('');
        expect(sanitizeSingleLineText(true as unknown as string)).toBe('');
    });
});

describe('sanitizeMultilineText', () => {
    it('should preserve line breaks in multiline mode', () => {
        expect(sanitizeMultilineText('Line 1\nLine 2\n\nLine 3')).toBe('Line 1\nLine 2\n\nLine 3');
    });

    it('should limit to default multiline max length (2000)', () => {
        const longInput = 'a'.repeat(2500);
        const result = sanitizeMultilineText(longInput);
        expect(result.length).toBe(2000);
    });

    it('should remove excessive line breaks', () => {
        expect(sanitizeMultilineText('Line 1\n\n\n\nLine 2')).toBe('Line 1\n\nLine 2');
    });
});

describe('sanitizeEmail', () => {
    it('should convert email to lowercase', () => {
        expect(sanitizeEmail('Test@Example.COM')).toBe('test@example.com');
    });

    it('should limit to email max length (254)', () => {
        const longEmail = 'a'.repeat(300) + '@example.com';
        const result = sanitizeEmail(longEmail);
        expect(result.length).toBeLessThanOrEqual(254);
    });
});

describe('sanitizePhone', () => {
    it('should remove non-phone characters', () => {
        expect(sanitizePhone('+1 (555) 123-4567 ext 123')).toBe('+1 (555) 123-4567 x');
    });

    it('should limit to phone max length (20)', () => {
        const longPhone = '+123456789012345678901234567890';
        const result = sanitizePhone(longPhone);
        expect(result.length).toBeLessThanOrEqual(20);
    });
});
/**
 * COVID-19 Portal - Input Validation & Regular Expressions Engine
 * 
 * Regular Expression Specifications:
 * - Name:     ^[A-Za-z ]{2,50}$               (2-50 letters/spaces)
 * - Email:    ^[^\s@]+@[^\s@]+\.[^\s@]+$      (Standard email structure)
 * - Mobile:   ^[6-9][0-9]{9}$                 (10 digits starting with 6, 7, 8, or 9)
 * - Password: ^(?=.*[A-Za-z])(?=.*\d).{8,}$   (At least 8 chars, 1 letter, 1 number)
 */

export const REGEX_RULES = {
  name: {
    pattern: /^[A-Za-z ]{2,50}$/,
    patternString: '^[A-Za-z ]{2,50}$',
    label: 'Full Name',
    description: '2 to 50 characters, letters and spaces only',
    validExample: 'Omkar Ahirrao',
    invalidExamples: ['A', 'Omkar123', 'Omkar@Ahirrao', '', 'A'.repeat(51)],
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    patternString: '^[^\s@]+@[^\s@]+\\.[^\s@]+$',
    label: 'Email Address',
    description: 'Standard valid email with user, @, domain, and extension',
    validExample: 'omkar@gmail.com',
    invalidExamples: ['omkar@gmail', 'omkar.com', '@gmail.com', 'omkar @gmail.com', ''],
  },
  mobile: {
    pattern: /^[6-9][0-9]{9}$/,
    patternString: '^[6-9][0-9]{9}$',
    label: 'Mobile Number',
    description: '10 digits Indian mobile format, starting with 6, 7, 8, or 9',
    validExample: '9876543210',
    invalidExamples: ['987654321', '98765432100', '5876543210', '98765abcd0', ''],
  },
  password: {
    pattern: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
    patternString: '^(?=.*[A-Za-z])(?=.*\\d).{8,}$',
    label: 'Password',
    description: 'Minimum 8 characters, containing at least one letter and one number',
    validExample: 'Omkar123',
    invalidExamples: ['omkar', '12345678', 'short1', 'Omk@r', ''],
  },
};

/**
 * Validate Name against Regex
 */
export function validateName(name: string): { valid: boolean; error?: string } {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Name field cannot be empty.' };
  }
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters long.' };
  }
  if (trimmed.length > 50) {
    return { valid: false, error: 'Name cannot exceed 50 characters.' };
  }
  if (!REGEX_RULES.name.pattern.test(trimmed)) {
    return { valid: false, error: 'Name must contain only alphabets and spaces.' };
  }
  return { valid: true };
}

/**
 * Validate Email against Regex
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email address cannot be empty.' };
  }
  const trimmed = email.trim();
  if (!REGEX_RULES.email.pattern.test(trimmed)) {
    return { valid: false, error: 'Please enter a valid email address (e.g., user@example.com).' };
  }
  return { valid: true };
}

/**
 * Validate Mobile Number against Regex
 */
export function validateMobile(mobile: string): { valid: boolean; error?: string } {
  if (!mobile || typeof mobile !== 'string') {
    return { valid: false, error: 'Mobile number cannot be empty.' };
  }
  const cleaned = mobile.trim();
  if (!REGEX_RULES.mobile.pattern.test(cleaned)) {
    return { valid: false, error: 'Mobile number must be exactly 10 digits starting with 6, 7, 8, or 9.' };
  }
  return { valid: true };
}

/**
 * Validate Password against Regex
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password cannot be empty.' };
  }
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long.' };
  }
  if (!REGEX_RULES.password.pattern.test(password)) {
    return { valid: false, error: 'Password must contain at least one letter and one number.' };
  }
  return { valid: true };
}

/**
 * Validate Comment text
 */
export function validateComment(text: string): { valid: boolean; error?: string } {
  if (!text || typeof text !== 'string') {
    return { valid: false, error: 'Comment cannot be empty.' };
  }
  const trimmed = text.trim();
  if (trimmed.length < 2) {
    return { valid: false, error: 'Comment must be at least 2 characters.' };
  }
  if (trimmed.length > 500) {
    return { valid: false, error: 'Comment cannot exceed 500 characters.' };
  }
  return { valid: true };
}

/**
 * Validate Feedback message
 */
export function validateFeedback(message: string): { valid: boolean; error?: string } {
  if (!message || typeof message !== 'string') {
    return { valid: false, error: 'Feedback message cannot be empty.' };
  }
  const trimmed = message.trim();
  if (trimmed.length < 5) {
    return { valid: false, error: 'Feedback message must be at least 5 characters.' };
  }
  if (trimmed.length > 1000) {
    return { valid: false, error: 'Feedback message cannot exceed 1000 characters.' };
  }
  return { valid: true };
}

/**
 * Sanitize HTML to prevent Stored & Reflected XSS
 * Safely converts characters <, >, &, ", ', / to HTML entities
 */
export function sanitizeHtml(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Password strength evaluator for client UI feedback
 */
export function getPasswordStrength(password: string): {
  score: number; // 0 to 4
  label: 'Weak' | 'Fair' | 'Good' | 'Strong';
  hasMinLength: boolean;
  hasLetter: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
} {
  const hasMinLength = password.length >= 8;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  let score = 0;
  if (hasMinLength) score++;
  if (hasLetter) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;

  let label: 'Weak' | 'Fair' | 'Good' | 'Strong' = 'Weak';
  if (score >= 4) label = 'Strong';
  else if (score === 3) label = 'Good';
  else if (score === 2) label = 'Fair';

  return {
    score,
    label,
    hasMinLength,
    hasLetter,
    hasNumber,
    hasSpecial,
  };
}

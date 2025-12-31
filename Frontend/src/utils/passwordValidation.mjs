/**
 * Password validation utilities
 */

// Password requirements
export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false,
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {{valid: boolean, errors: string[]}} Validation result
 */
export const validatePassword = (password) => {
  const errors = [];

  if (!password) {
    return { valid: false, errors: ['Password is required'] };
  }

  // Check minimum length
  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(
      `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`
    );
  }

  // Check for uppercase letter
  if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  // Check for lowercase letter
  if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  // Check for numbers
  if (PASSWORD_REQUIREMENTS.requireNumbers && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // Check for special characters
  if (
    PASSWORD_REQUIREMENTS.requireSpecialChars &&
    !/[!@#$%^&*(),.?":{}|<>]/.test(password)
  ) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors: errors,
  };
};

/**
 * Get password strength score (0-4)
 * @param {string} password - Password to evaluate
 * @returns {number} Strength score (0=weak, 4=very strong)
 */
export const getPasswordStrength = (password) => {
  if (!password) return 0;

  let score = 0;

  // Length check
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // Character variety
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

  return Math.min(score, 4);
};

/**
 * Get password strength label
 * @param {string} password - Password to evaluate
 * @returns {string} Strength label
 */
export const getPasswordStrengthLabel = (password) => {
  const strength = getPasswordStrength(password);
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Very Strong'];
  return labels[strength] || 'Very Weak';
};

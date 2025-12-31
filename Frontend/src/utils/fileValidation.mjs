/**
 * File validation utilities for secure file uploads
 */

// Maximum file size: 500KB
export const MAX_FILE_SIZE = 500 * 1024;

// Allowed image MIME types
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

// Allowed image file extensions
export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

/**
 * Validate file type by MIME type
 * @param {File} file - File object to validate
 * @returns {boolean} True if file type is allowed
 */
export const validateFileType = (file) => {
  if (!file || !file.type) {
    return false;
  }
  return ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase());
};

/**
 * Validate file type by extension
 * @param {string} filename - File name
 * @returns {boolean} True if extension is allowed
 */
export const validateFileExtension = (filename) => {
  if (!filename) {
    return false;
  }
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return ALLOWED_IMAGE_EXTENSIONS.includes(extension);
};

/**
 * Validate file size
 * @param {File} file - File object to validate
 * @returns {boolean} True if file size is within limit
 */
export const validateFileSize = (file) => {
  if (!file || !file.size) {
    return false;
  }
  return file.size <= MAX_FILE_SIZE;
};

/**
 * Comprehensive file validation
 * @param {File} file - File object to validate
 * @returns {{valid: boolean, error: string|null}} Validation result
 */
export const validateFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  // Check file size
  if (!validateFileSize(file)) {
    return {
      valid: false,
      error: `File size exceeds ${MAX_FILE_SIZE / 1024}KB limit`,
    };
  }

  // Check file type (MIME type)
  if (!validateFileType(file)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
    };
  }

  // Check file extension
  if (!validateFileExtension(file.name)) {
    return {
      valid: false,
      error: `File extension not allowed. Allowed extensions: ${ALLOWED_IMAGE_EXTENSIONS.join(', ')}`,
    };
  }

  return { valid: true, error: null };
};

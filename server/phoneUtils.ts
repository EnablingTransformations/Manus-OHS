/**
 * Phone number validation and normalization utilities.
 * Ensures phone numbers are in correct E.164 format: +15551234567
 */

/**
 * Validates phone number format (10 or 11 digits for US/Canada)
 * @param phone - Raw phone number input
 * @returns true if valid format
 */
export const validatePhoneNumber = (phone: string): boolean => {
  if (!phone || typeof phone !== "string") return false;

  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, "");

  // Valid if 10 digits (US) or 11 digits (US with country code 1)
  return digitsOnly.length === 10 || digitsOnly.length === 11;
};

/**
 * Normalizes phone number to E.164 format: +15551234567
 * @param phone - Raw phone number input
 * @returns Normalized phone number or empty string if invalid
 * @throws Error if phone number is invalid
 */
export const normalizePhoneNumber = (phone: string): string => {
  if (!phone || typeof phone !== "string") {
    throw new Error("Phone number must be a non-empty string");
  }

  // Remove all non-digit characters
  let digitsOnly = phone.replace(/\D/g, "");

  // Validate length
  if (digitsOnly.length === 10) {
    // Assume US number, add country code 1
    digitsOnly = "1" + digitsOnly;
  } else if (digitsOnly.length === 11) {
    // Check if starts with 1 (US country code)
    if (!digitsOnly.startsWith("1")) {
      throw new Error("11-digit numbers must start with country code 1");
    }
  } else {
    throw new Error(
      `Invalid phone number length: ${digitsOnly.length}. Expected 10 or 11 digits.`
    );
  }

  // Return in E.164 format: +1234567890
  return "+" + digitsOnly;
};

/**
 * Validates and normalizes phone number in one step
 * @param phone - Raw phone number input
 * @returns Normalized phone number or null if invalid
 */
export const validateAndNormalizePhoneNumber = (
  phone: string | undefined
): string | null => {
  if (!phone) return null;

  try {
    if (!validatePhoneNumber(phone)) {
      return null;
    }
    return normalizePhoneNumber(phone);
  } catch {
    return null;
  }
};

/**
 * Extracts digits from phone number
 * @param phone - Phone number in any format
 * @returns Only digits
 */
export const extractDigits = (phone: string): string => {
  return phone.replace(/\D/g, "");
};

/**
 * Formats phone number for display (US format)
 * @param phone - Phone number in E.164 format (+15551234567)
 * @returns Formatted number: (555) 123-4567
 */
export const formatPhoneForDisplay = (phone: string): string => {
  const digits = extractDigits(phone);

  // Remove leading 1 if US number
  const localDigits = digits.startsWith("1") ? digits.slice(1) : digits;

  if (localDigits.length !== 10) {
    return phone; // Return original if not 10 digits
  }

  return `(${localDigits.slice(0, 3)}) ${localDigits.slice(3, 6)}-${localDigits.slice(6)}`;
};

/**
 * Checks if phone number is valid for SMS sending
 * @param phone - Phone number in E.164 format
 * @returns true if valid for SMS
 */
export const isValidForSMS = (phone: string): boolean => {
  // Must start with +
  if (!phone.startsWith("+")) return false;

  // Must have digits after +
  const digits = extractDigits(phone);
  if (digits.length < 10 || digits.length > 15) return false;

  // Must be numeric
  return /^\d+$/.test(digits);
};

// Export types for TypeScript
export type PhoneValidationResult = {
  valid: boolean;
  normalized?: string;
  error?: string;
};

/**
 * Comprehensive phone validation with detailed results
 */
export const validatePhoneComprehensive = (
  phone: string
): PhoneValidationResult => {
  if (!phone || typeof phone !== "string") {
    return {
      valid: false,
      error: "Phone number must be a non-empty string",
    };
  }

  const digitsOnly = phone.replace(/\D/g, "");

  if (digitsOnly.length === 0) {
    return {
      valid: false,
      error: "Phone number must contain at least one digit",
    };
  }

  if (digitsOnly.length < 10) {
    return {
      valid: false,
      error: `Phone number too short: ${digitsOnly.length} digits (minimum 10)`,
    };
  }

  if (digitsOnly.length > 11) {
    return {
      valid: false,
      error: `Phone number too long: ${digitsOnly.length} digits (maximum 11)`,
    };
  }

  try {
    const normalized = normalizePhoneNumber(phone);
    return {
      valid: true,
      normalized,
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

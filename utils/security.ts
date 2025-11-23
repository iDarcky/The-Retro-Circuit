/**
 * Basic XSS prevention by escaping HTML characters.
 * This should run before sending data to an API or displaying user content.
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Validates review content for length and malicious patterns.
 */
export const validateReview = (text: string): { isValid: boolean; error?: string } => {
  const trimmed = text.trim();
  
  if (trimmed.length < 10) {
    return { isValid: false, error: "Review is too short. Please provide more detail (min 10 chars)." };
  }
  
  if (trimmed.length > 500) {
    return { isValid: false, error: "Review is too long. Please summarize (max 500 chars)." };
  }

  // Check for potential HTML/Script injection attempts
  if (/[<>\[\]\{\}]/.test(trimmed)) {
     return { isValid: false, error: "Special characters < > [ ] { } are not allowed." };
  }
  
  // Check for spam (repeating characters excessively)
  if (/(.)\1{9,}/.test(trimmed)) {
    return { isValid: false, error: "Spam detected (repeating characters)." };
  }

  return { isValid: true };
};
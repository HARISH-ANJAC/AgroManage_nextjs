/**
 * Utility functions for common data validation patterns
 */

export const validateTin = (tin: string | undefined): boolean => {
  if (!tin) return true; // Optional by default, use required in form config
  return /^\d{9}$/.test(tin);
};

export const validateEmail = (email: string | undefined): boolean => {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateWebsite = (website: string | undefined): boolean => {
  if (!website) return true;
  return /^https?:\/\/.+/.test(website);
};

export const validateTanzaniaPhone = (phone: string | undefined): boolean => {
  if (!phone) return true;
  // Strip spaces and check for +255 followed by 9-12 digits
  // Or check if it's already just the 9-12 digits if stripped
  const cleanPhone = phone.replace(/[\s+]/g, "");
  // If it starts with 255 followed by 9-12 digits
  if (cleanPhone.startsWith("255")) {
    return /^255\d{9,12}$/.test(cleanPhone);
  }
  // If it's just the digits
  return /^\d{9,12}$/.test(cleanPhone);
};

export const formatTanzaniaPhone = (val: string | undefined): string => {
  if (!val) return "";
  
  // Clean only non-digits, but keep a leading + if present temporarily
  let clean = val.replace(/[^\d]/g, "");
  
  // Always ensure it starts with 255 for Tanzania internally in the formatted string
  if (!clean.startsWith("255")) {
    // If user starts typing a 7 or 0, we assume it's the start of the 9 digits
    if (clean.length > 0) {
      if (clean.startsWith("0")) clean = clean.substring(1);
      clean = "255" + clean;
    } else {
      return "";
    }
  }

  // Max 12 digits (255 + 9 digits)
  clean = clean.substring(0, 12);
  
  let result = "+255";
  const rest = clean.substring(3);
  
  if (rest.length > 0) result += " " + rest.substring(0, 2);
  if (rest.length > 2) result += " " + rest.substring(2, 5);
  if (rest.length > 5) result += " " + rest.substring(5);
  
  return result;
};

export const cleanPhoneForStorage = (phone: string | undefined): string => {
  if (!phone) return "";
  const clean = phone.replace(/[^\d]/g, "");
  if (clean.startsWith("255")) return clean.substring(3);
  return clean;
};

/**
 * Throws an error with a descriptive message if validation fails
 */
export const enforceValidation = (form: Record<string, any>) => {
  if (form.tinNumber && !validateTin(form.tinNumber)) {
    throw new Error("TIN Number must be exactly 9 digits.");
  }

  if (form.email && !validateEmail(form.email)) {
    throw new Error("Invalid Email format.");
  }

  if (form.website && !validateWebsite(form.website)) {
    throw new Error("Website must start with http:// or https://");
  }

  if (form.contactNumber && !validateTanzaniaPhone(form.contactNumber)) {
    throw new Error("Contact Number must be in Tanzania format (e.g., +255XXXXXXXXX).");
  }

  return true;
};

/**
 * Validates store-specific fields (email addresses)
 */
export const enforceStoreValidation = (form: Record<string, any>) => {
  if (form.emailAddress && !validateEmail(form.emailAddress)) {
    throw new Error("Email Address is invalid.");
  }

  if (form.ccEmailAddress && !validateEmail(form.ccEmailAddress)) {
    throw new Error("CC Email Address is invalid.");
  }

  if (form.bccEmailAddress && !validateEmail(form.bccEmailAddress)) {
    throw new Error("BCC Email Address is invalid.");
  }

  return true;
};

/**
 * Validates supplier-specific fields
 */
export const enforceSupplierValidation = (form: Record<string, any>) => {
  if (form.tinNumber && !validateTin(form.tinNumber)) {
    throw new Error("TIN Number must be exactly 9 digits.");
  }

  if (form.mailId && !validateEmail(form.mailId)) {
    throw new Error("Invalid Email format.");
  }

  if (form.phoneNumber && !validateTanzaniaPhone(form.phoneNumber)) {
    throw new Error("Phone Number must be in Tanzania format (e.g., +255XXXXXXXXX).");
  }

  return true;
};

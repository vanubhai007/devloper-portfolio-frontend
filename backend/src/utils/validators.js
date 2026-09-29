/*
 * Lightweight request validators. Each returns { data, errors } where `data`
 * contains only the whitelisted, trimmed fields.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+]?[\d\s()-]{7,20}$/;
const OBJECT_ID_RE = /^[a-f\d]{24}$/i;

const str = (value) => (typeof value === 'string' ? value.trim() : '');

export const CONTACT_LIMITS = { name: 80, email: 120, phone: 20, subject: 150, message: 3000 };

export function validateContact(body = {}) {
  const data = {
    name: str(body.name),
    email: str(body.email).toLowerCase(),
    phone: str(body.phone),
    subject: str(body.subject),
    message: str(body.message),
  };
  const errors = {};

  if (data.name.length < 2 || data.name.length > CONTACT_LIMITS.name) {
    errors.name = `Name must be between 2 and ${CONTACT_LIMITS.name} characters.`;
  }
  if (!EMAIL_RE.test(data.email) || data.email.length > CONTACT_LIMITS.email) {
    errors.email = 'Please provide a valid email address.';
  }
  if (data.phone && !PHONE_RE.test(data.phone)) {
    errors.phone = 'Please provide a valid phone number.';
  }
  if (data.subject.length < 3 || data.subject.length > CONTACT_LIMITS.subject) {
    errors.subject = `Subject must be between 3 and ${CONTACT_LIMITS.subject} characters.`;
  }
  if (data.message.length < 10 || data.message.length > CONTACT_LIMITS.message) {
    errors.message = `Message must be between 10 and ${CONTACT_LIMITS.message} characters.`;
  }
  return { data, errors };
}

export function validateLogin(body = {}) {
  const data = { email: str(body.email).toLowerCase(), password: typeof body.password === 'string' ? body.password : '' };
  const errors = {};
  if (!EMAIL_RE.test(data.email)) errors.email = 'Please provide a valid email address.';
  if (!data.password || data.password.length > 200) errors.password = 'Please provide your password.';
  return { data, errors };
}

export function validateReadToggle(body = {}) {
  const errors = {};
  if (typeof body.isRead !== 'boolean') errors.isRead = 'isRead must be true or false.';
  return { data: { isRead: body.isRead }, errors };
}

export const isObjectId = (value) => typeof value === 'string' && OBJECT_ID_RE.test(value);

/** Escapes user input for safe use inside a RegExp. */
export const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Mirrors the backend rules so users get instant feedback.
// The backend re-validates everything — never trust the client alone.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+]?[\d\s()-]{7,20}$/;

export const CONTACT_LIMITS = { name: 80, email: 120, phone: 20, subject: 150, message: 3000 };

export function validateContact(values) {
  const errors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();
  const subject = values.subject.trim();
  const message = values.message.trim();

  if (name.length < 2) errors.name = 'Please enter your name (at least 2 characters).';
  else if (name.length > CONTACT_LIMITS.name) errors.name = `Name must be under ${CONTACT_LIMITS.name} characters.`;

  if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.';

  if (phone && !PHONE_RE.test(phone)) errors.phone = 'Please enter a valid phone number.';

  if (subject.length < 3) errors.subject = 'Subject must be at least 3 characters.';
  else if (subject.length > CONTACT_LIMITS.subject) errors.subject = `Subject must be under ${CONTACT_LIMITS.subject} characters.`;

  if (message.length < 10) errors.message = 'Message must be at least 10 characters.';
  else if (message.length > CONTACT_LIMITS.message) errors.message = `Message must be under ${CONTACT_LIMITS.message} characters.`;

  return errors;
}

export const isValidEmail = (value) => EMAIL_RE.test(value.trim());

import { Contact } from '../models/Contact.js';
import { sendContactEmails } from '../utils/mailer.js';

const SUCCESS_MESSAGE = "Thanks! Your message has been sent. I'll get back to you soon.";

/** POST /api/contact — validates (middleware), stores, then emails. */
export async function createContact(req, res) {
  // Honeypot: real users never fill the hidden "website" field.
  // Pretend success so bots don't learn they were blocked.
  if (req.honeypotTriggered) {
    return res.status(201).json({ success: true, message: SUCCESS_MESSAGE });
  }

  const contact = await Contact.create(req.body);

  // Respond immediately; email delivery must not block or fail the request.
  res.status(201).json({ success: true, message: SUCCESS_MESSAGE, data: { id: contact._id } });
  sendContactEmails(contact);
}

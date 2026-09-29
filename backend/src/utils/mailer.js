import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { ownerNotification, visitorAcknowledgement } from './emailTemplates.js';
import { logger } from './logger.js';

const OWNER_NAME = 'Vanraj';
const enabled = Boolean(env.email.user && env.email.password && env.email.owner);

const transporter = enabled
  ? nodemailer.createTransport(
      env.email.host
        ? {
            host: env.email.host,
            port: env.email.port,
            secure: env.email.port === 465,
            auth: { user: env.email.user, pass: env.email.password },
          }
        : { service: 'gmail', auth: { user: env.email.user, pass: env.email.password } },
    )
  : null;

export async function verifyMailer() {
  if (!enabled) {
    logger.warn('Email is not configured (EMAIL_USER / EMAIL_PASSWORD / OWNER_EMAIL). Messages will be saved but not emailed.');
    return;
  }
  try {
    await transporter.verify();
    logger.info('Mail transporter ready');
  } catch (err) {
    logger.error('Mail transporter verification failed:', err.message);
  }
}

/**
 * Sends the owner notification (and optional visitor acknowledgement).
 * Never throws — the message is already saved, so email is best-effort.
 */
export async function sendContactEmails(contact) {
  if (!enabled) return;
  const from = `"${OWNER_NAME} Portfolio" <${env.email.user}>`;

  const jobs = [
    transporter.sendMail({ from, to: env.email.owner, replyTo: contact.email, ...ownerNotification(contact) }),
  ];
  if (env.email.sendAck) {
    jobs.push(transporter.sendMail({ from, to: contact.email, ...visitorAcknowledgement(contact, OWNER_NAME) }));
  }

  const results = await Promise.allSettled(jobs);
  results.forEach((r, i) => {
    if (r.status === 'rejected') logger.error(`Email ${i === 0 ? 'to owner' : 'to visitor'} failed:`, r.reason?.message);
  });
}

/* HTML email templates. All user input is escaped before insertion. */
const escapeHtml = (value = '') =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const layout = (title, body) => `<!doctype html>
<html><body style="margin:0;background:#05060f;font-family:Arial,Helvetica,sans-serif;color:#e8ecf8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#0a0c1b;border:1px solid #1f2437;border-radius:14px;">
        <tr><td style="height:4px;background:linear-gradient(90deg,#22d3ee,#3b82f6,#a855f7);border-radius:14px 14px 0 0;"></td></tr>
        <tr><td style="padding:28px;">
          <h1 style="margin:0 0 18px;font-size:20px;color:#ffffff;">${title}</h1>
          ${body}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

const row = (label, value) =>
  `<tr><td style="padding:6px 0;color:#9aa3bd;width:90px;vertical-align:top;">${label}</td><td style="padding:6px 0;color:#e8ecf8;">${value}</td></tr>`;

export function ownerNotification(contact) {
  const name = escapeHtml(contact.name);
  const email = escapeHtml(contact.email);
  const html = layout(
    'New portfolio message',
    `<table cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;margin-bottom:18px;">
      ${row('Name', name)}
      ${row('Email', `<a href="mailto:${email}" style="color:#22d3ee;">${email}</a>`)}
      ${contact.phone ? row('Phone', escapeHtml(contact.phone)) : ''}
      ${row('Subject', escapeHtml(contact.subject))}
    </table>
    <div style="padding:16px;background:#05060f;border:1px solid #1f2437;border-radius:10px;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(contact.message)}</div>
    <p style="margin:18px 0 0;font-size:12px;color:#6b7390;">Reply directly to this email to respond to ${name}.</p>`,
  );
  const text = `New portfolio message\n\nName: ${contact.name}\nEmail: ${contact.email}\nPhone: ${contact.phone || '-'}\nSubject: ${contact.subject}\n\n${contact.message}`;
  return { subject: `Portfolio: ${contact.subject}`.slice(0, 180), html, text };
}

export function visitorAcknowledgement(contact, ownerName) {
  const name = escapeHtml(contact.name);
  const html = layout(
    `Thanks for reaching out, ${name}!`,
    `<p style="font-size:14px;line-height:1.7;color:#c9cfe0;margin:0 0 14px;">I've received your message about <strong style="color:#ffffff;">"${escapeHtml(contact.subject)}"</strong> and will get back to you as soon as possible.</p>
    <p style="font-size:14px;line-height:1.7;color:#c9cfe0;margin:0 0 20px;">Best regards,<br/><strong style="color:#22d3ee;">${escapeHtml(ownerName)}</strong><br/>Full Stack Developer</p>
    <p style="font-size:12px;color:#6b7390;margin:0;">This is an automatic confirmation. You don't need to reply.</p>`,
  );
  const text = `Hi ${contact.name},\n\nThanks for reaching out! I've received your message about "${contact.subject}" and will get back to you as soon as possible.\n\nBest regards,\n${ownerName}`;
  return { subject: 'Thanks for your message!', html, text };
}

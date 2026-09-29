import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { FiAlertCircle, FiCheckCircle, FiMail, FiMapPin, FiPhone, FiSend } from 'react-icons/fi';
import GlassCard from '../components/GlassCard';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import SocialLinks from '../components/SocialLinks';
import { siteConfig } from '../config/siteConfig';
import { sendContactMessage } from '../services/contactService';
import { CONTACT_LIMITS, validateContact } from '../utils/validators';
import styles from './Contact.module.css';

const EMPTY = { name: '', email: '', phone: '', subject: '', message: '', website: '' };

const FIELDS = [
  { name: 'name', label: 'Your name', type: 'text', autoComplete: 'name', placeholder: 'John Doe' },
  { name: 'email', label: 'Email address', type: 'email', autoComplete: 'email', placeholder: 'john@example.com' },
  { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel', placeholder: '+91 98765 43210', optional: true },
  { name: 'subject', label: 'Subject', type: 'text', autoComplete: 'off', placeholder: 'Project enquiry' },
];

export default function Contact() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [serverMessage, setServerMessage] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((err) => ({ ...err, [name]: undefined }));
  };

  const submit = async (e) => {
    e?.preventDefault();
    const found = validateContact(values);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`contact-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    setStatus('loading');
    setServerMessage('');
    try {
      const res = await sendContactMessage({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
        website: values.website, // honeypot — must stay empty
      });
      setStatus('success');
      setServerMessage(res.message || 'Thanks! Your message has been sent.');
      setValues(EMPTY);
    } catch (err) {
      setStatus('error');
      setServerMessage(err.message);
      if (err.fields && Object.keys(err.fields).length) setErrors(err.fields);
    }
  };

  const fieldProps = (name) => ({
    id: `contact-${name}`,
    name,
    value: values[name],
    onChange,
    className: 'input',
    maxLength: CONTACT_LIMITS[name],
    'aria-invalid': errors[name] ? 'true' : 'false',
    'aria-describedby': errors[name] ? `contact-${name}-error` : undefined,
  });

  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="container">
        <SectionHeading
          id="contact-title"
          eyebrow="10 — Contact"
          title="Let's build"
          highlight="something together."
          subtitle="Have a project, a job opportunity or a question? Send me a message and I'll get back to you."
        />
        <div className={styles.grid}>
          <Reveal className={styles.info}>
            <GlassCard className={styles.infoItem}>
              <span className={styles.infoIcon} aria-hidden="true">
                <FiMail />
              </span>
              <div>
                <span className={styles.infoLabel}>Email</span>
                <a className={styles.infoValue} href={`mailto:${siteConfig.email}`}>
                  {siteConfig.email}
                </a>
              </div>
            </GlassCard>
            <GlassCard className={styles.infoItem}>
              <span className={styles.infoIcon} aria-hidden="true">
                <FiPhone />
              </span>
              <div>
                <span className={styles.infoLabel}>Phone</span>
                <a className={styles.infoValue} href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}>
                  {siteConfig.phone}
                </a>
              </div>
            </GlassCard>
            <GlassCard className={styles.infoItem}>
              <span className={styles.infoIcon} aria-hidden="true">
                <FiMapPin />
              </span>
              <div>
                <span className={styles.infoLabel}>Location</span>
                <span className={styles.infoValue}>{siteConfig.location}</span>
              </div>
            </GlassCard>
            <GlassCard className={styles.socialWrap} interactive={false}>
              <p>Find me online</p>
              <SocialLinks />
            </GlassCard>
          </Reveal>

          <Reveal delay={0.1}>
            <GlassCard as="form" className={styles.form} onSubmit={submit} noValidate interactive={false} aria-label="Contact form">
              <div className={styles.row}>
                {FIELDS.map((f) => (
                  <div className="field" key={f.name}>
                    <label htmlFor={`contact-${f.name}`}>
                      {f.label} {f.optional ? <span className={styles.optional}>(optional)</span> : <span aria-hidden="true">*</span>}
                    </label>
                    <input
                      type={f.type}
                      autoComplete={f.autoComplete}
                      placeholder={f.placeholder}
                      required={!f.optional}
                      {...fieldProps(f.name)}
                    />
                    {errors[f.name] && (
                      <span id={`contact-${f.name}-error`} className="field-error">
                        {errors[f.name]}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="field">
                <label htmlFor="contact-message">
                  Message <span aria-hidden="true">*</span>
                </label>
                <textarea placeholder="Tell me about your project…" required rows={6} {...fieldProps('message')} />
                <span className={styles.counter} aria-hidden="true">
                  {values.message.length}/{CONTACT_LIMITS.message}
                </span>
                {errors.message && (
                  <span id="contact-message-error" className="field-error">
                    {errors.message}
                  </span>
                )}
              </div>

              {/* Honeypot field: hidden from humans, bots tend to fill it. */}
              <div className={styles.hp} aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={onChange} />
              </div>

              <div aria-live="polite">
                <AnimatePresence mode="wait">
                  {status === 'success' && (
                    <motion.div key="ok" className="alert alert-success" role="status" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <FiCheckCircle aria-hidden="true" style={{ marginTop: 3 }} />
                      <span>{serverMessage}</span>
                    </motion.div>
                  )}
                  {status === 'error' && (
                    <motion.div key="err" className="alert alert-error" role="alert" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <FiAlertCircle aria-hidden="true" style={{ marginTop: 3 }} />
                      <span>{serverMessage}</span>
                      <button type="button" className={styles.retry} onClick={submit}>
                        Retry
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className={styles.submitRow}>
                <p className={styles.privacy}>Your details are only used to reply to your message.</p>
                <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
                  {status === 'loading' ? (
                    <>
                      <span className="spinner" aria-hidden="true" /> Sending…
                    </>
                  ) : (
                    <>
                      <FiSend aria-hidden="true" /> Send Message
                    </>
                  )}
                </button>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

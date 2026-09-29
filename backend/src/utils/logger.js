/* Minimal leveled logger. Replace with pino/winston if you need structured logs. */
const stamp = () => new Date().toISOString();

export const logger = {
  info: (...args) => console.info(`[${stamp()}] INFO`, ...args),
  warn: (...args) => console.warn(`[${stamp()}] WARN`, ...args),
  error: (...args) => console.error(`[${stamp()}] ERROR`, ...args),
};

/*
 * Removes keys that could be used for MongoDB operator injection
 * (keys starting with "$" or containing "."). Applied to body and params.
 * Note: in Express 5 `req.query` is a read-only getter, so controllers
 * coerce every query value to a string before using it.
 */
function clean(value) {
  if (Array.isArray(value)) return value.map(clean);
  if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) {
      if (key.startsWith('$') || key.includes('.')) delete value[key];
      else value[key] = clean(value[key]);
    }
  }
  return value;
}

export function sanitize(req, res, next) {
  if (req.body) clean(req.body);
  if (req.params) clean(req.params);
  next();
}

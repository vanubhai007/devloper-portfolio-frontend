import { AppError } from '../utils/AppError.js';

/** Runs a validator on req.body and replaces it with the cleaned data. */
export const validate = (validator) => (req, res, next) => {
  const { data, errors } = validator(req.body);
  if (Object.keys(errors).length) {
    return next(new AppError('Please correct the highlighted fields.', 400, errors));
  }
  req.body = data;
  next();
};

/** Rejects requests whose :id param is not a valid MongoDB ObjectId. */
export const validateObjectId = (param = 'id') => (req, res, next) => {
  if (!/^[a-f\d]{24}$/i.test(req.params[param] || '')) {
    return next(new AppError('Invalid ID.', 400));
  }
  next();
};

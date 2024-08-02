import { validationResult } from "express-validator";

export const validate = validations => {
  return async (req, res, next) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    // 서버가 안죽었으면
    res.status(400).json({ errors: errors.array() });
  };
};

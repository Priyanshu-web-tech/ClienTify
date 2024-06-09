// errorHandler.js
import { ApiError } from '../utils/ApiError.js'; // Adjust the import path as needed

const errorHandler = (err, req, res, next) => {
    console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};

export { errorHandler };

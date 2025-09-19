import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { logger } from '@/utils/logger';

// Generic validation middleware
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Validate request body, query, and params without modifying the original request
      const dataToValidate = {
        body: req.body,
        query: req.query,
        params: req.params,
      };

      const validatedData = schema.parse(dataToValidate) as any;
      
      // Only replace body (query and params are read-only in newer Express versions)
      req.body = validatedData.body || req.body;

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = (error as any).errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        logger.warn('Validation error:', { errors: errorMessages, body: req.body });

        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errorMessages,
        });
        return;
      }

      logger.error('Validation middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
};

// Specific validation middlewares for different request parts
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body) as any;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = (error as any).errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        logger.warn('Body validation error:', { errors: errorMessages, body: req.body });

        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errorMessages,
        });
        return;
      }

      logger.error('Body validation middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Validate query parameters without modifying the original request
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = (error as any).errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        logger.warn('Query validation error:', { errors: errorMessages, query: req.query });

        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errorMessages,
        });
        return;
      }

      logger.error('Query validation middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Validate params without modifying the original request
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = (error as any).errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        logger.warn('Params validation error:', { errors: errorMessages, params: req.params });

        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errorMessages,
        });
        return;
      }

      logger.error('Params validation middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
};

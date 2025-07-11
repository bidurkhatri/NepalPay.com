import { Request, Response, NextFunction } from 'express';
import { User } from '@shared/schema';

// Extend Express.Request to include user type
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

/**
 * Middleware to require authentication
 * Checks if user is authenticated and exists
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      message: 'You must be logged in to access this resource'
    });
  }
  
  next();
}

/**
 * Middleware to require specific roles
 * Must be used after requireAuth middleware
 */
export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'You must be logged in to access this resource'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        message: `This resource requires one of the following roles: ${roles.join(', ')}`,
        userRole: req.user.role,
        requiredRoles: roles
      });
    }

    next();
  };
}

/**
 * Middleware to require admin role (convenience wrapper)
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  return requireRole(['admin', 'superadmin'])(req, res, next);
}

/**
 * Middleware to require superadmin role
 */
export function requireSuperadmin(req: Request, res: Response, next: NextFunction) {
  return requireRole(['superadmin'])(req, res, next);
}
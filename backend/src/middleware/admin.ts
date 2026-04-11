import { Request, Response, NextFunction } from 'express';

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  if (user && user.accessLevel === 'ADMIN') {
    next();
  } else {
    return res.status(403).json({ message: "Wymagane uprawnienia administratora" });
  }
};
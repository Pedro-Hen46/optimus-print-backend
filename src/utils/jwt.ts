import jwt from 'jsonwebtoken';

const secret: string = process.env.JWT_SECRET || 'devsecret';

export const generateToken = (payload: object, expiresIn = '15m') => {
     if (!secret) {
         throw new Error('JWT_SECRET não definido');
     }

     return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, secret);
};
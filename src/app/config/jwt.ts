import jwt from "jsonwebtoken";
import { env } from "./env";

export const signToken = (payload: object, expiresIn: jwt.SignOptions['expiresIn'] = env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']) =>
  jwt.sign(payload, env.JWT_SECRET as jwt.Secret, { expiresIn } as jwt.SignOptions);

export const verifyToken = (token: string) =>
  jwt.verify(token, env.JWT_SECRET as jwt.Secret);

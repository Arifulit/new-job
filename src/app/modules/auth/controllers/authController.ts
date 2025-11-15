import { Request, Response } from "express";
import * as authService from "../services/authService";
import { User } from "../models/User";
import { signToken, verifyToken } from "../../../config/jwt";

const ACCESS_TTL = "15m";
const REFRESH_TTL = "7d";
const REFRESH_COOKIE_NAME = "refreshToken";
const REFRESH_COOKIE_MAXAGE = 7 * 24 * 60 * 60 * 1000; // 7 days

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  try {
    const user = await authService.registerUser(name, email, password, role);
    const userId = (user as any)._id?.toString() ?? (user as any).id;
    const accessToken = signToken({ id: userId, role: (user as any).role }, ACCESS_TTL);
    const refreshToken = signToken({ id: userId }, REFRESH_TTL);

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: REFRESH_COOKIE_MAXAGE,
    });

    res.status(201).json({
      success: true,
      data: { user, accessToken, refreshToken },
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const { user } = await authService.loginUser(email, password);
    const userId = (user as any)._id?.toString() ?? (user as any).id;
    const accessToken = signToken({ id: userId, role: (user as any).role }, ACCESS_TTL);
    const refreshToken = signToken({ id: userId }, REFRESH_TTL);

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: REFRESH_COOKIE_MAXAGE,
    });

    res.status(200).json({
      success: true,
      data: { user, accessToken, refreshToken },
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.[REFRESH_COOKIE_NAME] ?? req.body?.refreshToken;
    if (!token) return res.status(401).json({ success: false, message: "Refresh token missing" });

    const decoded: any = verifyToken(token) as any;
    const userId = decoded?.id ?? decoded?.sub;
    if (!userId) return res.status(401).json({ success: false, message: "Invalid token payload" });

    const user = await User.findById(userId).lean().exec();
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    const accessToken = signToken({ id: userId, role: (user as any).role }, ACCESS_TTL);
    const refreshToken = signToken({ id: userId }, REFRESH_TTL);

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: REFRESH_COOKIE_MAXAGE,
    });

    res.status(200).json({ success: true, data: { accessToken, refreshToken } });
  } catch (err: any) {
    res.status(401).json({ success: false, message: "Invalid refresh token" });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.status(200).json({ success: true, message: "Logged out" });
};
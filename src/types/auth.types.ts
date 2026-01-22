import type { Role, UserStatus } from "@prisma/client";
import type { Request } from "express";

export interface JwtPayload {
  userId: number;
  email: string;
  role: Role;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email: string;
    role: Role;
    status: UserStatus;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: Role;
  };
}

export interface InviteRequest {
  email: string;
  role: Role;
}

export interface RegisterViaInviteRequest {
  token: string;
  name: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

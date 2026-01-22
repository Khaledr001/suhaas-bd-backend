import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .max(100, "Email must be at most 100 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters"),
});

export const inviteSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .max(100, "Email must be at most 100 characters"),
  role: z.enum(["ADMIN", "MANAGER", "STAFF"]),
});

export const registerViaInviteSchema = z.object({
  token: z.string().uuid("Invalid invite token format"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type InviteInput = z.infer<typeof inviteSchema>;
export type RegisterViaInviteInput = z.infer<typeof registerViaInviteSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

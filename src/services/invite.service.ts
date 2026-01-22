import { prisma } from "../config/db.config.js";
import type { Role } from "@prisma/client";
import {
  generateInviteToken,
  getInviteExpirationDate,
} from "../utils/jwt.util.js";
import {
  ConflictError,
  NotFoundError,
  BadRequestError,
} from "../utils/error.util.js";

/**
 * Create a new invite
 */
export const createInvite = async (email: string, role: Role) => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ConflictError("User with this email already exists");
  }

  // Check if there's a pending invite for this email
  const existingInvite = await prisma.invite.findFirst({
    where: {
      email,
      acceptedAt: null,
      expiresAt: { gt: new Date() },
    },
  });

  if (existingInvite) {
    throw new ConflictError("An active invite already exists for this email");
  }

  const token = generateInviteToken();
  const expiresAt = getInviteExpirationDate();

  const invite = await prisma.invite.create({
    data: {
      email,
      role,
      token,
      expiresAt,
    },
  });

  // In production, send email here. For now, log the token.
  console.log(`📧 Invite created for ${email}`);
  console.log(`🔑 Invite token: ${token}`);
  console.log(`⏰ Expires at: ${expiresAt}`);

  return {
    id: invite.id,
    email: invite.email,
    role: invite.role,
    token: invite.token,
    expiresAt: invite.expiresAt,
  };
};

/**
 * Validate an invite token
 */
export const validateInvite = async (token: string) => {
  const invite = await prisma.invite.findUnique({
    where: { token },
  });

  if (!invite) {
    throw new NotFoundError("Invalid invite token");
  }

  if (invite.acceptedAt) {
    throw new BadRequestError("Invite has already been used");
  }

  if (invite.expiresAt < new Date()) {
    throw new BadRequestError("Invite has expired");
  }

  return invite;
};

/**
 * Mark an invite as used
 */
export const markInviteAsUsed = async (token: string) => {
  return await prisma.invite.update({
    where: { token },
    data: { acceptedAt: new Date() },
  });
};

/**
 * Get all invites (for admin)
 */
export const getAllInvites = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.invite.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.invite.count(),
  ]);

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  };
};

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "../../../config/db.js";
import { emailQueue } from "../../jobs/email.queue.js";
import { redis } from "../../../config/redis.js";
import { signRefreshToken, signAccessToken } from "../../utils/jwt.js";

const INVITE_EXPIRY_HOURS = 48;

export const createInvite = async (data, user) => {
  const token = crypto.randomUUID();
  const member = await prisma.orgMember.findFirst({
    where: {
      orgId: user.orgId,
      user: { email: data.email },
    },
  });

  if (member) {
    throw new Error("User is already a member");
  }
  const existingInvite = await prisma.invite.findUnique({
    where: {
      email_orgId: {
        email: data.email,
        orgId: user.orgId,
      },
    },
  });

  // 🟡 If invite already exists
  if (existingInvite) {
    // Option A: if expired → regenerate
    if (existingInvite.expiresAt < new Date()) {
      return prisma.invite.update({
        where: { id: existingInvite.id },
        data: {
          token: crypto.randomUUID(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          role: data.role,
        },
      });
    }

    // Option B: still valid → throw clean error
    throw new Error("User already invited");
  }

  return prisma.invite.create({
    data: {
      email: data.email,
      role: data.role,
      token,
      orgId: user.orgId,
      expiresAt: new Date(Date.now() + INVITE_EXPIRY_HOURS * 3600000),
    },
  });
};

export const acceptInvite = async (data) => {
  const invite = await prisma.invite.findUnique({
    where: { token: data.token },
    include: { org: true },
  });

  if (!invite || invite.expiresAt < new Date()) {
    throw new Error("Invite expired or invalid");
  }

  let user = await prisma.user.findUnique({
    where: { email: invite.email },
  });

  if (!user) {
    if (!data.password || !data.name) {
      throw new Error("Name and password required");
    }

    const hashed = await bcrypt.hash(data.password, 10);

    user = await prisma.user.create({
      data: {
        email: invite.email,
        password: hashed,
        name: data.name,
      },
    });
  }

  if (!user) {
    throw new Error("Please sign up or login with the invited email first");
  }

  if (invite.email !== user.email) {
    throw new Error("Invite email mismatch");
  }

  // If user doesn't exist → create user

  // Check if already member
  const existingMember = await prisma.orgMember.findUnique({
    where: {
      userId_orgId: {
        userId: user.id,
        orgId: invite.orgId,
      },
    },
  });

  if (!existingMember) {
    await prisma.orgMember.create({
      data: {
        userId: user.id,
        orgId: invite.orgId,
        role: invite.role,
      },
    });
  }

  // Invalidate invite
  await prisma.invite.delete({
    where: { id: invite.id },
  });

  // await redis.del(`session:${user.id}:${invite.orgId}`);

  const keys = await redis.keys(`session:${user.id}:*`);
  if (keys.length) {
    await redis.del(keys);
  }

  const accessToken = signAccessToken({
    userId: user.id,
    orgId: invite.orgId,
  });

  const refreshToken = signRefreshToken({
    userId: user.id,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      orgId: invite.orgId,
      role: invite.role,
    },
    accessToken,
    refreshToken,
  };
};

export const validateInvite = async (token) => {
  console.log("Token :", token);
  const invite = await prisma.invite.findUnique({
    where: { token },
    include: {
      org: {
        select: {
          name: true,
        },
      },
    },
  });
  console.log("invite ", invite);

  if (!invite) {
    throw new Error("Invalid invite");
  }

  if (invite.expiresAt < new Date()) {
    throw new Error("Invite expired");
  }

  return {
    email: invite.email,
    role: invite.role,
    orgName: invite.org.name,
    expiresAt: invite.expiresAt,
  };
};

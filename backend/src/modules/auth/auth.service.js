import bcrypt from "bcryptjs";
import { prisma } from "../../../config/db.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";

const REFRESH_EXPIRES_DAYS = 7;

export const register = async (data) => {
  const { email, password, name, organizationName, inviteToken } = data;
  console.log("data : ", data);

  const existingUser = await prisma.user.findUnique({ where: { email } });
  console.log("existingUser : ", existingUser);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // console.log("HashedPassword : ", hashedPassword)
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });
  // console.log("User : ", user)

  if (inviteToken) {
    const invite = await prisma.invite.findUnique({
      where: { token: inviteToken },
    });

    if (!invite || invite.expiresAt < new Date()) {
      throw new Error("Invalid or expired invite");
    }

    if (invite.email !== email) {
      throw new Error("Invite email does not match signup email");
    }
    console.log("inviteregister : ", invite);

    const org = await prisma.orgMember.create({
      data: {
        userId: user.id,
        orgId: invite.orgId,
        role: invite.role,
      },
    });

    console.log("orgmembersRegister : ", org);

    await prisma.invite.delete({
      where: { id: invite.id },
    });

    const accessToken = signAccessToken({
      userId: user.id,
      orgId: invite.orgId,
    });
    // console.log("accessToken : ", accessToken)

    const refreshToken = signRefreshToken({
      userId: user.id,
    });
    // console.log("refreshToken : ", refreshToken)

    const n = await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + REFRESH_EXPIRES_DAYS * 86400000),
      },
    });
    // console.log("refreshToken : ", n)

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: invite.role,
        orgId: invite.orgId,
      },
      accessToken,
      refreshToken,
    };
  }

  if (!organizationName) {
    throw new Error("Organization name required");
  }

  const org = await prisma.organization.create({
    data: {
      name: organizationName,
      members: {
        create: {
          userId: user.id,
          role: "OWNER",
        },
      },
    },
  });
  console.log("org : ", org);

  const accessToken = signAccessToken({
    userId: user.id,
    orgId: org.id,
  });
  // console.log("accessToken : ", accessToken)

  const refreshToken = signRefreshToken({
    userId: user.id,
  });
  // console.log("refreshToken : ", refreshToken)

  const n = await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_EXPIRES_DAYS * 86400000),
    },
  });
  // console.log("refreshToken : ", n)

  const newuser = await prisma.user.findUnique({
    where: { email: user.email },
    include: {
      orgMembers: true,
    },
  });
  // console.log(newuser);

  const orgMember = newuser.orgMembers[0];

  // console.log("orgMember : ", orgMember)

  return {
    org,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: "OWNER", // 👈 IMPORTANT
      orgId: org.id,
    },
    accessToken,
    refreshToken,
  };
};

export const login = async (data) => {
  const { email, password, inviteToken } = data;

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      orgMembers: true,
    },
  });

  if (!user) throw new Error("Invalid credentials");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid credentials");

  let orgId;
  let role;

  // ✅ INVITE LOGIN FLOW
  if (inviteToken) {
    const invite = await prisma.invite.findUnique({
      where: { token: inviteToken },
    });

    if (!invite || invite.expiresAt < new Date()) {
      throw new Error("Invalid or expired invite");
    }

    if (invite.email !== user.email) {
      throw new Error("Invite email does not match account email");
    }

    // check if already member
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

    await prisma.invite.delete({
      where: { id: invite.id },
    });

    orgId = invite.orgId;
    role = invite.role;
  } else {
    if (!user.orgMembers.length) {
      throw new Error("User is not part of any organization");
    }
    const orgMember = user.orgMembers[0];
    orgId = orgMember.orgId;
    role = orgMember.role;
    if (!orgMember) throw new Error("User not in any organization");
  }

  const accessToken = signAccessToken({
    userId: user.id,
    orgId: orgId,
  });

  const refreshToken = signRefreshToken({
    userId: user.id,
  });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_EXPIRES_DAYS * 86400000),
    },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role,
      orgId,
    },
    accessToken,
    refreshToken,
  };
};

export const refresh = async (token) => {
  const payload = verifyRefreshToken(token);
  // console.log("payload : ",payload);
  // console.log("token : ",token);

  const stored = await prisma.refreshToken.findUnique({
    where: { token },
  });

  // console.log("stored : ",stored);

  if (!stored || stored.revoked || stored.expiresAt < new Date()) {
    throw new Error("Invalid refresh token");
  }

  // 🔍 find orgId
  const member = await prisma.orgMember.findFirst({
    where: { userId: payload.userId },
  });

  if (!member) throw new Error("User has no organization");

  await prisma.refreshToken.update({
    where: { token },
    data: { revoked: true },
  });

  const accessToken = signAccessToken({
    userId: payload.userId,
    orgId: member.orgId, // ✅ FIX
  });

  const newRefreshToken = signRefreshToken({ userId: payload.userId });

  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: payload.userId,
      expiresAt: new Date(Date.now() + REFRESH_EXPIRES_DAYS * 86400000),
    },
  });

  return { accessToken, refreshToken: newRefreshToken };
};

export const logout = async (token) => {
  await prisma.refreshToken.updateMany({
    where: { token },
    data: { revoked: true },
  });
};

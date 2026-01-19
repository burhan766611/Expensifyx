import * as service from "./invite.service.js";
import { createInviteSchema, acceptInviteSchema } from "./invite.schema.js";
import { prisma } from "../../../config/db.js";
import { sendInviteEmail } from "../../utils/email.js";

export const createInvite = async (req, res) => {
  try {
    const data = createInviteSchema.parse(req.body);
    const invite = await service.createInvite(data, req.user);
    // console.log("orgname",req.user);

    const org = await prisma.organization.findUnique({
      where: {
        id: req.user.orgId,
      },
    });
    console.log("OrgName", org);
    console.log("Invite : ", invite);
    console.log("data : ", data);

    const d = await sendInviteEmail({
      to: data.email,
      orgName: org.name || "Your Organization",
      role: data.role,
      inviteToken: invite.token,
    });

    console.log("d : ", d);

    await req.audit("MEMBER_INVITED", {
      email: data.email,
      role: data.role,
      inviteId: invite.id,
    });

    res.status(201).json(invite);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const acceptInvite = async (req, res) => {
  try {
    const data = acceptInviteSchema.parse(req.body);
    const result = await service.acceptInvite(data);

    await req.audit("INVITE_ACCEPTED", {
      email: result.email ?? "existing-user",
      user: user,
    });
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const listInvites = async (req, res) => {
  try {
    console.log("userInvites", req.user);
    const invites = await prisma.invite.findMany({
      where: {
        orgId: req.user.orgId,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(invites);
  } catch (err) {
    console.error("INVITES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch invites" });
  }
};

export const deleteInvitation = async (req, res) => {
  const id = req.params.id;
  console.log("delete", id);
  try {
    await prisma.invite.delete({ where: { id } });
    res.json({ message: "Invite deleted" });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: err.message });
  }
};

export const validateInvite = async (req, res) => {
  try {
    console.log(req.query);
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Invite token missing" });
    }

    const invite = await service.validateInvite(token);

    if (!invite) {
  return {
    valid: false,
    reason: "Invite already used or invalid",
  };
}

    res.json(invite);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

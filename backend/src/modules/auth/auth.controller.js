import { registerSchema, loginSchema } from "./auth.schema.js";
import * as authService from "./auth.service.js";
import { prisma } from "../../../config/db.js";
import { redis } from "../../../config/redis.js";

export const register = async (req, res) => {
  try {
    console.log(req.body);
    const data = registerSchema.parse(req.body);
    console.log(data.inviteToken);
    const result = await authService.register(data);
    // console.log(result);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, // 15 min
    });
    await redis.set(
      `session:${result.user.id}:${result.user.orgId}`,
      JSON.stringify({
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
        orgId: result.user.orgId,
      }),
      "EX",
      15 * 60 // 15 minutes
    );
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    const result = await authService.login(data);
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, //15min
    });
    await redis.set(
      `session:${result.user.id}:${result.user.orgId}`,
      JSON.stringify({
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
        orgId: result.user.orgId,
      }),
      "EX",
      15 * 60 // 15 minutes
    );
    console.log(result);
    console.log(result.user);
    console.log(result.user.id);

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.errors?.[0]?.message || err.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new Error("No refresh token");
    // console.log("refreshToken : " ,refreshToken)

    const tokens = await authService.refresh(refreshToken);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", tokens.accessToken, {
      // ✅ FIX HERE
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const authMe = async (req, res) => {
  try {
    const { userId, orgId } = req.user;
    const cacheKey = `session:${userId}:${orgId}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json({ user: JSON.parse(cached) });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        orgMembers: {
          where: { orgId },
          select: {
            role: true,
            orgId: true,
          },
        },
      },
    });

    console.log("orgMembers : ", user);

    if (!user || user.orgMembers.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    // const member = user.orgMembers[0];

    const member = user.orgMembers.find((m) => m.orgId === orgId);

    if (!member) {
      return res.status(401).json({ message: "No access to this org" });
    }

    // ✅ THIS IS WHAT YOU WANT TO CACHE
    const userPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: member.role,
      orgId: member.orgId,
    };

    await redis.set(cacheKey, JSON.stringify(userPayload), "EX", 15 * 60);

    return res.json({ user: userPayload });
  } catch (err) {
    console.error("authMe error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await authService.logout(refreshToken);
  }

  if (req.user) {
    const { userId, orgId } = req.user;
    await redis.del(`session:${userId}:${orgId}`);
  }

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  res.status(200).json({ message: "Logged out successfully" });
};

// export const signup = async (req, res) => {
//   try {
//     // console.log(req.body);
//     const data = registerSchema.parse(req.body);
//     // console.log(data);
//     const result = await authService.signup(data);
//     // console.log(result);

//     res.cookie("refreshToken", result.refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });
//     res.cookie("accessToken", result.accessToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       maxAge: 15 * 60 * 1000, // 15 min
//     });
//     await redis.set(
//       `session:${result.user.id}:${result.user.orgId}`,
//       JSON.stringify({
//         id: result.user.id,
//         email: result.user.email,
//         name: result.user.name,
//         role: result.user.role,
//         orgId: result.user.orgId,
//       }),
//       "EX",
//       15 * 60 // 15 minutes
//     );
//     res.status(201).json(result);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// }

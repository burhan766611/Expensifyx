import { Worker } from "bullmq";
import { redis } from "../config/redis.js";
import { sendInviteEmail } from "../utils/email.js";

new Worker(
  "email-queue",
  async (job) => {
    const { to, inviteLink, orgName } = job.data;

    if (job.name === "send-invite-email") {
      await sendInviteEmail({ to, inviteLink, orgName });
    }
  },
  { connection: redis }
);

console.log("📨 Email worker started");

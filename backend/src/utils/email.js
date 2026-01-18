import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendInviteEmail = async ({
  to,
  orgName,
  role,
  inviteToken,
}) => {
  const inviteUrl = `${process.env.FRONTEND_URL}/accept-invite?token=${inviteToken}`;

  try {
    const response = await resend.emails.send({
      from: process.env.FROM_EMAIL, // MUST be verified
      to,
      subject: `You’re invited to join ${orgName}`,
      html: `
        <div style="font-family: sans-serif;">
          <h2>You’ve been invited to ${orgName}</h2>
          <p>You are invited as <strong>${role}</strong></p>
          <a href="${inviteUrl}">Accept Invite</a>
          <p>This invite expires in 48 hours.</p>
        </div>
      `,
    });

    console.log("✅ Resend response:", response);
    return response;
  } catch (error) {
    console.error("❌ Resend email error:", error);
    throw error;
  }
};


// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY)

// export const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: Number(process.env.SMTP_PORT),
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// export const sendInviteEmail = async ({ to, inviteLink, orgName }) => {
//   await transporter.sendMail({
//     from: `"ExpensifyX" <${process.env.SMTP_USER}>`,
//     to,
//     subject: `You're invited to join ${orgName}`,
//     html: `
//       <h2>You're invited!</h2>
//       <p>You’ve been invited to join <b>${orgName}</b>.</p>
//       <a href="${inviteLink}">Accept Invite</a>
//       <p>This link expires in 48 hours.</p>
//     `,
//   });
// };

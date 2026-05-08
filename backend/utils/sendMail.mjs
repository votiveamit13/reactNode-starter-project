import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

console.log("ENV CHECK:");
console.log("HOST:", process.env.SMTP_HOST);
console.log("PORT:", process.env.SMTP_PORT);
console.log("USER:", process.env.SMTP_USER);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendResetMail = async (to, name, token) => {
  const resetLink = `${process.env.FRONTEND_URL}/set-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: "Set Your Password",
    html: `
      <div style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                
                <tr>
                  <td style="background:#A7B95A; padding:20px; text-align:center; color:#ffffff; font-size:22px; font-weight:bold;">
                    Welcome to Votive Technologies
                  </td>
                </tr>

                <tr>
                  <td style="padding:30px; color:#333;">
                    <h2 style="margin-top:0;">Hi ${name},</h2>
                    <p style="font-size:15px; line-height:1.6;">
                      Welcome aboard!
                    </p>
                    
                    <p style="font-size:15px; line-height:1.6;">
                      Your account has been successfully created. To get started, please set your password by clicking the button below.
                    </p>

                    <p style="font-size:15px; line-height:1.6;">
                      Once your password is set, you’ll be able to securely access your account and explore all available features.
                    </p>

                    <div style="text-align:center; margin:30px 0;">
                      <a href="${resetLink}" 
                         style="background:#A7B95A; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:6px; font-size:16px; display:inline-block;">
                        Set Your Password
                      </a>
                    </div>

                    <p style="font-size:13px; color:#888; margin-top:20px;">
                      Or copy and paste this link into your browser:<br/>
                      <a href="${resetLink}" style="color:#4f46e5;">${resetLink}</a>
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="background:#f9fafb; padding:20px; text-align:center; font-size:12px; color:#999;">
                    © Votive Technologies. All rights reserved.
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </div>
    `,
  });
};
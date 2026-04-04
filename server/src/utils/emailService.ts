import { transporter } from '../utils/mailer.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

export interface EmailAttachment {
  filename: string;
  content?: any;
  path?: string;
  cid?: string;
  contentType?: string;
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: EmailAttachment[];
}

export const sendEmail = async (options: SendEmailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Prime Harvest" <noreply@primeharvest.co.tz>',
      to: typeof options.to === 'string' ? options.to : options.to.join(','),
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments,
    });

    console.log(`[Email Service] Message sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`[Email Service Error]`, error);
    throw error;
  }
};

/**
 * Modern HTML Template for Transactional Emails
 */
export const getBaseTemplate = (title: string, content: string) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; color: #334155; line-height: 1.6; }
        .container { max-width: 600px; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
        .header { background-color: #0f172a; color: white; padding: 30px; text-align: center; }
        .content { padding: 40px; background-color: #ffffff; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; }
        .button { background-color: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; font-weight: bold; }
        .highlight { color: #0d9488; font-weight: bold; }
        .logo { max-height: 48px; margin-bottom: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin:0; font-size: 24px;">Prime Harvest</h1>
            <p style="margin:5px 0 0 0; opacity: 0.7; font-size: 14px;">${title}</p>
        </div>
        <div class="content">
            ${content}
            <p style="margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 20px;">
                Regards,<br>
                <strong>The Prime Harvest Team</strong>
            </p>
        </div>
        <div class="footer">
            &copy; 2026 Prime Harvest Pvt. Ltd. All rights reserved.<br>
            This is an automated message, please do not reply.
        </div>
    </div>
</body>
</html>
`;


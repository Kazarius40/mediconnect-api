import { Injectable } from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendPasswordResetEmail(to: string, resetLink: string) {
    await this.transporter.sendMail({
      from: `"Your App" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Password Reset Request',
      html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link is valid for 1 hour.</p>
      `,
    });
  }

  async sendVerificationEmail(to: string, verifyLink: string) {
    await this.transporter.sendMail({
      from: `"Your App" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Verify Your Email Address',
      html: `
        <p>Welcome! Please verify your email by clicking the link below:</p>
        <p><a href="${verifyLink}">${verifyLink}</a></p>
        <p>This link will expire in 24 hours.</p>
      `,
    });
  }
}

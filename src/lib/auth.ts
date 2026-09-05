import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import prisma from "./prisma-client";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	emailAndPassword: {
		enabled: true,
		sendResetPassword: async ({ user, url }) => {
			const apiKey = process.env.RESEND_API_KEY;
			const from = process.env.RESEND_FROM_EMAIL;
			if (!apiKey || !from) {
				throw new Error(
					"Password reset email is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL.",
				);
			}

			const response = await fetch("https://api.resend.com/emails", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${apiKey}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					from,
					to: [user.email],
					subject: "Reset your Shikshya Plan password",
					html: `<p>Hi ${user.name},</p><p>Use the link below to choose a new password. It expires in one hour.</p><p><a href="${url}">Reset your password</a></p>`,
				}),
			});
			if (!response.ok) {
				throw new Error("Unable to send password reset email");
			}
		},
	},
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		},
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		},
	},
	baseURL: process.env.BETTER_AUTH_URL,
	secret: process.env.BETTER_AUTH_SECRET,
	plugins: [tanstackStartCookies()],
});

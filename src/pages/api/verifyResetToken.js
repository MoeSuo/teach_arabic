// pages/api/verifyResetToken.js
import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, token } = req.body;

  const prisma = new PrismaClient();

  try {
    // Check if the user exists with the given email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the token matches the user's reset token and is not expired
    if (user.resetToken !== token || new Date(user.resetTokenExpiry) < new Date()) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Token is valid, return the user ID
    res.status(200).json({ userId: user.id });
  } catch (error) {
    console.error('Error verifying reset token:', error);
    res.status(500).json({ error: 'An error occurred while verifying the reset token' });
  } finally {
    prisma.$disconnect();
  }
}

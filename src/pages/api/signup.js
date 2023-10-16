// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// this page is the backend route handler for register users and the equivalent frontend page is the route.jsx register folder 

//backend
import bcrypt from "bcrypt"; // to hash the password
import prisma from "../../../libs/prismadb"; // to use the global prisma connection
import { NextResponse } from "next/server"; // to allow me to send response to clients
//backend
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return new NextResponse("Missing Fields!", { status: 400 });
    }

    const exist = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (exist) {
      throw new Error("Email already exists!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });

    return res.json(user);
  } else {
    // Handle any other HTTP method
  }
}


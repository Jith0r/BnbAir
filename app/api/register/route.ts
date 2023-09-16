import bcrypt from "bcrypt"
import prisma from "@/app/libs/prismadb"
import { NextResponse } from "next/server";

export async function POST(request: Request) {

    const body = await request.json();

    const { email, name, password } = body;

    // Crée le mot de passe hashed
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crée l'utilisateur
    const user = await prisma.user.create({
        data: {
            email,
            name,
            hashedPassword
        }
    });

    return NextResponse.json(user);
}
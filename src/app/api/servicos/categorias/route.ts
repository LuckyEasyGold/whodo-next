import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const categorias = await prisma.categoria.findMany({
            orderBy: { nome: "asc" },
            select: { id: true, nome: true }
        });

        return NextResponse.json(categorias);
    } catch (error) {
        console.error("Erro ao carregar categorias:", error);
        return NextResponse.json(
            { error: "Erro ao buscar categorias" },
            { status: 500 }
        );
    }
}

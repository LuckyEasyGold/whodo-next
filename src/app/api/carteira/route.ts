import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET: Obter carteira do usuário
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const userId = session.id;

    // Obter ou criar carteira
    let carteira = await prisma.carteira.findUnique({
      where: { usuario_id: userId },
    });

    if (!carteira) {
      carteira = await prisma.carteira.create({
        data: {
          usuario_id: userId,
          saldo: 0,
          saldo_pendente: 0,
          total_ganho: 0,
          total_gasto: 0,
        },
      });
    }

    return NextResponse.json(carteira);
  } catch (error) {
    console.error("Erro ao obter carteira:", error);
    return NextResponse.json(
      { error: "Erro ao obter carteira" },
      { status: 500 }
    );
  }
}

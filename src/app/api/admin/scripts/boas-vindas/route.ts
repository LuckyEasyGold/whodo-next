import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";

// GET /api/admin/scripts/boas-vindas?secret=WHODO123
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');

    // Proteção super básica para o script não ser executado por curiosos
    if (secret !== 'WHODO123') {
        return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    try {
        // Busca todos os usuários vindos de login social (identificados pela ausência de senha)
        const usuariosSociais = await prisma.usuario.findMany({
            where: {
                senha: null
            },
            select: {
                id: true,
                nome: true,
                email: true
            }
        });

        if (usuariosSociais.length === 0) {
            return NextResponse.json({ message: "Nenhum usuário social encontrado." });
        }

        const resultados = {
            total_encontrados: usuariosSociais.length,
            enviados: 0,
            falhas: 0,
            erros: [] as { email: string, erro: any }[]
        };

        // Dispara os emails com um pequeno delay para não estourar o limite do Resend (Rate Limit)
        for (const user of usuariosSociais) {
            try {
                await sendWelcomeEmail(user.email, user.nome);
                resultados.enviados++;

                // Aguarda 200ms entre os disparos (5 por segundo)
                await new Promise(resolve => setTimeout(resolve, 200));
            } catch (err: any) {
                console.error(`Falha ao enviar para ${user.email}:`, err);
                resultados.falhas++;
                resultados.erros.push({ email: user.email, erro: err.message || err });
            }
        }

        return NextResponse.json({
            message: "Processamento concluído",
            resultados
        });
    } catch (error) {
        console.error("Erro interno no script de boas-vindas:", error);
        return NextResponse.json({ error: "Erro interno no script" }, { status: 500 });
    }
}

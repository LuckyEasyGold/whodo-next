import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WhoDo! — Encontre profissionais perto de você",
  description: "Marketplace de serviços que conecta clientes a prestadores qualificados. Encanador, eletricista, pintor, diarista e muito mais.",
  keywords: "serviços, profissionais, encanador, eletricista, pintor, diarista, WhoDo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

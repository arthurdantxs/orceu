import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orceu | Ecossistema para construtoras controlarem obras, compras e orçamento",
  description:
    "O Orceu ajuda construtoras a controlar orçamento, compras, financeiro e execução de obras em um ecossistema integrado, com mais clareza e previsibilidade.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}


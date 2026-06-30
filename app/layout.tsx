import type { Metadata } from "next";
import "./globals.css";
import { getSiteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "Orceu | Ecossistema para construtoras controlarem obras, compras e orçamento",
  description:
    "O Orceu ajuda construtoras a controlar orçamento, compras, financeiro e execução de obras em um ecossistema integrado, com mais clareza e previsibilidade.",
  openGraph: {
    title: "Orceu | Ecossistema para construtoras controlarem obras, compras e orçamento",
    description:
      "O Orceu ajuda construtoras a controlar orçamento, compras, financeiro e execução de obras em um ecossistema integrado, com mais clareza e previsibilidade.",
    type: "website",
    locale: "pt_BR",
    siteName: "Orceu",
  },
  twitter: {
    card: "summary_large_image",
    title: "Orceu | Ecossistema para construtoras controlarem obras, compras e orçamento",
    description:
      "O Orceu ajuda construtoras a controlar orçamento, compras, financeiro e execução de obras em um ecossistema integrado, com mais clareza e previsibilidade.",
  },
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

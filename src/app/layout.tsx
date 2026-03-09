import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

/*
===========================================
📚 EXPLICAÇÃO: IMPORTAÇÕES
===========================================
- `Metadata`: Tipo do Next.js para metadados da página (título, descrição, etc.)
- `Geist, Geist_Mono`: Fontes do Google carregadas de forma otimizada
- `./globals.css`: Estilos globais da aplicação
- `Toaster`: Componente para mostrar notificações (toast messages)
*/

// Configuração da fonte "Geist Sans" - fonte principal para textos
const geistSans = Geist({
  variable: "--font-geist-sans",  // Cria variável CSS para usar depois
  subsets: ["latin"],              // Carrega apenas caracteres latinos (mais leve)
});

// Configuração da fonte "Geist Mono" - fonte para código
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",  // Variável CSS para código
  subsets: ["latin"],
});

/*
===========================================
📚 EXPLICAÇÃO: METADATA
===========================================
Metadados são informações sobre a página que aparecem:
- Na aba do navegador (título)
- No Google quando alguém busca (descrição)
- Quando compartilha no WhatsApp/Twitter (Open Graph)
*/
export const metadata: Metadata = {
  title: "Camile Pereira | Desenvolvedora",
  description: "Portfólio de Camile Pereira - Desenvolvedora em evolução. Projetos, skills e contato.",
  keywords: ["desenvolvedora", "portfolio", "programação", "react", "nextjs", "camile pereira"],
  authors: [{ name: "Camile Pereira" }],
};

/*
===========================================
📚 EXPLICAÇÃO: ROOTLAYOUT
===========================================
Este é o componente que envolve TODAS as páginas da aplicação.
É como uma "casca" que contém:
- HTML (<html>)
- Body (<body>)
- Fontes
- Componentes globais (Toaster)
*/
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;  // `children` = conteúdo das páginas filhas
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      {/* 
        lang="pt-BR" = idioma português brasileiro
        suppressHydrationWarning = evita avisos do Next.js sobre diferenças servidor/cliente
      */}
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {/* 
          className com template string:
          - ${geistSans.variable} = aplica a fonte Geist Sans
          - ${geistMono.variable} = aplica a fonte Mono
          - antialiased = suaviza as fontes
          - bg-background = cor de fundo (definida no globals.css)
          - text-foreground = cor do texto (definida no globals.css)
        */}
        
        {children}  {/* Aqui entra o conteúdo de cada página */}
        
        <Toaster />  {/* Componente para mostrar mensagens de notificação */}
      </body>
    </html>
  );
}

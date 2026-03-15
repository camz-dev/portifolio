import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "standalone", // Descomente apenas para deploy Docker
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  
  // ===========================================
  // 📚 EXPLICAÇÃO: ALLOWED DEV ORIGINS
  // ===========================================
  // Permite que o preview acesse os recursos do Next.js
  // sem mostrar avisos de "Cross origin request detected"
  allowedDevOrigins: [
    'localhost',
    '.space.z.ai',
    '.z.ai',
  ],
};

export default nextConfig;

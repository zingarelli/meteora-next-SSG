/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // export estático de HTML/CSS/JS,
  // basePath: "/meteora-teste-static-export", // descomente para deploy no github pages
  // assetPrefix: "/meteora-teste-static-export/", // descomente para deploy no github pages
  trailingSlash: true, // adiciona um index.html para cada subdiretorio de rota
  images: {
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "raw.githubusercontent.com",
    //     pathname: "**",
    //   },
    // ],
    // utilizando um loader customizado
    loader: 'custom',
    loaderFile: './src/app/imageLoader.js'
  },
};

export default nextConfig;

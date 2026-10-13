/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for Apache/shared hosting: `next build` writes plain files to out/.
  output: "export",
  // /courses -> /courses/index.html, which Apache serves without rewrite rules.
  trailingSlash: true,
};

export default nextConfig;

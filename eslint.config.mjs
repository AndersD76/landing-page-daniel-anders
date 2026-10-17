import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

/**
 * eslint-config-next 16 já exporta flat config — não precisa de FlatCompat
 * (que, aliás, quebra com circular JSON nesta versão).
 *
 * `next lint` foi removido no Next 16. O script "lint" chama o eslint direto.
 */
export default [
  { ignores: [".next/**", "node_modules/**", "drizzle/**", "public/**"] },
  ...coreWebVitals,
  ...typescript,
];

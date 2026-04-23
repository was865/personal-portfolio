import next from "eslint-config-next";
import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const config = [
  ...next,
  ...coreWebVitals,
  ...typescript,
  {
    ignores: [".next/**", "node_modules/**", "public/**", "out/**"],
  },
];

export default config;

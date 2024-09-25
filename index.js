#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

import chalk from "chalk";

const bigBoldBlue = chalk.blue.bold;

console.log(bigBoldBlue("@Rpranshu ™"));

const projectName = process.argv[2] || "next-tailwind-app";

const createNextApp = () => {
  console.log("Creating Next.js app...");
  execSync(`npx create-next-app@latest ${projectName} --typescript --eslint`, {
    stdio: "inherit",
  });
};

const installTailwind = () => {
  console.log("Installing Tailwind CSS...");
  const projectPath = path.join(process.cwd(), projectName);

  execSync(`npm install -D tailwindcss postcss autoprefixer`, {
    cwd: projectPath,
    stdio: "inherit",
  });
  execSync(`npx tailwindcss init -p`, { cwd: projectPath, stdio: "inherit" });

  // Create Tailwind config and CSS file
  const tailwindConfig = `
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;
  const cssContent = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`;

  fs.writeFileSync(
    path.join(projectPath, "tailwind.config.js"),
    tailwindConfig
  );
  fs.mkdirSync(path.join(projectPath, "styles"), { recursive: true });
  fs.writeFileSync(path.join(projectPath, "styles/globals.css"), cssContent);

  // Update the _app.tsx or global layout file to include Tailwind
  const appFilePathAppRouter = path.join(projectPath, "app/layout.tsx");
  const appFilePathPagesRouter = path.join(projectPath, "pages/_app.tsx");

  let appFile;
  if (fs.existsSync(appFilePathAppRouter)) {
    // App Router (app/layout.tsx)
    appFile = fs.readFileSync(appFilePathAppRouter, "utf-8");
    appFile = appFile.replace(
      `import './globals.css'`,
      `import './globals.css';\nimport 'tailwindcss/tailwind.css';`
    );
    fs.writeFileSync(appFilePathAppRouter, appFile, "utf-8");
  } else if (fs.existsSync(appFilePathPagesRouter)) {
    // Pages Router (pages/_app.tsx)
    appFile = fs.readFileSync(appFilePathPagesRouter, "utf-8");
    appFile = appFile.replace(
      `import '../styles/globals.css'`,
      `import '../styles/globals.css';\nimport 'tailwindcss/tailwind.css';`
    );
    fs.writeFileSync(appFilePathPagesRouter, appFile, "utf-8");
  } else {
    console.log("Error: Neither app/layout.tsx nor pages/_app.tsx exists");
  }
};

const run = async () => {
  createNextApp();
  installTailwind();
  console.log("Next.js app with Tailwind CSS is ready!");
};

run();

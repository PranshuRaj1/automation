#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import chalk from "chalk";

const bigBoldBlue = chalk.blue.bold;

console.log(bigBoldBlue("@Rpranshu ™"));

const projectName = process.argv[2] || "next-tailwind-app";

const createNextApp = () => {
  console.log("Creating Next.js app...");
  try {
    execSync(
      `npx create-next-app@latest ${projectName} --typescript --eslint`,
      {
        stdio: "inherit",
        shell: true,
      }
    );
  } catch (error) {
    console.error("Failed to create Next.js app:", error);
  }
};

const installTailwind = () => {
  console.log("Installing Tailwind CSS...");
  const projectPath = path.join(process.cwd(), projectName);

  try {
    execSync(`npm install -D tailwindcss postcss autoprefixer`, {
      cwd: projectPath,
      stdio: "inherit",
      shell: true,
    });
    execSync(`npx tailwindcss init -p`, {
      cwd: projectPath,
      stdio: "inherit",
      shell: true,
    });

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
      appFile = fs.readFileSync(appFilePathAppRouter, "utf-8");
      appFile = appFile.replace(
        `import './globals.css'`,
        `import './globals.css';\nimport 'tailwindcss/tailwind.css';`
      );
      fs.writeFileSync(appFilePathAppRouter, appFile, "utf-8");
    } else if (fs.existsSync(appFilePathPagesRouter)) {
      appFile = fs.readFileSync(appFilePathPagesRouter, "utf-8");
      appFile = appFile.replace(
        `import '../styles/globals.css'`,
        `import '../styles/globals.css';\nimport 'tailwindcss/tailwind.css';`
      );
      fs.writeFileSync(appFilePathPagesRouter, appFile, "utf-8");
    } else {
      console.log("Error: Neither app/layout.tsx nor pages/_app.tsx exists");
    }
  } catch (error) {
    console.error("Failed to install Tailwind CSS:", error);
  }
};

// Install the selected UI library
const installUILibrary = (library) => {
  console.log(`Installing ${library}...`);
  const projectPath = path.join(process.cwd(), projectName);

  try {
    let installCommand;
    switch (library) {
      case "Chakra UI":
        installCommand = `npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion`;
        break;
      case "PrimeReact":
        installCommand = `npm install primereact primeicons`;
        break;
      case "Shadcn":
        installCommand = `npx shadcn@latest init`;
        break;
      default:
        console.log("No UI library selected.");
        return;
    }

    execSync(installCommand, {
      cwd: projectPath,
      stdio: "inherit",
      shell: true,
    });
  } catch (error) {
    console.error(`Failed to install ${library}:`, error);
  }
};

// Ask the user which UI library to install using inquirer
const askUserForUILibrary = async () => {
  const { library } = await inquirer.prompt([
    {
      type: "list",
      name: "library",
      message: "Which UI library would you like to install?",
      choices: ["Chakra UI", "PrimeReact", "Shadcn", "None"],
    },
  ]);

  if (library !== "None") {
    installUILibrary(library);
  } else {
    console.log("Skipping UI library installation.");
  }
};

const extension = async () => {
  try {
    installCommand = "next-tailwind-kit";
    execSync(installCommand, {
      cwd: projectPath,
      stdio: "inherit",
      shell: true,
    });
  } catch (error) {
    console.error(`Failed to install kit`);
  }
};

const run = async () => {
  createNextApp();
  installTailwind();
  await askUserForUILibrary();
  //await extension();
  console.log("Next.js app with Tailwind CSS is ready!");
};

run();

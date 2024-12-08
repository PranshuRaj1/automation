#!/usr/bin/env node

import { execSync } from "child_process";
import path from "path";
import inquirer from "inquirer";
import chalk from "chalk";

const bigBoldBlue = chalk.blue.bold;
const bigBoldGreen = chalk.green.bold;

const projectName = process.argv[2] || "next-tailwind-app";

const createNextApp = () => {
  console.log("Creating Next.js app...");
  try {
    execSync(`npx create-next-app@latest ${projectName}`, {
      stdio: "inherit",
      shell: true,
    });
  } catch (error) {
    console.error("Failed to create Next.js app:", error.message);
    process.exit(1); // Exit if app creation fails
  }
};

// Install the selected UI library
const installUILibrary = (library) => {
  console.log(`Installing ${library}...`);
  const projectPath = path.join(process.cwd(), projectName);

  try {
    let installCommand;
    let furthur;
    switch (library) {
      case "Chakra UI":
        installCommand = `npm i @chakra-ui/react @emotion/react`;
        furthur = `npx @chakra-ui/cli snippet add`;
        console.log(
          bigBoldGreen(
            "Wrap your application with the Provider component generated in the components/ui/provider component at the root of your application."
          )
        );
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

    if (library === "Chakra UI") {
      execSync(furthur, {
        cwd: projectPath,
        stdio: "inherit",
        shell: true,
      });
    }
  } catch (error) {
    console.error(`Failed to install ${library}:`, error);
  }
};

const isInteractive = process.stdout.isTTY && process.stdin.isTTY;

// Ask the user which UI library to install using inquirer
const askUserForUILibrary = async () => {
  if (!isInteractive) {
    console.log(
      "Non-interactive environment detected. Skipping UI library prompt."
    );
    return;
  }
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

const run = async () => {
  try {
    console.log("Starting script...");
    createNextApp();

    await askUserForUILibrary();
    console.log("Next.js app with Tailwind CSS is ready!");
    console.log(bigBoldBlue("Created By Pranshu Raj"));
  } catch (error) {
    console.error("Error in postinstall script:", error);
    process.exit(1); // Ensure script failure halts installation
  }
};

run();

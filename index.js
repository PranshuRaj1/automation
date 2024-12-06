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

    fs.writeFileSync(
      path.join(projectPath, "tailwind.config.js"),
      tailwindConfig
    );
    fs.mkdirSync(path.join(projectPath, "styles"), { recursive: true });
    fs.writeFileSync(
      path.join(projectPath, "styles/globals.css"),
      `
@tailwind base;
@tailwind components;
@tailwind utilities;
`
    );

    const appFilePathAppRouter = path.join(projectPath, "app/layout.tsx");
    const appFilePathPagesRouter = path.join(projectPath, "pages/app.tsx");

    if (fs.existsSync(appFilePathAppRouter)) {
      let appFile = fs.readFileSync(appFilePathAppRouter, "utf-8");
      appFile = appFile.replace(
        `import './globals.css'`,
        `import './globals.css';\nimport 'tailwindcss/tailwind.css';`
      );
      fs.writeFileSync(appFilePathAppRouter, appFile, "utf-8");
    } else if (fs.existsSync(appFilePathPagesRouter)) {
      let appFile = fs.readFileSync(appFilePathPagesRouter, "utf-8");
      appFile = appFile.replace(
        `import '../styles/globals.css'`,
        `import '../styles/globals.css';\nimport 'tailwindcss/tailwind.css';`
      );
      fs.writeFileSync(appFilePathPagesRouter, appFile, "utf-8");
    } else {
      console.log(
        "Error: Neither app/layout.tsx nor pages/_app.tsx exists. Skipping file update."
      );
    }
  } catch (error) {
    console.error("Failed to install Tailwind CSS:", error.message);
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
    console.log(bigBoldBlue("Note:- "));
    console.log(
      "The warning occurs due to a version conflict between react 18 and react-lorem-component, which only supports react 16. To fix this, either update @chakra-ui/react to a compatible version, use dependency overrides, or downgrade your react version to avoid the conflict."
    );
  } else {
    console.log("Skipping UI library installation.");
  }
};

const run = async () => {
  createNextApp();
  installTailwind();
  await askUserForUILibrary();

  console.log("Next.js app with Tailwind CSS is ready!");
};

run();

export const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || "";
export const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
export const GITHUB_API_URL = "https://api.github.com";
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
export const GITHUB_APP_ID = process.env.GITHUB_APP_ID!;
export const GITHUB_PRIVATE_KEY = process.env.GITHUB_PRIVATE_KEY!.replace(/\\n/g, '\n'); // Ensure newlines are properly formatted
export const IGNORED_FILES = [
  "package-lock.json",
  "yarn.lock",
  "node_modules/",
  "dist/",
  "build/",
  ".gitignore",
  ".github/",
  "README.md",
  "LICENSE",
];
import axios from "axios"
import { GITHUB_API_URL, GITHUB_TOKEN, GITHUB_WEBHOOK_SECRET } from "../config"
import express from "express"
import crypto from "crypto"

const IGNORED_FILES = [
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

export const fetchPullRequestFiles = async (
  repoFullName: string,
  prNumber: number
): Promise<any[]> => {
  try {
    const response = await axios.get(
      `${GITHUB_API_URL}/repos/${repoFullName}/pulls/${prNumber}/files`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    return response.data.filter((file: any) =>
      !IGNORED_FILES.some(
        (ignored) =>
          file.filename.endsWith(`/${ignored}`) ||
          file.filename === ignored ||
          file.filename.startsWith(ignored)
      )
    )
  } catch (error) {
    console.error(`Error fetching PR files for PR #${prNumber}:`, error);
    throw new Error(`Error fetching PR files for PR #${prNumber}`);
  }
};

export const fetchFileContent = async (
  repoFullName: string,
  filePath: string,
  sha: string
): Promise<string> => {
  try {
    const response = await axios.get(
      `${GITHUB_API_URL}/repos/${repoFullName}/contents/${filePath}`,
      {
        params: { ref: sha },
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    return Buffer.from(response.data.content, "base64").toString("utf-8");
  } catch (error) {
    console.error(`Error fetching content for ${filePath}:`, error);
    throw new Error(`Error fetching content for ${filePath}`);
  }
};

export const verifySignature = (
  req: express.Request,
  res: express.Response,
  buf: Buffer
) => {
  const signature = req.headers["x-hub-signature-256"] as string;

  if (!signature || !signature.startsWith("sha256=")) {
    return res.status(401).send("Invalid signature");
  }

  const expectedSignature =
    "sha256=" +
    crypto.createHmac("sha256", GITHUB_WEBHOOK_SECRET).update(buf).digest("hex");

  if (
    !crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  ) {
    return res.status(401).send("Signature verification failed");
  }
};
import jwt from "jsonwebtoken";
import { GITHUB_APP_ID, GITHUB_PRIVATE_KEY } from './config'

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const generateGitHubAppJWT = (): string => {
  const now = Math.floor(Date.now() / 1000);

  const payload = {
    iat: now,
    exp: now + 600,
    iss: GITHUB_APP_ID,
  };

  return jwt.sign(payload, GITHUB_PRIVATE_KEY, { algorithm: "RS256" });
};

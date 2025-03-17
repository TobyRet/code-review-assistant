import { Request, Response, NextFunction } from "express";
import { processPullRequest } from '../services/processPullRequest'

export const handleWebhook = async (req: Request, res: Response, next: NextFunction):Promise<void>  => {
  const event = req.headers["x-github-event"];

  if (event !== "pull_request") {
    res.status(200).send("Ignored");
  }

  const payload = req.body;
  const prNumber = payload.pull_request.number;
  const repoFullName = payload.repository.full_name;
  const headSha = payload.pull_request.head.sha;

  console.log(`PR #${prNumber} - Fetching changed files and their contents...`);

  try {
    const result = await processPullRequest(repoFullName, prNumber, headSha);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send("Error processing PR");
  }
};



import { Request, Response, NextFunction } from "express";
import { fetchFileContent, fetchPullRequestFiles } from '../services/github'
import { generateCodeReview } from '../services/openai/generateCodeReview'

export const handleWebhook = async (req: Request, res: Response, next: NextFunction):Promise<void>  => {
  const event = req.headers["x-github-event"];

  if (event !== "pull_request") {
    res.status(200).send("Ignored");
  }

  const payload = req.body;
  const prNumber = payload.pull_request.number;
  const repoFullName = payload.repository.full_name;

  console.log(`PR #${prNumber} - Fetching changed files and their contents...`);

  try {
    const changedFilesResponse = await fetchPullRequestFiles(repoFullName, prNumber);
    const changedFiles = changedFilesResponse.map((file: any) => file.filename);
    console.log(`Changed files:`, changedFiles);

    for (const fileName of changedFiles) {
      const fileContent = await fetchFileContent(repoFullName, fileName, payload.pull_request.head.sha);
      console.log(`Content for file ${fileName}:`, fileContent);

      const aiReview = await generateCodeReview(
        {repoFullName, prNumber, fileName, fileContent}
      );
      console.log(`AI Review for ${fileName}:\n`, aiReview);
    }

    res.status(200).send("Files fetched and contents retrieved.");
  } catch (error) {
    console.error("Error processing PR:", error);
    res.status(500).send("Error processing PR");
  }
};



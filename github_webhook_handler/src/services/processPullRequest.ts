import { fetchPullRequestFiles } from './github/fetchPullRequestFiles'
import { fetchFileContent } from './github/fetchFileContent'
import { generateCodeReview } from './openai/generateCodeReview'

export const processPullRequest = async (repoFullName: string, prNumber: number, latestCommitSha: string) => {
  console.log(`PR #${prNumber} - Fetching changed files and their contents...`);

  try {
    const changedFilesResponse = await fetchPullRequestFiles(repoFullName, prNumber);
    const changedFiles = changedFilesResponse.map((file: any) => file.filename);
    console.log(`Changed files:`, changedFiles);

    for (const fileName of changedFiles) {
      const fileContent = await fetchFileContent(repoFullName, fileName, latestCommitSha);
      console.log(`Content for file ${fileName}:`, fileContent);

      const aiReview = await generateCodeReview({ repoFullName, prNumber, fileName, fileContent, latestCommitSha });
      console.log(`AI Review for ${fileName}:\n`, aiReview);
    }

    return "Files fetched and contents retrieved.";
  } catch (error) {
    console.error("Error processing PR:", error);
    throw new Error("Error processing PR");
  }
};

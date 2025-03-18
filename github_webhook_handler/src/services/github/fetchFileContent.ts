import axios from 'axios'
import { GITHUB_API_URL, GITHUB_TOKEN } from '../../config'

export const fetchFileContent = async (
  repoFullName: string,
  filePath: string,
  latestCommitSha: string
): Promise<string> => {
  try {
    const response = await axios.get(
      `${GITHUB_API_URL}/repos/${repoFullName}/contents/${filePath}`,
      {
        params: { ref: latestCommitSha },
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

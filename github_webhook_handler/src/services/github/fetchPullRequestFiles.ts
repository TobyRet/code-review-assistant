import axios from 'axios'
import { GITHUB_API_URL, GITHUB_TOKEN, IGNORED_FILES } from '../../config'

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
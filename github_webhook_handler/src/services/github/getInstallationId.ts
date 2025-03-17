import { generateGitHubAppJWT } from '../../utils'
import axios from 'axios'
import { GITHUB_API_URL } from '../../config'

export const getInstallationId = async (repoFullName: string): Promise<number> => {
  const jwt = generateGitHubAppJWT();

  try {
    const response = await axios.get(`${GITHUB_API_URL}/repos/${repoFullName}/installation`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    return response.data.id;
  } catch (error) {
    console.error("Error fetching installation ID:", error);
    throw new Error("Failed to obtain GitHub App installation ID");
  }
};
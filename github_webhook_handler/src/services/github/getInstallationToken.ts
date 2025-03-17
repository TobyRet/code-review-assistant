import { generateGitHubAppJWT } from '../../utils'
import axios from 'axios'
import { GITHUB_API_URL } from '../../config'

export const getInstallationToken = async (installationId: number): Promise<string> => {
  const jwt = generateGitHubAppJWT();

  try {
    const response = await axios.post(
      `${GITHUB_API_URL}/app/installations/${installationId}/access_tokens`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    return response.data.token;
  } catch (error) {
    console.error("Error fetching installation token:", error);
    throw new Error("Failed to obtain GitHub App installation token");
  }
};
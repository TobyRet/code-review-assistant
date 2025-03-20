import axios from 'axios'
import { GITHUB_API_URL, GITHUB_TOKEN } from '../../config'
import { sleep } from '../../utils'
import { getInstallationId } from './getInstallationId'
import { getInstallationToken } from './getInstallationToken'
import { PostReviewCommentParams } from './types'

export const postReviewComment = async (
  {repoFullName, prNumber, comment, filePath, latestCommitSha}: PostReviewCommentParams
): Promise<void> => {
  let attempts = 0;
  const MAX_RETRIES = 3;
  const RETRY_DELAY_MS = 2000; // 2 seconds

  while (attempts < MAX_RETRIES) {
    try {
      const installationId = await getInstallationId(repoFullName);
      const accessToken = await getInstallationToken(installationId);

      await axios.post(
        `${GITHUB_API_URL}/repos/${repoFullName}/pulls/${prNumber}/comments`,
        {
          body: comment,
          commit_id: latestCommitSha,
          path: filePath,
          line: 1,
          side: "RIGHT",
        },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
      )

      console.log(`Successfully posted review comment on PR #${prNumber}`);
      return;
    } catch (error) {
      attempts++;
      console.error(`Attempt ${attempts} - Failed to post review comment:`, error);

      if (attempts < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS);
      } else {
        console.error(`All attempts failed. Posting error message to PR.`);
        await axios.post(
          `${GITHUB_API_URL}/repos/${repoFullName}/issues/${prNumber}/comments`,
          { body: "⚠️ Error: Unable to post review comment after multiple attempts." },
          {
            headers: {
              Authorization: `Bearer ${GITHUB_TOKEN}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );
      }
    }
  }
};
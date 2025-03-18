export interface PostReviewCommentParams {
  repoFullName: string;
  prNumber: number;
  comment: string;
  filePath: string;
  latestCommitSha: string;
}
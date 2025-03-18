import axios from 'axios'
import { fetchPullRequestFiles } from './fetchPullRequestFiles'

jest.mock("axios");

jest.mock("@/config", () => ({
  GITHUB_WEBHOOK_SECRET: "mocked-secret",
  GITHUB_API_URL: "https://api.github.com",
  IGNORED_FILES: [],
}));

describe('fetchPullRequestFiles', () => {
  it("fetches PR files successfully", async () => {
    const mockResponse = {
      data: [{ filename: "src/index.ts" }, { filename: "src/utils.ts" }],
    };
    (axios.get as jest.Mock).mockResolvedValue(mockResponse);

    const files = await fetchPullRequestFiles("user/repo", 123);

    expect(files).toEqual(mockResponse.data);
    expect(axios.get).toHaveBeenCalledWith(
      "https://api.github.com/repos/user/repo/pulls/123/files",
      expect.any(Object)
    );
  });
});
import axios from 'axios'
import { fetchFileContent } from './fetchFileContent'

jest.mock("axios");

jest.mock("@/config", () => ({
  GITHUB_WEBHOOK_SECRET: "mocked-secret",
  GITHUB_API_URL: "https://api.github.com",
}));

describe('fetchFileContent', () => {
  it("fetches and decodes file content successfully", async () => {
    const mockBase64Content = Buffer.from("console.log('Hello, world!');").toString("base64");
    const mockResponse = { data: { content: mockBase64Content } };
    (axios.get as jest.Mock).mockResolvedValue(mockResponse);

    const content = await fetchFileContent("user/repo", "src/index.ts", "sha123");

    expect(content).toBe("console.log('Hello, world!');");
    expect(axios.get).toHaveBeenCalledWith(
      "https://api.github.com/repos/user/repo/contents/src/index.ts",
      expect.objectContaining({ params: { ref: "sha123" } })
    );
  });
})
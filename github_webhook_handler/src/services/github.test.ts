import axios from "axios"
import { fetchFileContent, fetchPullRequestFiles, verifySignature } from "./github"
import { GITHUB_API_URL, GITHUB_WEBHOOK_SECRET } from '../config'
import crypto from "crypto"
import express from 'express'

jest.mock("axios");

jest.mock("@/config", () => ({
  GITHUB_WEBHOOK_SECRET: "mocked-secret",
  GITHUB_API_URL: "https://api.github.com",
}));

describe("GitHub Service", () => {
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

  describe("verifying a Github webhook signature", () => {
    it("verifies a valid GitHub webhook signature", () => {
      const req = { headers: {}, body: { test: "data" } } as express.Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as Partial<express.Response> as express.Response;
      const bodyBuffer = Buffer.from(JSON.stringify(req.body));

      req.headers["x-hub-signature-256"] = "sha256=" + crypto.createHmac("sha256", GITHUB_WEBHOOK_SECRET)
        .update(bodyBuffer)
        .digest("hex");

      verifySignature(req, res, bodyBuffer);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
    });

    it("rejects an invalid GitHub webhook signature", () => {
      const req = { headers: { "x-hub-signature-256": "invalid-signature" }, body: { test: "data" } } as unknown as express.Request;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as express.Response;
      const bodyBuffer = Buffer.from(JSON.stringify(req.body));

      verifySignature(req, res, bodyBuffer);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith("Invalid signature");
    });
  })
});

import express from 'express'
import crypto from 'crypto'
import { GITHUB_WEBHOOK_SECRET } from '../../config'
import { verifySignature } from './verifySignature'

jest.mock("@/config", () => ({
  GITHUB_WEBHOOK_SECRET: "mocked-secret",
  GITHUB_API_URL: "https://api.github.com",
  IGNORED_FILES: [],
}));

describe('verifySignature', () => {
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
const http = require("node:http");
const crypto = require("node:crypto");
const { OAUTH_TIMEOUT_MS } = require("./constants");
const {
  getLoopbackBindHost,
  parseLoopbackRedirectUri,
} = require("./redirect-uri");

function writeTextResponse(res, statusCode, body, contentType = "text/plain; charset=utf-8") {
  res.statusCode = statusCode;
  res.setHeader("cache-control", "no-store, max-age=0");
  res.setHeader("pragma", "no-cache");
  res.setHeader("x-content-type-options", "nosniff");
  res.setHeader("content-type", contentType);
  res.end(body);
}

function stateMatches(expectedState, state) {
  if (!expectedState || !state) {
    return false;
  }

  const expected = Buffer.from(String(expectedState));
  const actual = Buffer.from(String(state));
  if (expected.length !== actual.length) {
    return false;
  }

  return crypto.timingSafeEqual(expected, actual);
}

function waitForOAuthCallback(redirectUri, expectedState) {
  const redirect = parseLoopbackRedirectUri(redirectUri);
  const hostname = getLoopbackBindHost(redirect.hostname);
  const port = Number(redirect.port);
  const path = redirect.pathname || "/";

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      server.close();
      reject(new Error("Timed out waiting for OAuth callback."));
    }, OAUTH_TIMEOUT_MS);

    const server = http.createServer((req, res) => {
      const reqUrl = new URL(req.url || "/", `http://${hostname}:${port}`);
      if (reqUrl.pathname !== path) {
        writeTextResponse(res, 404, "Not found");
        return;
      }

      const state = reqUrl.searchParams.get("state");
      const code = reqUrl.searchParams.get("code");
      const error = reqUrl.searchParams.get("error");
      const errorDescription = reqUrl.searchParams.get("error_description");

      if (error) {
        writeTextResponse(res, 400, "Clio authorization failed. You can close this window.");
        clearTimeout(timeoutId);
        server.close();
        reject(
          new Error(
            `Authorization failed: ${error}${errorDescription ? ` (${errorDescription})` : ""}`
          )
        );
        return;
      }

      if (!code) {
        writeTextResponse(res, 400, "Missing authorization code. You can close this window.");
        clearTimeout(timeoutId);
        server.close();
        reject(new Error("OAuth callback did not include an authorization code."));
        return;
      }

      if (!stateMatches(expectedState, state)) {
        writeTextResponse(res, 400, "Invalid state. You can close this window.");
        clearTimeout(timeoutId);
        server.close();
        reject(new Error("State validation failed for OAuth callback."));
        return;
      }

      writeTextResponse(
        res,
        200,
        "<html><body><h3>Clio auth complete</h3><p>You can close this tab and return to the terminal.</p></body></html>",
        "text/html; charset=utf-8"
      );

      clearTimeout(timeoutId);
      server.close();
      resolve({ code, state });
    });

    server.on("error", (error) => {
      clearTimeout(timeoutId);
      reject(error);
    });

    server.listen(port, hostname);
  });
}

module.exports = {
  waitForOAuthCallback,
};

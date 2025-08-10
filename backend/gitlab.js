import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const gitlabRouter = express.Router();

const CLIENT_ID = process.env.GITLAB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITLAB_CLIENT_SECRET;
const REDIRECT_URI = "https://crispy-waffle-qrvgxpgj5w4hxv7r-5000.app.github.dev/gitlab/auth/gitlab/callback";

gitlabRouter.use(express.json());

let userAccessToken = "";

gitlabRouter.get("/auth/gitlab/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send("No code provided");

  try {
    const tokenResponse = await axios.post(
      "https://gitlab.com/oauth/token",
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    userAccessToken = tokenResponse.data.access_token;
    if (!userAccessToken) return res.send("Failed to get access token");

    console.log("Access Token:", userAccessToken);
    res.redirect("https://crispy-waffle-qrvgxpgj5w4hxv7r-5173.app.github.dev/repo?provider=gitlab");
  } catch (err) {
    console.error(err.response?.data || err);
    res.send("Error during GitLab OAuth");
  }
});

gitlabRouter.get("/api/user", async (req, res) => {
  if (!userAccessToken) return res.status(401).send("Not authenticated");

  try {
    const userResponse = await axios.get("https://gitlab.com/api/v4/user", {
      headers: { Authorization: `Bearer ${userAccessToken}` },
    });
    res.json(userResponse.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch user info");
  }
});

gitlabRouter.post("/auth/logout", (req, res) => {
  userAccessToken = "";
  res.json({ message: "Logged out successfully" });
});

gitlabRouter.get("/api/repos", async (req, res) => {
  if (!userAccessToken) return res.status(401).send("Not authenticated");

  try {
    const reposResponse = await axios.get(
      "https://gitlab.com/api/v4/projects?membership=true",
      {
        headers: { Authorization: `Bearer ${userAccessToken}` },
      }
    );
    res.json(reposResponse.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch repos");
  }
});

gitlabRouter.get("/api/repo/:id", async (req, res) => {
  if (!userAccessToken) return res.status(401).send("Not authenticated");

  try {
    const repoResponse = await axios.get(
      `https://gitlab.com/api/v4/projects/${encodeURIComponent(req.params.id)}`,
      {
        headers: { Authorization: `Bearer ${userAccessToken}` },
      }
    );
    res.json(repoResponse.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch repo details");
  }
});

gitlabRouter.get("/api/repo/:id/lines", async (req, res) => {
  if (!userAccessToken) return res.status(401).send("Not authenticated");

  const branch = req.query.branch || "main";

  try {
    const filesResponse = await axios.get(
      `https://gitlab.com/api/v4/projects/${encodeURIComponent(
        req.params.id
      )}/repository/tree?ref=${branch}`,
      {
        headers: { Authorization: `Bearer ${userAccessToken}` },
      }
    );

    let totalLines = 0;

    for (const file of filesResponse.data) {
      if (file.type === "blob") {
        const rawFile = await axios.get(
          `https://gitlab.com/api/v4/projects/${encodeURIComponent(
            req.params.id
          )}/repository/files/${encodeURIComponent(
            file.path
          )}/raw?ref=${branch}`,
          {
            headers: { Authorization: `Bearer ${userAccessToken}` },
          }
        );
        totalLines += rawFile.data.split("\n").length;
      }
    }

    res.json({ lines: totalLines });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch line count");
  }
});

export default gitlabRouter;
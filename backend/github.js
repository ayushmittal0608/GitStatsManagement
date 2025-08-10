import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const gitHubRouter = express.Router();

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

gitHubRouter.use(express.json());

let userAccessToken = "";

gitHubRouter.get('/auth/github/callback', async (req, res) => {
    console.log("Received code:", req.query.code);
    const code = req.query.code;
    if(!code){
        return res.send("No code provided");
    }
    try {
        const tokenResponse = await axios.post("https://github.com/login/oauth/access_token", {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code,
                redirect_uri: "https://crispy-waffle-qrvgxpgj5w4hxv7r-5000.app.github.dev/github/auth/github/callback",
            }, 
            {
                headers: { Accept: "application/json" }
            }
        );
        userAccessToken = tokenResponse.data.access_token;
        if (!userAccessToken){
            return res.send("Failed to get access token");
        }
        console.log(userAccessToken);
        res.redirect("https://crispy-waffle-qrvgxpgj5w4hxv7r-5173.app.github.dev/repo?provider=github");
    }
    catch(err) {
        console.error(err);
        res.send("Error during GitHub OAuth");
    }
});

gitHubRouter.get('/api/user', async (req, res) => {
  if (!userAccessToken) return res.status(401).send("Not authenticated");

  try {
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${userAccessToken}`,
        Accept: "application/vnd.github+json",
      },
    });
    res.json(userResponse.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch user info");
  }
});

gitHubRouter.post('/auth/logout', (req, res) => {
  userAccessToken = "";
  res.json({ message: "Logged out successfully" });
});

gitHubRouter.get('/api/repos', async (req, res) => {
  if (!userAccessToken) return res.status(401).send("Not authenticated");

  try {
    const reposResponse = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Authorization: `token ${userAccessToken}`,
        Accept: "application/vnd.github+json",
      }
    });
    res.json(reposResponse.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch repos");
  }
});

gitHubRouter.get('/api/repo/:name', async (req, res) => {
  if (!userAccessToken) return res.status(401).send("Not authenticated");

  const repoName = req.params.name;
  try {
    // Replace 'your-github-username' with the actual username or extract it from the token (optional)
    const usernameResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${userAccessToken}`,
        Accept: "application/vnd.github+json",
      }
    });
    const username = usernameResponse.data.login;

    const repoResponse = await axios.get(`https://api.github.com/repos/${username}/${repoName}`, {
      headers: {
        Authorization: `token ${userAccessToken}`,
        Accept: "application/vnd.github+json",
      }
    });

    res.json(repoResponse.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch repo details");
  }
});

gitHubRouter.get('/api/repo/:name/lines', async (req, res) => {
  if (!userAccessToken) return res.status(401).send("Not authenticated");

  const repoName = req.params.name;
  const branch = req.query.branch;

  try {
    // Get repo owner username
    const usernameResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${userAccessToken}`,
        Accept: "application/vnd.github+json",
      }
    });
    const username = usernameResponse.data.login;

    // Get repo root contents for branch
    const contentsResponse = await axios.get(
      `https://api.github.com/repos/${username}/${repoName}/contents?ref=${branch}`,
      {
        headers: { Authorization: `token ${userAccessToken}` },
      }
    );

    let totalLines = 0;
    const files = contentsResponse.data.filter((item) => item.type === "file");

    // For simplicity, count lines only of root files
    for (const file of files) {
      const fileContent = await axios.get(file.download_url);
      totalLines += fileContent.data.split("\n").length;
    }

    res.json({ lines: totalLines });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch line count");
  }
});

export default gitHubRouter;
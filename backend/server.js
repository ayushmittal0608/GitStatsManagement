import express from "express";
import dotenv from "dotenv";
import gitHubRouter from "./github.js";
import gitlabRouter from "./gitlab.js"; 

dotenv.config();

const app = express();

app.use(express.json());
app.use("/gitlab", gitlabRouter);
app.use("/github", gitHubRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`);
})
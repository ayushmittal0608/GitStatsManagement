import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());

app.get('/api/hello', (req, res) => {
    res.json({ data: "Hello from backend!" });
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})
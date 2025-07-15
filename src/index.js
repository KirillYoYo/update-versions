import express from 'express';
import dotenv from 'dotenv';
import { updateImageVersions } from './githubService.js';
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.post('/update-image', async (req, res) => {
  const { image, version } = req.body;
  if (!image || !version) {
    return res.status(400).json({ error: 'Missing image or version' });
  }
  try {
    const result = await updateImageVersions(image, version);
    res.json({ message: 'Update successful', result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

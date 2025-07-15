import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { updateImageVersions } from './githubService.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
console.log('starting server');
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Image Version Update API',
      version: '1.0.0',
      description: 'API для обновления версий образов в репозитории',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ['./src/swaggerDocs.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});


app.post('/update-image', async (req, res) => {
  const { image, version } = req.body;

  if (!image || !version) {
    return res.status(400).json({ error: 'Missing image or version' });
  }

  try {
    const result = await updateImageVersions(image, version);
    res.json({ message: 'Update successful', result });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

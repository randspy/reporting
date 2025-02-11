import express from 'express';
import cors from 'cors';
import { sleep } from './sleep';

const app = express();
app.use(cors());

app.get('/', (_, res) => {
  res.send('Mock Server');
});

app.get('/api/some-endpoint', async (_, res) => {
  await sleep();
  res.send({
    message: 'Hello World',
  });
});

export const viteNodeApp = app;

import express from 'express';
import cors from 'cors';
import { sleep } from './sleep';
import crypto from 'crypto';

// in reality it should be a UUID, but to be consistent with the apis I use numeric ids
function generateId(): number {
  return crypto.randomInt(1, 281474976710655);
}

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_, res) => {
  res.send('Mock Server');
});

interface Author {
  first_name: string;
  last_name: string;
  birth_date: string;
  sex: string;
  email: string;
}

interface Reporting {
  id: number;
  author: Author;
  description: string;
  observations: number[];
}

let reportings: Reporting[] = [];

app.get('/api/reportings', async (_, res) => {
  await sleep();
  res.send(reportings);
});

app.post('/api/reportings', async (req, res) => {
  await sleep(2000);
  if (reportings.some((r) => r.author.email === req.body.author.email)) {
    return res.status(400).json({
      author: {
        email: 'Cette valeur existe déjà',
      },
    });
  }

  const id = generateId();
  const newReporting = {
    ...req.body,
    id,
  };
  reportings.push(newReporting);
  res.send(newReporting);
});

app.put('/api/reportings/:id', async (req, res) => {
  await sleep(2000);

  const reportingIndex = reportings.findIndex(
    (r) => r.id === parseInt(req.params.id)
  );

  if (reportingIndex === -1) {
    return res.status(404).json({ message: 'Reporting not found' });
  }

  reportings[reportingIndex] = req.body;
  res.send(req.body);
});

app.get('/api/reportings/:id', async (req, res) => {
  await sleep();
  const reporting = reportings.find((r) => r.id === parseInt(req.params.id));

  if (!reporting) {
    return res.status(404).json({
      message: 'Reporting not found',
    });
  }
  res.send(reporting);
});

app.get('/api/observations', async (_, res) => {
  res.send([
    {
      id: 1,
      name: 'Observation 1',
    },
    {
      id: 2,
      name: 'Observation 2',
    },
    {
      id: 3,
      name: 'Observation 3',
    },
  ]);
});

export const viteNodeApp = app;

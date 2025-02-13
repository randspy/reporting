import express from 'express';
import cors from 'cors';
import reportingRoutes from './routes/reporting.routes';
import observationRoutes from './routes/observation.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_, res) => {
  res.send('Mock Server');
});

app.use('/api/reportings', reportingRoutes);
app.use('/api/observations', observationRoutes);

export const viteNodeApp = app;

import { Router } from 'express';
import { reportingStore } from '../domain/reporting.store';
import { generateId, sleep } from '../utils/helpers';

const router = Router();

router.get('/', async (_, res) => {
  await sleep();
  res.send(reportingStore.getAll());
});

router.post('/', async (req, res) => {
  await sleep(2000);
  if (reportingStore.findByEmail(req.body.author.email)) {
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
  reportingStore.add(newReporting);
  res.send(newReporting);
});

router.put('/:id', async (req, res) => {
  await sleep(2000);
  const id = parseInt(req.params.id);

  if (!reportingStore.update(id, req.body)) {
    return res.status(404).json({ message: 'Reporting not found' });
  }

  res.send(req.body);
});

router.get('/:id', async (req, res) => {
  await sleep();
  const reporting = reportingStore.findById(parseInt(req.params.id));

  if (!reporting) {
    return res.status(404).json({
      message: 'Reporting not found',
    });
  }
  res.send(reporting);
});

export default router;

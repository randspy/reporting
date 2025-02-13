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

  const existingReporting = reportingStore.findById(id);
  if (!existingReporting) {
    return res.status(404).json({ message: 'Reporting not found' });
  }

  if (existingReporting.author.email !== req.body.author.email) {
    const existingWithEmail = reportingStore.findByEmail(req.body.author.email);
    if (existingWithEmail) {
      return res.status(400).json({
        author: {
          email: 'Cette valeur existe déjà',
        },
      });
    }
  }

  reportingStore.update(id, req.body);
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

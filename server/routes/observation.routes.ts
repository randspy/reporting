import { Router } from 'express';

const router = Router();

router.get('/', async (_, res) => {
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

export default router;

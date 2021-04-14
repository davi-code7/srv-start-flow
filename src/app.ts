import express from 'express';
import OrchyBase from 'orchy-base-code7';
import SnsSqsSlq from 'sns-sqs-slq-code7';

import 'dotenv/config';

import middlewares from './middlewares/index';

const app = express();

middlewares(app);

const orchybase = new OrchyBase(false);
const snsSqsSlq = new SnsSqsSlq();

async function publishTop() {
  try {
    const queues = await orchybase.getQueues(10, {
      schedule: {
        $and: {
          $lt: new Date(),
        },
      },
      state: 'pending',
    });

    queues.forEach(async (queue) => {
      await snsSqsSlq.publishToTopic(
        'sns-start-flow',
        JSON.stringify({
          id_load: queue.load.id_load,
          id_flow: queue.load.id_flow,
          schedule: queue.schedule,
        }),
        'start-flow',
        'startFlow',
        'arn:aws:sns:us-east-1:303732912389:sns-start-flow.fifo',
      );

      if (
        process.env.NODE_ENV === 'production'
        || process.env.NODE_ENV === 'staging'
      ) {
        await orchybase.updateQueue(
          // @ts-ignore
          { id_queue: queue.id_queue },
          { state: 'working' },
        );
      }
    });
  } catch (err) {
    console.log(err);
  }
}

setInterval(() => {
  publishTop();
}, parseInt(process.env.LOOP_TIME, 10));

export default app;

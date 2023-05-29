import express from 'express';
import ioredis from 'ioredis';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const redisSubscriber = new ioredis(6379, 'localhost');
const redisPublisher = new ioredis(6379, 'localhost');

app.post('/publish', async (req, res) => {
  const { message } = req.body;
  console.log(message);

  await redisPublisher.publish('channel', message, (err) => {
    if (err) {
      console.error('Error publishing message:', err);
      res.status(500).json({ error: 'Failed to publish message' });
    }
  });
});

app.get('/subscribe', async (req, res) => {
  await redisSubscriber.subscribe('channel', (err) => {
    if (err) {
      console.error('Error subscribing to channel:', err);
      res.status(500).json({ error: 'Failed to subscribe to channel' });
    } else {
      console.log('Redis subscriber connected');
    }
  });

  // Listen for messages
  redisSubscriber.on('message', (channel, message) => {
    console.log(`Received message: ${message} from ${channel}`);
    res.status(200).json({ messages: [message] });
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

import { NextApiRequest, NextApiResponse } from 'next';
import * as tf from '@tensorflow/tfjs-node';
import * as use from '@tensorflow-models/universal-sentence-encoder';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { message } = req.body;
  
  // Load NLP model
  const model = await use.load();
  const embeddings = await model.embed(message);
  
  // Example: Simple intent detection
  const intents = {
    "plan_request": ["create", "build", "plan"],
    "transaction": ["buy", "sell", "payment"]
  };

  const intent = Object.keys(intents).find(key => 
    intents[key].some(word => message.includes(word))
  );

  res.status(200).json({ intent, embeddings: embeddings.arraySync() });
};
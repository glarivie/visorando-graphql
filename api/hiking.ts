import type { NowRequest, NowResponse } from '@vercel/node';
import { Document, model } from 'mongoose';

import type { Hiking } from '../types';

import '../config/mongo';

const HikingModel = model('Hiking');

export default async ({ query, method }: NowRequest, response: NowResponse) => {
  if (method !== 'GET') {
    return response.status(501).json({ message: 'Not Implemented' });
  }

  const data: Document = await HikingModel.findOne(query as Partial<Hiking>);

  return response.status(200).send(data);
};

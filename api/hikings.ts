import type { NowRequest, NowResponse } from '@vercel/node';
import { Document, model } from 'mongoose';
import { isUndefined, toNumber } from 'lodash';

import type { Point } from '../types';

import '../config/mongo';

const Hiking = model('Hiking');

interface HikingsArgs {
  readonly limit?: number;
  readonly near?: Point['coordinates']; // [lng, lat]
}

export default async ({ query, method }: NowRequest, response: NowResponse) => {
  if (method !== 'GET') {
    return response.status(501).json({ message: 'Not Implemented' });
  }

  const { limit = 10, near } = query as HikingsArgs;

  const data: Document[] = isUndefined(near)
    ? await Hiking
      .find({})
      .limit(toNumber(limit))
    : await Hiking
      .aggregate()
      .near({
        near: near.map(toNumber),
        distanceField: 'meta.distance', // required
        maxDistance: 5000, // 5km
        includeLocs: 'details.departure',
        uniqueDocs: true,
        spherical: true,
      })
      .limit(toNumber(limit));

  return response.status(200).send(data);
};

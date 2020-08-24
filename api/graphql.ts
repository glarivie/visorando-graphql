import { NowRequest, NowResponse } from '@vercel/node';
import { Document, model } from 'mongoose';
import { graphql, buildSchema } from 'graphql';
import { isUndefined } from 'lodash';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import { Point } from '../types';

import '../config/mongo';

const Hiking = model('Hiking');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(
  readFileSync(
    resolve(__dirname, '../schemas/hiking.gql'),
    'utf-8',
  ),
);

interface HikingsProps {
  readonly limit?: number;
  readonly near?: Point['coordinates']; // [lng, lat]
}

// The root provides a resolver function for each API endpoint
const root = {
  hiking: async ({ id, url }): Promise<Document> => {
    return id
      ? Hiking.findById(id).exec()
      : Hiking.findOne({ url }).exec();
  },
  hikings: async ({ limit = 10, near }: HikingsProps): Promise<Document[]> => {
    if (isUndefined(near)) {
      return Hiking.find({}).limit(limit);
    }

    return Hiking.aggregate().near({
      near,
      distanceField: 'meta.distance', // required
      maxDistance: 5000, // 5km
      includeLocs: 'details.departure',
      uniqueDocs: true,
      spherical: true,
      limit,
    });
  },
};

export default (req: NowRequest, res: NowResponse): void => {
  const { query } = req.body;

  // Run the GraphQL query and print out the response
  graphql(schema, query, root).then((response) => {
    return res.json(response);
  });
};

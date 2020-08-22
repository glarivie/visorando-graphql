import { NowRequest, NowResponse } from '@vercel/node';
import { Document, model } from 'mongoose';
import { graphql, buildSchema } from 'graphql';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import '../config/mongo';

const Hiking = model('Hiking');

const orleans = {
  lat: 47.9047,
  lng: 1.9076,
};

// Construct a schema, using GraphQL schema language
const schema = buildSchema(
  readFileSync(
    resolve(__dirname, '../schemas/hiking.gql'),
    'utf-8',
  ),
);

// The root provides a resolver function for each API endpoint
const root = {
  hiking: async ({ id, url }): Promise<Document> => {
    return id
      ? Hiking.findById(id).exec()
      : Hiking.findOne({ url }).exec();
  },
  hikings: async ({ limit }): Promise<Document[]> => {
    return Hiking.aggregate().near({
      near: [orleans.lng, orleans.lat],
      distanceField: 'calculated', // required
      maxDistance: 5000, // 5km
      // query: { type: 'public' },
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

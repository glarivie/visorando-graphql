import { Document, model } from 'mongoose';
import { isUndefined } from 'lodash';
import { ApolloServer } from 'apollo-server-micro';

import typeDefs from '../schemas/hikings.typeDefs';
import { Point } from '../types';

import '../config/mongo';

const Hiking = model('Hiking');

interface HikingsArgs {
  readonly limit?: number;
  readonly near?: Point['coordinates']; // [lng, lat]
}

const resolvers = {
  Query: {
    hiking: async (_, { id, url }): Promise<Document> => {
      return id
        ? Hiking.findById(id).exec()
        : Hiking.findOne({ url }).exec();
    },
    hikings: async (_, { limit = 10, near }: HikingsArgs): Promise<Document[]> => {
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
  },
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });

export default apolloServer.createHandler({ path: '/api/graphql' });

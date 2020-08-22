import { Document, model } from 'mongoose';
import * as graphql from 'graphql';

const Hiking = model('Hiking');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
} = graphql;

const HikingType = new GraphQLObjectType({
  name: 'Hiking',
  fields: () => ({
    id: { type: GraphQLID  },
    url: { type: GraphQLString },
    title: { type: GraphQLString },
    overview: { type: GraphQLString },
  }),
});

// RootQuery describe how users can use the graph and grab data.
// E.g Root query to get all authors, get all books, get a particular book
// or get a particular author.
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    hiking: {
      type: HikingType,
      // argument passed by the user while making the query
      args: { url: { type: GraphQLString } },
      resolve: async (parent, { url }): Promise<Document> => {
        // Here we define how to get data from database source
        // this will return the book with id passed in argument by the user
        return Hiking.findOne({ url }).exec()
      },
    },
    // hikings: {
    //   type: new GraphQLList(HikingType),
    //   resolve: async () => {
    //     return Hiking.find({}).exec()
    //   },
    // },
  },
});

// Creating a new GraphQL Schema, with options query which defines query
// we will allow users to use when they are making request.
export default new GraphQLSchema({ query: RootQuery });

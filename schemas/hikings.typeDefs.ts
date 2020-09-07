import { gql } from 'apollo-server-micro';

const typeDefs = gql`
  scalar Date

  type Point {
    type: String!
    coordinates: [String]!
  }

  type Vertical {
    rise: Int!
    drop: Int!
  }

  type Altitude {
    high: Int!
    low: Int!
  }

  type Details {
    ign: String
    duration: String
    distance: Float!
    vertical: Vertical!
    altitude: Altitude!
    difficulty: String
    loop: Boolean!
    type: String!
    region: String
    city: String
    zipCode: Int
    departure: Point!
    arrival: Point
  }

  type Rating {
    average: Float
    count: Float
    description: Float
    map: Float
    route: Float
  }

  type Review {
    author: String!
    date: Date
    rating: Float!
    description: String!
  }

  type Waypoint {
    index: Int!
    step: Int!
    elevation: Int!
    latitude: Float!
    longitude: Float!
  }

  type Meta {
    distance: Float
  }

  type Hiking {
    id: ID!
    url: String!
    title: String!
    createdAt: Date!
    updatedAt: Date!
    overview: String!
    details: Details!
    steps: [String]!
    rating: Rating!
    reviews: [Review]!
    images: [String]!
    waypoints: [Waypoint]
    meta: Meta
  }

  type Query {
    hiking (url: String, id: ID): Hiking
    hikings (limit: Int, near: [Float]): [Hiking]
  }
`;

export default typeDefs;

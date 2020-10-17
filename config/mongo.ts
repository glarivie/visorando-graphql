import mongoose, { ConnectionOptions } from 'mongoose';

import Hiking from '../schemas/hiking.mongoose';

const {
  MONGODB_USERNAME,
  MONGODB_PASSWORD,
  MONGODB_HOST,
  MONGODB_DATABASE,
} = process.env as { [k: string]: string };

const options: ConnectionOptions = {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  promiseLibrary: Promise,
  useUnifiedTopology: true,
  keepAlive: true,
  connectTimeoutMS: 0
};

// Create Mongo database connection
mongoose.connect(
  `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOST}/${MONGODB_DATABASE}?retryWrites=true&w=majority`,
  options,
);

mongoose.connection.on('connected', () => console.info('[MongoDB] is connected'));
mongoose.connection.on('disconnected', () => console.warn('[MongoDB] is disconnected'));

// Register Models
mongoose.model('Hiking', Hiking);

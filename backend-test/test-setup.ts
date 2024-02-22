import { MongoMemoryServer } from 'mongodb-memory-server';

export default async () => {
  globalThis.__MONGOD_GLOBAL__ = await MongoMemoryServer.create({
    binary: {
      version: '7.0.5',
    },
  });
};

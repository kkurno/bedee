import * as fs from 'fs';
import { resolve } from 'path';
import { CollectionData, CollectionKey, DocumentKey, StorageData } from './constants/database.constant';
import { ArrayElementType } from '@lib/constant/utility-type';

const DATA_FILE_PATH = `${resolve(process.env.ROOT_DIR as string)}/__data.json`;
const ENCODING: BufferEncoding = 'utf8';

export class DatabaseStorage {
  private static _isConnected: boolean = false;
  private static memoryStorageData: StorageData = {};

  static get isConnected() {
    return DatabaseStorage._isConnected;
  }

  private static writeFileFromMemory() {
    return fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(DatabaseStorage.memoryStorageData), ENCODING);
  }

  private static readFileToMemory() {
    DatabaseStorage.memoryStorageData = JSON.parse(fs.readFileSync(DATA_FILE_PATH, ENCODING));
  }

  static async connect() {
    if (!DatabaseStorage.isConnected) {
      if (!fs.existsSync(DATA_FILE_PATH)) {
        this.writeFileFromMemory();
      }
      this.readFileToMemory();
      DatabaseStorage._isConnected = true;
    }
  }

  static async disconnect() {
    if (DatabaseStorage.isConnected) {
      DatabaseStorage.memoryStorageData = {};
      DatabaseStorage._isConnected = false;
    }
  }

  static async get(collectionKey: CollectionKey): Promise<CollectionData> {
    if (!DatabaseStorage.isConnected) {
      throw new Error('Database storage is not connected');
    }
    return DatabaseStorage.memoryStorageData[collectionKey] ?? {};
  }

  static async set(collectionKey: CollectionKey, data: CollectionData, options?: { partial?: boolean }) {
    if (!DatabaseStorage.isConnected) {
      throw new Error('Database storage is not connected');
    }
    const { partial = true } = options ?? {};
    DatabaseStorage.memoryStorageData[collectionKey] = partial
      ? { ...DatabaseStorage.memoryStorageData[collectionKey], ...data }
      : data;
    this.writeFileFromMemory();
  }

  static async delete<Keys extends DocumentKey[] = DocumentKey[]>(collectionKey: CollectionKey, documentKeys: Keys): Promise<boolean[]> {
    if (!DatabaseStorage.isConnected) {
      throw new Error('Database storage is not connected');
    }
    const result = documentKeys.map((docKey) => {
      const isFound = Boolean(DatabaseStorage.memoryStorageData[collectionKey][docKey]);
      if (isFound) delete DatabaseStorage.memoryStorageData[collectionKey][docKey];
      this.writeFileFromMemory();
      return isFound;
    });
    return result;
  }
}

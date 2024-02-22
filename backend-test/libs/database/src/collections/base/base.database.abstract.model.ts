import { DocumentData, DocumentKey, Query, QueryFilter } from '@lib/database/constants/database.constant';
import { DatabaseStorage } from '@lib/database/database.storage';
import { generateDocumentId } from '@lib/database/utilities/id';
import dayjs from '@lib/dayjs';

export abstract class BaseDatabaseModel {
  abstract _collectionKey: string;

  _id: string;
  created_at: string;

  get document() {
    const { $checkMatch, $findById, $findOne, $findMany, $insertOne, $deleteOne, $deleteMany, _collectionKey, document, ...rest } = this;
    return rest;
  }

  private $checkMatch(documentData: DocumentData, query: Query<this['document']>): boolean {
    const documentFields = Object.keys(query);
    if (documentFields.length === 0) {
      return false;
    }
    const isQueryMatched = documentFields.every((documentField) => {
      const documentFieldValue = documentData[documentField];
      const queryOperation = query[documentField]!;
      switch (queryOperation.type) {
        case 'value': {
          const isQueryValueMatched = Object.is(documentFieldValue, queryOperation.value);
          return isQueryValueMatched;
        }
        case 'filter': {
          const queryFilterKeys = Object.keys(queryOperation.filter) as (keyof QueryFilter)[];
          if (queryFilterKeys.length === 0) {
            return false;
          }
          const isQueryFilterMatched = queryFilterKeys.every((queryFilterKey) => {
            switch (queryFilterKey) {
              case '$in': {
                return queryOperation.filter[queryFilterKey]!.includes(documentFieldValue);
              }
              case '$regex': {
                const regex = queryOperation.filter[queryFilterKey]!;
                return new RegExp(regex).test(documentFieldValue);
              }
            }
          });
          return isQueryFilterMatched;
        }
        default: {
          return false;
        }
      }
    });
    return isQueryMatched;
  }

  async $findById(id: DocumentKey): Promise<this['document'] | null> {
    const matchedDocument = (await DatabaseStorage.get(this._collectionKey))[id];
    return (matchedDocument as any) ?? null;
  }

  async $findOne(query: Query<this['document']>): Promise<this['document'] | null> {
    const collection = await DatabaseStorage.get(this._collectionKey);
    const matchedDocument = Object.values(collection).find((documentData) => {
      if (Object.keys(query).length === 0) return true;
      return this.$checkMatch(documentData, query);
    });
    return (matchedDocument as any) ?? null;
  }

  async $findMany(query: Query<this['document']>): Promise<this['document'][]> {
    const collection = await DatabaseStorage.get(this._collectionKey);
    const documents = Object.values(collection);
    const matchedDocuments: any[] = [];
    for (let i = 0; i < documents.length; i += 1) {
      const isMatched = Object.keys(query).length === 0 || this.$checkMatch(documents[i], query);
      if (isMatched) {
        matchedDocuments.push(documents[i]);
      }
    }
    return matchedDocuments;
  }

  async $insertOne(data: Omit<this['document'], '_collectionKey' | '_id' | 'created_at'>): Promise<this['document']> {
    // TODO: implement id collision prevention.
    const id = generateDocumentId();
    if (await DatabaseStorage.get(this._collectionKey)[id]) {
      throw new Error('Document ID collision has occurred.');
    }
    const newDoc: this['document'] = {
      ...data,
      _id: id,
      created_at: dayjs().toISOString(),
    };

    await DatabaseStorage.set(this._collectionKey, { [id]: newDoc }, { partial: true });
    return newDoc;
  }

  // TODO: support deeply update
  async $updateOne(query: Query<this['document']>, data: Partial<this['document']>): Promise<this['document'] | null> {
    const matchedDocument = await this.$findOne(query);
    if (!matchedDocument) {
      return null;
    }
    const { _id, ...dataToUpdate } = data;
    const updatedDocument = { ...matchedDocument, ...dataToUpdate };
    await DatabaseStorage.set(
      this._collectionKey,
      {
        [matchedDocument._id]: updatedDocument,
      },
      { partial: true }
    );
    return updatedDocument;
  }

  // TODO: support deeply update
  async $updateMany(query: Query<this['document']>, data: Partial<this['document']>): Promise<this['document'][]> {
    const matchedDocuments = await this.$findMany(query);
    const { _id, ...dataToUpdate } = data;
    const updatedDocuments: this['document'][] = [];
    await DatabaseStorage.set(
      this._collectionKey,
      matchedDocuments.reduce((acc, matchedDocument) => {
        const updatedDocument = { ...matchedDocument, ...dataToUpdate };
        updatedDocuments.push(updatedDocument);
        return {
          ...acc,
          [matchedDocument._id]: updatedDocument,
        };
      }, {}),
      { partial: true },
    );
    return updatedDocuments;
  }

  async $deleteOne(query: Query<this['document']>): Promise<boolean> {
    const matchedDocument = await this.$findOne(query);
    if (!matchedDocument) {
      return false;
    }
    const result = await DatabaseStorage.delete(this._collectionKey, [matchedDocument._id]);
    return result.every(r => r);
  }

  async $deleteMany(query: Query<this['document']>): Promise<{ _id: DocumentKey; success: boolean }[]> {
    const matchedDocuments = await this.$findMany(query);
    const result = await DatabaseStorage.delete(this._collectionKey, matchedDocuments.map(d => d._id));
    return result.map((success, index) => ({ _id: matchedDocuments[index]._id, success }));
  }
}

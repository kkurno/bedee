export type DocumentKey = string;
export type DocumentData = Record<string, any>;

export type CollectionKey = string;
export type CollectionData = Record<DocumentKey, DocumentData>;

export type StorageData = Record<CollectionKey, CollectionData>;

export type QueryFilter = {
  $in?: (string | number | boolean | null | undefined)[];
  $regex?: string | RegExp;
};
export type QueryOperation<V> = { type: 'value'; value: V }
  | { type: 'filter'; filter: QueryFilter };
export type Query<D extends DocumentData = DocumentData> = Partial<{
  [K in keyof D]: QueryOperation<D[K]>;
}>;

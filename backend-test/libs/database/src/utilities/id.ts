import { v4 as uuidv4, version as uuidVersion, validate as uuidValidate } from 'uuid';

export const generateDocumentId = () => {
  return uuidv4();
};

export const validateDocumentId = (uuid) => {
  return uuidValidate(uuid) && uuidVersion(uuid) === 4;
};

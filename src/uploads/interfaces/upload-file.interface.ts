import { FileTypes } from '../enums/file-types';

export interface UploadedFile {
  name: string;
  path: string;
  type: FileTypes;
  mime: string;
  size: number;
}

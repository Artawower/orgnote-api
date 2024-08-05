export * from './api';
export * from './models';
import type * as ast from 'org-mode-ast';
export * from './encryption';
export * from './tools';
export { ast };
import { Axios } from 'axios';
import { Stream } from 'stream';

// NOTE: patch cause of incorrect generated api (form-data and swaggo)
export const initFilesApi = (axiosInstance: Axios) => {
  return {
    uploadFiles: async (file: File) => {
      const formData = new FormData();
      formData.append('files', file);
      const response = await axiosInstance.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    downloadFile: async (relativeFilePath: string): Promise<Stream> => {
      const downloadedFilePath = `/media/${relativeFilePath}`;
      const stream = await axiosInstance
        .get(downloadedFilePath, { responseType: 'stream' })
        .then((r) => r.data);
      return stream;
    },
  } as const;
};

import { readFile } from 'fs/promises';

export class Service {

  constructor() {}

  async getFileStream(file) {
    let res = {
      error:  null,
      data: ''
    }

    try {
      const readable = await readFile(file, null);
      res.data = readable;
    } catch (er) {
      res.error = er;
    } finally {
      return res;
    }

  }

}
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const currentDir = dirname(fileURLToPath(import.meta.url));
const root = join(currentDir, '../');
const publicDirectory = join(root, 'public');

export default {
  port: process.env.PORT || 3000,
  pages: {
    homeHTML: 'home/index.html'
  },
  location: {
    home: '/home'
  },
  dir: {
    root,
    publicDirectory
  }
}
import { Service } from "./service.js";

export class Controller {

  constructor() {
    this.service = new Service;
  }

  async getFileStream(filename) {
    return this.service.getFileStream(filename);
  }

  async downloadVideo(request, response) {
    return this.service.downloadVideo(request, response);
  }

  async downloadAudio(request, response) {
    return this.service.downloadAudio(request, response);
  }

  async downloadAudioAndVideo(request, response) {
    return this.service.downloadAudioAndVideo(request, response);
  }

  async mergeAudioAndVideo(request, response) {
    return this.service.mergeAudioAndVideo(request, response);
  }
}

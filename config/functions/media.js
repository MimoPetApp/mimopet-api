const { Storage } = require("@google-cloud/storage");
const storage = new Storage({
  keyFilename: process.env.GCS_SERVICE_ACCOUNT,
});
const GCS_PROVIDER = "google-cloud-storage";

module.exports = {
  getFileFromGCS: async (fileUrl) => {
    const fileName = fileUrl.replace(process.env.GCS_BASE_URL + "/", "");
    try {
      const data = await storage
        .bucket(process.env.GCS_BUCKET_NAME)
        .file(fileName)
        .get();
      return data[0];
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  getWebmUrl: (urlToFile) => {
    const re = /(?:\.([^.]+))?$/;
    const ext = re.exec(urlToFile)[1];
    return urlToFile.replace(ext, "webm");
  },

  isVideo: (media) => {
    return media.mime.includes("video");
  },

  getOptimizerVideo: async (media) => {
    if (media.provider == GCS_PROVIDER) {
      const WEBM_MIME = "video/webm";
      if (media.mime !== WEBM_MIME) {
        const webmUrl = strapi.config.functions["media"].getWebmUrl(media.url);
        const file = await strapi.config.functions["media"].getFileFromGCS(
          webmUrl
        );
        if (file) {
          media.url = webmUrl;
          media.mime = WEBM_MIME;
          media.ext = ".webm";
          media.size = file.metadata.size;
        }
      }
    }
    return media;
  },
};

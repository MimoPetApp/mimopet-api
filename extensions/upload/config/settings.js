const fs = require("fs");

module.exports = {
  provider: "google-cloud-storage",
  providerOptions: {
    serviceAccount: JSON.parse(
      fs.readFileSync(process.env.GCS_SERVICE_ACCOUNT)
    ),
    bucketName: process.env.GCS_BUCKET_NAME,
    basePath: process.env.GCS_BASE_PATH,
    baseUrl: process.env.GCS_BASE_URL,
    publicFiles: process.env.GCS_PUBLIC_FILES,
    uniform: process.env.GCS_UNIFORM,
  },
};

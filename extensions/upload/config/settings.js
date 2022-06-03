/*module.exports = {
  provider: 'aws-s3',
  providerOptions: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
    region: process.env.AWS_REGION,
    params: {
      Bucket: process.env.AWS_UPLOAD_BUCKET,
    },
  },
};*/
module.exports = ({ env }) => ({
    upload: {
      config: {
        provider: '@strapi-community/strapi-provider-upload-google-cloud-storage',
        providerOptions: {
          serviceAccount: env.json('GCS_SERVICE_ACCOUNT'),
          bucketName: env('GCS_BUCKET_NAME'),
          basePath: env('GCS_BASE_PATH'),
          baseUrl: env('GCS_BASE_URL'),
          publicFiles: env('GCS_PUBLIC_FILES'),
          uniform: env('GCS_UNIFORM'),
        },
      },
    },
    //...
});
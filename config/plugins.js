// AWS:
// module.exports = ({ env }) => ({
//   upload: {
//     provider: 'aws-s3'
//   },
//   email: {
//     config: {
//       provider: 'sendgrid',
//       providerOptions: {
//         apiKey: process.env.SENDGRID_API_KEY,
//       },
//       settings: {
//         defaultFrom: process.env.MAIL,
//         defaultReplyTo: process.env.MAIL,
//         testAddress: process.env.MAIL
//       },
//     },
//   }
// });

// Google
module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: "@strapi-community/strapi-provider-upload-google-cloud-storage",
      providerOptions: {
        serviceAccount: env.json("GCS_SERVICE_ACCOUNT"),
        bucketName: env("GCS_BUCKET_NAME"),
        basePath: env("GCS_BASE_PATH"),
        baseUrl: env("GCS_BASE_URL"),
        publicFiles: env("GCS_PUBLIC_FILES"),
        uniform: env("GCS_UNIFORM"),
      },
    },
  },
});

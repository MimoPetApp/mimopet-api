module.exports = ({ env }) => ({
  upload: {
    provider: 'aws-s3'
  },
  email: {
    config: {
      provider: 'sendgrid',
      providerOptions: {
        apiKey: process.env.SENDGRID_API_KEY,
      },
      settings: {
        defaultFrom: process.env.DEFAULT_EMAIL,
        defaultReplyTo: process.env.DEFAULT_EMAIL,
        testAddress: process.env.DEFAULT_EMAIL
      },
    },
  }
});
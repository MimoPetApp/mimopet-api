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
        defaultFrom: process.env.MAIL,
        defaultReplyTo: process.env.MAIL,
        testAddress: process.env.MAIL
      },
    },
  }
});
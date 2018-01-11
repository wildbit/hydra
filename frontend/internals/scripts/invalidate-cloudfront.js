const AWS = require('aws-sdk');
const cf = new AWS.CloudFront();
cf.createInvalidation({
  DistributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID,
  InvalidationBatch: {
    CallerReference: new Date().toUTCString(),
    Paths: {
      Quantity: 1,
      Items: ['/*'],
    },
  },
}, (err, result) => {
  if (err) {
    console.log('Distribution could not be invalidated. You should manually invalidate the cloudfront cache.');
    process.exit(-1);
  } else {
    console.log('Distribution Invalidated');
  }
});

const AWS = require('aws-sdk');
const s3Bucket = new AWS.S3({
  "accessKeyId":process.env.accessKeyId,
    "secretAccessKey":process.env.secretAccessKey,
    "region":process.env.region,
    "signatureVersion": process.env.signatureVersion,
      Bucket: process.env.bucket
});


module.exports = {
  uploadfile: async (file, filename) => {
    const params = {
      Bucket: process.env.bucket,
      Key: 'assets' + '/' + filename + ".jpg",
      ACL: 'public-read',
      ContentEncoding: 'base64,',
      Body: Buffer.from(file.replace(/^data:image\/\w+;base64,/, ""), 'base64'),
      ContentType: 'image/jpeg'

    };

    // create a promise to return the data
    let s3Promise = new Promise(function (resolve, reject) {
      // executor (the producing code, "singer")
      s3Bucket.upload(params, function (err, data) {
        if (err) {
          console.log('There was an error uploading your file: ', JSON.stringify(err));
          reject(JSON.stringify(err))
          return false;
        }
        resolve(data)
      });
    });

    return s3Promise

  }
}
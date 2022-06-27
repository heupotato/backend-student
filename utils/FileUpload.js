var AWS = require('aws-sdk');

var accessKeyId = process.env.AWS_ACCESS_KEY
var secretAccessKey = process.env.AWS_SECRET_KEY

const bucketUrl = "https://student-channel-img.s3.ap-southeast-1.amazonaws.com/"

const upload = async (file, filename) => {
    AWS.config.update({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    });

    var s3 = new AWS.S3();

    var params = {
        Bucket: 'student-channel-img',
        Key: filename,
        Body: file.buffer
    };

    await s3.putObject(params, function (perr, pres) {
        if (perr) {
            throw (perr)
        } else {
            console.log("succeeded")
        }
    });
}

const fileUploadService = {
    upload,
    bucketUrl
}

module.exports = fileUploadService
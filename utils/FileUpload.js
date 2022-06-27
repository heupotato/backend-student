var AWS = require('aws-sdk');

var accessKeyId = process.env.AWS_ACCESS_KEY
var secretAccessKey = process.env.AWS_SECRET_KEY

const bucketUrl = "https://student-channel-img.s3.ap-southeast-1.amazonaws.com/"

const upload = async (file, filename) => {
    AWS.config.update({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        region: 'ap-southeast-1'
    });

    var s3 = new AWS.S3();

    var params = {
        Bucket: 'student-channel-img',
        Key: filename,
        Body: file.buffer
    };

    try {
        await s3.putObject(params, function (perr, pres) {
            if (perr) {
                throw (perr)
            } else {
                console.log("succeeded")
            }
        }).promise;
    }
    catch (err) {
        throw err
    }
}

const deleteFile = async (filename) => {
    AWS.config.update({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        region: 'ap-southeast-1'
    });

    var s3 = new AWS.S3();

    var params = {
        Bucket: 'student-channel-img',
        Key: filename
    };

    try {
        await s3.deleteObject(params, (err) => {
            if (err) {
                throw err;
            } else console.log("deleted")
        }).promise();
    }
    catch (error) { error }
}

const fileUploadService = {
    upload,
    bucketUrl,
    deleteFile
}

module.exports = fileUploadService
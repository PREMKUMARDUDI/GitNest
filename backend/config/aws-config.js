const AWS = require("aws-sdk");
const dotenv = require("dotenv");
dotenv.config();

AWS.config.update({
  region: "ap-south-1",
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
});

const s3 = new AWS.S3();

const S3_BUCKET = "github-clone-bucket";

module.exports = { s3, S3_BUCKET };

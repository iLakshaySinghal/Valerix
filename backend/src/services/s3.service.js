const AWS = require("../config/aws");
const { v4: uuidv4 } = require("uuid");

const s3 = new AWS.S3();

class S3Service {

  static async generatePresignedUrl({ fileType }) {
    const fileExtension = fileType.split("/")[1];
    const fileKey = `uploads/${uuidv4()}.${fileExtension}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileKey,
      ContentType: fileType,
      Expires: 120,     // URL valid for 2 minutes
      ACL: "public-read" // allow images to be visible
    };

    const uploadUrl = await s3.getSignedUrlPromise("putObject", params);

    const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

    return { uploadUrl, fileUrl };
  }
}

module.exports = S3Service;

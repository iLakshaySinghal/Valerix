const S3Service = require("../services/s3.service");

exports.getPresignedUrl = async (req, res, next) => {
  try {
    const { type } = req.query;
    if (!type) {
      const e = new Error("File type is required");
      e.status = 400;
      throw e;
    }

    const data = await S3Service.generatePresignedUrl({ fileType: type });
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

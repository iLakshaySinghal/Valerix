const Profile = require("../models/Profile");

exports.createProfile = async (req, res) => {
  const userId = req.user.id;

  const exists = await Profile.findOne({ userId });
  if (exists) return res.status(400).json({ message: "Profile already exists" });

  const profile = await Profile.create({ userId, ...req.body });

  res.json({ success: true, profile });
};

exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const profile = await Profile.findOneAndUpdate(
    { userId },
    req.body,
    { new: true }
  );

  res.json({ success: true, profile });
};

exports.getMyProfile = async (req, res) => {
  const userId = req.user.id;
  const profile = await Profile.findOne({ userId });
  res.json({ success: true, profile });
};

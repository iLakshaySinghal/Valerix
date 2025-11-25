const Address = require("../models/Address");

exports.addAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // If this new address is default → unset previous default
    if (req.body.isDefault) {
      await Address.updateMany({ user: userId }, { isDefault: false });
    }

    const address = await Address.create({
      user: userId,
      ...req.body
    });

    res.json({ success: true, address });
  } catch (err) {
    next(err);
  }
};

exports.getAddresses = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const addresses = await Address.find({ user: userId })
      .sort({ isDefault: -1 });

    res.json({ success: true, addresses });
  } catch (err) {
    next(err);
  }
};

exports.setDefaultAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    // Reset old default
    await Address.updateMany({ user: userId }, { isDefault: false });

    await Address.findOneAndUpdate(
      { _id: addressId, user: userId },
      { isDefault: true }
    );

    res.json({ success: true, message: "Default address updated" });
  } catch (err) {
    next(err);
  }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    await Address.deleteOne({
      _id: addressId,
      user: userId
    });

    res.json({ success: true, message: "Address deleted" });
  } catch (err) {
    next(err);
  }
};

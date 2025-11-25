const UserService = require("../services/user.service");

exports.getProfile = async (req, res, next) => {
  try {
    const data = await UserService.getProfile(req.user.id);
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await UserService.updateProfile(req.user.id, req.body);
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// ADDRESS CONTROLLERS
exports.addAddress = async (req, res, next) => {
  try {
    const address = await UserService.addAddress(req.user.id, req.body);
    res.json({ success: true, address });
  } catch (err) {
    next(err);
  }
};

exports.getAddresses = async (req, res, next) => {
  try {
    const addresses = await UserService.getAddresses(req.user.id);
    res.json({ success: true, addresses });
  } catch (err) {
    next(err);
  }
};

exports.updateAddress = async (req, res, next) => {
  try {
    const address = await UserService.updateAddress(
      req.params.id,
      req.user.id,
      req.body
    );
    res.json({ success: true, address });
  } catch (err) {
    next(err);
  }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    const deleted = await UserService.deleteAddress(
      req.params.id,
      req.user.id
    );
    res.json({ success: true, deleted });
  } catch (err) {
    next(err);
  }
};

exports.setDefaultAddress = async (req, res, next) => {
  try {
    const user = await UserService.setDefaultAddress(
      req.user.id,
      req.params.id
    );
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

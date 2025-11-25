const User = require("../models/User");
const Address = require("../models/Address");

class UserService {
  // Get my profile
  static async getProfile(userId) {
    const user = await User.findById(userId).lean();
    if (!user) throw new Error("User not found");

    const defaultAddress = user.defaultAddressId
      ? await Address.findById(user.defaultAddressId).lean()
      : null;

    return { user, defaultAddress };
  }

  // Update profile
  static async updateProfile(userId, data) {
    const user = await User.findByIdAndUpdate(userId, data, { new: true });
    return user;
  }

  // Address operations
  static async addAddress(userId, data) {
    const address = await Address.create({ userId, ...data });
    return address;
  }

  static async getAddresses(userId) {
    return Address.find({ userId }).sort({ createdAt: -1 }).lean();
  }

  static async updateAddress(addressId, userId, data) {
    const address = await Address.findOneAndUpdate(
      { _id: addressId, userId },
      data,
      { new: true }
    );
    if (!address) throw new Error("Address not found");
    return address;
  }

  static async deleteAddress(addressId, userId) {
    const deleted = await Address.findOneAndDelete({
      _id: addressId,
      userId
    });
    if (!deleted) throw new Error("Address not found");
    return deleted;
  }

  static async setDefaultAddress(userId, addressId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { defaultAddressId: addressId },
      { new: true }
    );
    return user;
  }
}

module.exports = UserService;

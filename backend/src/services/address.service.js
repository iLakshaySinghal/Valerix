const Address = require("../models/Address");

class AddressService {

  static async createAddress(userId, data) {
    if (data.isDefault) {
      await Address.updateMany({ user: userId }, { isDefault: false });
    }

    return Address.create({
      user: userId,
      ...data
    });
  }

  static async getAddresses(userId) {
    return Address.find({ user: userId }).sort({ isDefault: -1 });
  }

  static async updateAddress(id, userId, data) {
    const addr = await Address.findOne({ _id: id, user: userId });
    if (!addr) throw new Error("Address not found");

    if (data.isDefault) {
      await Address.updateMany({ user: userId }, { isDefault: false });
    }

    Object.assign(addr, data);
    return addr.save();
  }

  static async deleteAddress(id, userId) {
    const addr = await Address.findOneAndDelete({ _id: id, user: userId });
    if (!addr) throw new Error("Address not found");
    return true;
  }
}

module.exports = AddressService;

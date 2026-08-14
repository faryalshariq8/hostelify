const Hostel = require("../models/Hostel");
const Room = require("../models/Room");

const updateHostelAvailability = async (hostelId) => {
  const availableRooms = await Room.countDocuments({
    hostel: hostelId,
    isAvailable: true,
  });

  await Hostel.findByIdAndUpdate(hostelId, {
    availableRooms,
  });
};

module.exports = updateHostelAvailability;
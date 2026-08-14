const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

// Models
const User = require("./models/User");
const Hostel = require("./models/Hostel");
const Room = require("./models/Room");
const FeeStructure = require("./models/FeeStructure");
const Announcement = require("./models/Announcement");
const HostelApplication = require("./models/HostelApplication");
const RoomAllocation = require("./models/RoomAllocation");
const Complaint = require("./models/Complaint");
const FeePayment = require("./models/FeePayment");
const LeaveRequest = require("./models/LeaveRequest");
const VisitorRequest = require("./models/VisitorRequest");
const RoomTransferRequest = require("./models/RoomTransferRequest");

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    // 1. Clear database
    await User.deleteMany();
    await Hostel.deleteMany();
    await Room.deleteMany();
    await FeeStructure.deleteMany();
    await Announcement.deleteMany();
    await HostelApplication.deleteMany();
    await RoomAllocation.deleteMany();
    await Complaint.deleteMany();
    await FeePayment.deleteMany();
    await LeaveRequest.deleteMany();
    await VisitorRequest.deleteMany();
    await RoomTransferRequest.deleteMany();

    // 2. Create Admin
    const adminPassword = await bcrypt.hash("123456", 10);
    const admin = await User.create({
      fullName: "Super Admin",
      email: "admin@hostel.com",
      password: adminPassword,
      role: "admin",
    });

    // 3. Create 10 Students
    const studentPassword = await bcrypt.hash("password123", 10);
    const students = [];
    for (let i = 1; i <= 10; i++) {
      students.push({
        fullName: `Student ${i}`,
        email: `student${i}@test.com`,
        password: studentPassword,
        role: "student",
      });
    }
    const createdStudents = await User.insertMany(students);

    // 4. Create 3 Hostels
    const hostelsData = [
      {
        name: "Fatima Jinnah Hostel",
        location: "North Campus",
        description: "Girls Hostel",
        totalRooms: 50,
        availableRooms: 50,
        image: "https://res.cloudinary.com/yamb63ur/image/upload/v1786666219/4ba509777b626626a1f44b1a42df91fd_er5hgm.jpg"
      },

      {
        name: "Iqbal Hostel",
        location: "South Campus",
        description: "Boys Hostel",
        totalRooms: 60,
        availableRooms: 60,
        image: "https://res.cloudinary.com/yamb63ur/image/upload/v1786666219/34c55a67df541090b60cbe83e00cee2e_mhkyis.jpg"
      },

      {
        name: "Jinnah Hostel",
        location: "East Campus",
        description: "Boys Hostel",
        totalRooms: 40,
        availableRooms: 40,
        image: "https://res.cloudinary.com/yamb63ur/image/upload/v1786666219/indian_hostel_room_college_-_Google_Search_xp6s4z.jpg"
      },
    ];
    const createdHostels = await Hostel.insertMany(hostelsData);

    // 5. Create Rooms and Fee Structures
    const roomTypes = ["Single", "Double", "Triple"];
    const fees = [15000, 12000, 10000];
    const createdRooms = [];

    for (let h of createdHostels) {
      for (let i = 1; i <= 3; i++) { // 3 types of rooms per hostel
        const type = roomTypes[i - 1];
        const fee = fees[i - 1];
        
        await FeeStructure.create({
          hostel: h._id,
          roomType: type,
          amount: fee
        });

        // 5 rooms of each type
        for (let j = 1; j <= 5; j++) {
          const roomCapacity = i;
          createdRooms.push({
            hostel: h._id,
            roomNumber: `${h.name.charAt(0)}-${type.charAt(0)}${j}0${j}`,
            capacity: roomCapacity,
            occupied: 0,
            roomType: type,
            fee: fee,
            isAvailable: true
          });
        }
      }
    }
    await Room.insertMany(createdRooms);

    // 6. Announcements
    await Announcement.insertMany([
      { title: "Welcome to New Semester", description: "All classes begin next Monday.", targetAudience: "All", createdBy: admin._id },
      { title: "Hostel Fee Deadline", description: "Please pay your fees by the 15th.", targetAudience: "Students", createdBy: admin._id },
    ]);

    console.log("Data Imported successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Hostel.deleteMany();
    await Room.deleteMany();
    await FeeStructure.deleteMany();
    await Announcement.deleteMany();
    await HostelApplication.deleteMany();
    await RoomAllocation.deleteMany();
    await Complaint.deleteMany();
    await FeePayment.deleteMany();
    await LeaveRequest.deleteMany();
    await VisitorRequest.deleteMany();
    await RoomTransferRequest.deleteMany();

    console.log("Data Destroyed!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB().then(() => {
  if (process.argv[2] === "-d") {
    destroyData();
  } else {
    importData();
  }
});

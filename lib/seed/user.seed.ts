import mongoose from "mongoose";
import * as bcrypt from "bcrypt";
import User from "../models/user.model";

const dbURI: any = process.env.MONGO_URI;

const seedUsers = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log("Connected to MongoDB");

    const hashedPassword = await bcrypt.hash("password123", 10);

    const admin = new User({
      username: "adminUser",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    const teacher = new User({
      username: "teacherUser",
      email: "teacher@example.com",
      password: hashedPassword,
      role: "teacher",
      resetPasswordToken: null,
      resetPasswordExpires: null,
      profile: {
        firstName: "John",
        lastName: "Doe",
        phone: "123-456-7890",
        address: "123 Main St",
        dateOfBirth: new Date("1980-05-15"),
        teacherId: "T001",
        subjects: ["Math", "Science"],
        qualification: "M.Sc. Physics",
      },
    });

    const student = new User({
      username: "studentUser",
      email: "student@example.com",
      password: hashedPassword,
      role: "student",
      resetPasswordToken: null,
      resetPasswordExpires: null,
      profile: {
        firstName: "Jane",
        lastName: "Smith",
        phone: "987-654-3210",
        address: "456 Elm St",
        dateOfBirth: new Date("2005-08-22"),
        studentId: "S001",
        class: "10th Grade",
        section: "A",
        teacherId: "T001", // Reference to the teacher
        subjects: ["Math", "History"],
        qualification: "High School",
      },
    });

    await admin.save();
    console.log("Admin user seeded successfully");

    await teacher.save();
    console.log("Teacher user seeded successfully");

    await student.save();
    console.log("Student user seeded successfully");

    // Close MongoDB connection
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding users:", error);
    mongoose.connection.close();
  }
};

seedUsers();

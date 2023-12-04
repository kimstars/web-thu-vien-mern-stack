import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const router = express.Router();

const tinhTuoi = (ngaySinh) => {
  var today = new Date();
  var birthDate = new Date(ngaySinh);
  var age = today.getFullYear() - birthDate.getFullYear();
  var monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  console.log(birthDate);
  return age;
}


/* User Registration */
router.post("/register", async (req, res) => {
  try {
    /* Salting and Hashing the Password */
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    /* Create a new user */
    const newuser = await new User({
      userType: req.body.userType,
      userFullName: req.body.userFullName,
      age: tinhTuoi(req.body.dob),
      dob: req.body.dob,
      gender: req.body.gender,
      address: req.body.address,
      mobileNumber: req.body.mobileNumber,
      email: req.body.email,
      password: hashedPass,
      isAdmin: req.body.isAdmin,
    });

    console.log("co chau dang ky tai khoan", newuser);


    /* Save User and Return */
    const user = await newuser.save();
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});

/* User Login */
router.post("/signin", async (req, res) => {
  try {
    console.log(req.body, "req");
    const user =  await User.findOne({email: req.body.email});

    console.log("user",user.password);

    !user && res.status(404).json("User not found");

    const validPass = await bcrypt.compare(req.body.password, user.password);
    !validPass && res.status(400).json("Wrong Password");
    console.log(validPass);
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});

export default router;

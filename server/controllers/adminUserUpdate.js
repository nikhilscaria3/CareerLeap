const { User } = require('../models/userModel');

exports.getBrotoUsers = async (req, res) => {
  try {
    const users = await User.find({ status: "BrotoUser" });
    res.status(201).json({ message: 'Users received successfully', data: users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error" });
  }
};

exports.getFumigationUsers = async (req, res) => {
  try {
    const users = await User.find({ status: "Fumigation" });
    res.status(201).json({ message: 'Users received successfully', data: users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error" });
  }
};

exports.updateUserWeek = async (req, res) => {
  const { email, week } = req.body;
  console.log("data", req.body.email);
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.week = week;
    await user.save();

    res.status(201).json({ message: 'Week updated successfully', data: user, updatedWeek: week });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Update Error' });
  }
};

exports.updateUserId = async (req, res) => {
  const { email, userid } = req.body;
  console.log("data", req.body.email);
  try {
    const user = await User.findOne({ email: email })

    user.userid = userid;
    user.status = "BrotoUser";
    await user.save();

    res.status(201).json({ message: 'UserID Updated Successfully', data: user, updateuserid: userid });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Update Error' });
  }
};

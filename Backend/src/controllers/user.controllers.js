import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { meeting } from "../models/meeting.model.js";
import crypto from "crypto";

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Please provide" });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User Not Found." });
    }
    let ispasswordCorrect = await bcrypt.compare(password, user.password);
    if (ispasswordCorrect) {
      let token = crypto.randomBytes(20).toString("hex");
      // let token = "1234"

      user.token = token;
      await user.save();
      return res.status(httpStatus.OK).json({ token: token });
    } else {
      return res.status(httpStatus.UNAUTHORIZED).json({message:"InVaild username or password."})
    }
  } catch (e) {
    res.status(500).json({ message: `Something Went Wrong ${e}` });
  }
};

const register = async (req, res) => {
  const { name, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(httpStatus.FOUND)
        .json({ message: "User Already Found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name,
      username: username,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(httpStatus.CREATED).json({ message: "User Registered" });
  } catch (e) {
    res.status(500).json({ message: `Something Went Wrong ${e}` });
  }
};

const getUserHistory = async (req,res) => {
  const {token} = req.query;  

  try{
    const user = await User.findOne({token:token})
    const mettings = await meeting.find({user_id:user.username})
    res.json(mettings)
console.log(mettings);
  }catch(e){
    res.json({message:`Something Went Wrong ${e}`})
  }
}

const addToHistory = async (req,res) => {
  const {token,meeting_code} = req.body;
  
  try{
    const user = await User.findOne({token:token})

    const newMetting = new meeting({
      user_id: user.username,
      meetingCOde:meeting_code
    })

    await newMetting.save()

    res.status(httpStatus.CREATED).json({message:"Added code to history."})
  } catch (e){
    res.json({message:`Something Went Wrong ${e}`})
  }
}

export {login,register,getUserHistory,addToHistory}

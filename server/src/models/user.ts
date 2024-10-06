import mongoose from "mongoose";

interface User {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const userShema = new mongoose.Schema<User>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
  
  },

},{timestamps: true});

const User= mongoose.model("User", userShema);
export default User
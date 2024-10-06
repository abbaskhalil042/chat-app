import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Extend Express Request to add the custom body typing
interface SignupRequest extends Request {
  body: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
}

export const signup = async (req: SignupRequest, res: Response) => {
  const { name, email, password, confirmPassword } = req.body;

  try {
    // Password validation
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if the user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with hashed password (and remove confirmPassword)
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword, // Store hashed password in the correct field
    });

    // Respond with success message
    return res.status(201).json({
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    // Internal server error handling
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = await jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

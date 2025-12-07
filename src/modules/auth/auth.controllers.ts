import { authService } from "./auth.service.js";
import { Request, Response } from "express";

const signup = async (req: Request, res: Response) => {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: result.rows[0],
    });

    console.log("User registered successfully:", result.rows[0]);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
};

const signin = async (req: Request, res: Response) => {
  try {
    const result = await authService.signin(req.body);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const authControllers = {
  signup,
  signin,
};

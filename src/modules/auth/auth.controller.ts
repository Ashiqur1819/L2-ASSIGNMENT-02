import { Request, Response } from "express";
import { authService } from "./auth.service.js";

// Controller function to handle user signup
const signupUser = async (req: Request, res: Response) => {
  const result = await authService.createUserIntoDB(req.body);

  if (result) {
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } else {
    res.status(500).json({
      message: "Error creating user",
    });
  }
};

// Controller function to handle user login
const loginUser = async (req: Request, res: Response) => {

    const result = await authService.loginUserIntoDB(req.body.email, req.body.password)

    if(result) {
      res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } else {
      res.status(401).json({
        message: "Invalid email or password",
      });
    }
}

export const authControllers = {
  signupUser,
  loginUser
};

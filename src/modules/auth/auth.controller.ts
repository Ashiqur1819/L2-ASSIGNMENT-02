import { Request, Response } from "express";
import { authService } from "./auth.service";

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

export const authControllers = {
  signupUser,
};

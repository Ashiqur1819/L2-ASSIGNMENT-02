import { Request, Response } from "express";
import { issueService } from "./issue.service";

const createIssue = async (req: Request, res: Response) => {
  const result = await issueService.createIssueIntoDB(req.body, req.user?.id);

  if (result) {
    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: { ...result, reporter_id: req.user?.id },
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Failed to create issue",
    });
  }

  return result;
};

const getAllIssues = async (req: Request, res: Response) => {
  const result = await issueService.getAllIssues(req.query);

  try {
    if (result) {
      res.status(200).json({
        success: true,
        message: "Issues retrieved successfully",
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No issues found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }

  return result;
};

export const issueController = {
  createIssue,
  getAllIssues,
};

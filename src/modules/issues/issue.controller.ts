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
};

const getIssueById = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  const result = await issueService.getIssueById(parseInt(id));

  if (result) {
    res.status(200).json({
      success: true,
      message: "Issue retrieved successfully",
      data: {
        id: result.id,
        title: result.title,
        description: result.description,
        type: result.type,
        status: result.status,

        reporter: {
          id: result.reporter_id,
          name: result.reporter_name,
          role: result.reporter_role,
        },

        created_at: result.created_at,
        updated_at: result.updated_at,
      },
    });
  } else {
    res.status(404).json({
      success: false,
      message: "Issue not found",
    });
  }
};

export const issueController = {
  createIssue,
  getAllIssues,
  getIssueById,
};

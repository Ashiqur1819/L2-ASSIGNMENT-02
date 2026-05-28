import { Request, Response } from 'express';
import {issueService} from './issue.service'

const createIssue = async (req: Request, res: Response) => {
    const result = await issueService.createIssueIntoDB(req.body, req.user?.id);

    if(result) {

  

        res.status(201).json({
            success: true,
            message: "Issue created successfully",
            data: { ...result, reporter_id: req.user?.id }
        });
    } else {
        res.status(400).json({
            success: false,
            message: "Failed to create issue"
        });
    }

    return result;
}

export const issueController = {
    createIssue
}
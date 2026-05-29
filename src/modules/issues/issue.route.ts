import { Router } from 'express'
import authMiddleware from '../../middlewares/auth.middleware'
import { issueController } from './issue.controller'

const router = Router()

router.post("/", authMiddleware(), issueController.createIssue)
router.get("/", issueController.getAllIssues)
router.get("/:id", issueController.getIssueById)

export const issueRouter = router
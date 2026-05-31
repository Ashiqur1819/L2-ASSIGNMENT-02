import { Router } from 'express'
import authMiddleware from '../../middlewares/auth.middleware.js'
import { issueController } from './issue.controller.js'

const router = Router()

router.post("/", authMiddleware(), issueController.createIssue)
router.get("/", issueController.getAllIssues)
router.get("/:id", issueController.getIssueById)
router.patch("/:id", authMiddleware(), issueController.updateIssue)
router.delete("/:id", authMiddleware(), issueController.deleteIssue)


export const issueRouter = router
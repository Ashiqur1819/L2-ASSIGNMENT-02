import { Router } from 'express'
import { issueController } from './issue.controller'
import authMiddleware from '../../middlewares/auth.middleware'

const router = Router()

router.post("/", authMiddleware(), issueController.createIssue)

export const issueRouter = router
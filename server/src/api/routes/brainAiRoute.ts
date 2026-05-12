import express from "express";
import { BrainChatController } from "../controllers/brainChatController";
import { authentication } from "../middleware/authMiddleware";
const router = express.Router();

// Public route — no auth required
router.get("/share/:shareToken", BrainChatController.getSharedConversation);

// Apply authentication middleware to all routes below
router.use(authentication);

router.post("/conversation/start", BrainChatController.startConversation);

router.post("/conversation/:conversationId/message", BrainChatController.sendMessage);
router.get("/conversation/:conversationId/message", BrainChatController.sendMessage);

// conversation summary
router.post("/conversation/summary", (_req, res) => {
  res.send("Hello World");
});

// get conversation history
router.get("/conversations", BrainChatController.conversationsList);

// share / unshare conversation
router.post("/conversation/:conversationId/share", BrainChatController.shareConversation);
router.delete("/conversation/:conversationId/share", BrainChatController.unshareConversation);

// delete conversation
router.delete("/conversation/:conversationId", BrainChatController.deleteConversation);

// get conversation
router.get("/conversation/:conversationId", BrainChatController.getConversation);

export default router;

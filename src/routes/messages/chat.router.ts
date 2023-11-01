import { Request, Response, Router } from "express";
import { MessageManager } from "../../dao/messages/MessageManger";

const router = Router();
const messageManager = new MessageManager();

router.get("/", async (req: Request, res: Response) => {
  let data = await messageManager.getMessages();
  
  res.render("chat", { data: data.map((d: any) => d.toJSON()) });
});

export default router;

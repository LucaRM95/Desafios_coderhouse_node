import { MessageModel } from "../../interfaces/MessageModel";
import Message from "../../models/messages/Messages";

export class MessageManager {
  private messages: Array<MessageModel>;

  constructor() {
    this.messages = [{
        user: "",
        message: ""
    }];
  }

  async setMessage(message: MessageModel) {
    await Message.insertMany(message);
  }

  async getMessages() {
    await this.loadMessages();
    if (this.messages.length > 0) {
      return this.messages;
    } else {
      return [];
    }
  }

  private async loadMessages() {
    try {
       this.messages = await Message.find();
    } catch (error) {
      this.messages = [];
      return { message: error };
    }
  }
}

export type TelegramUpdate = {
  update_id: number;
  message: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      last_name: string;
      username: string;
      language_code: string;
    };
    chat: {
      id: number;
      first_name: string;
      last_name: string;
      username: string;
      type: "private" | "group" | "supergroup" | "channel";
    };
    date: number;
    text: string;
  };
};
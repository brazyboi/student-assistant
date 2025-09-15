export interface Profile {
  id: number;
  email: string;
  password: string;
  chats: Chat[];
}

export interface Message { 
  text: string; 
  sender: "user" | "ai";
};

export interface Chat {
  id: number;
  title: string;
  messages: Message[];
}

export interface QueryMode {
  mode: 'question' | 'hint' | 'answer' | 'explanation';
}
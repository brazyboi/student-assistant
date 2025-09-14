export interface Profile {
  id: number;
  name: string;
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
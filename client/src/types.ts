export interface Profile {
  id: number;
  email: string;
}

export interface Message { 
  text: string; 
  sender: "user" | "ai";
};

export interface Chat {
  id: number;
  profile_id: number;
  title: string;
  messages: Message[];
}

export interface QueryMode {
  mode: 'question' | 'hint' | 'answer' | 'explanation';
}
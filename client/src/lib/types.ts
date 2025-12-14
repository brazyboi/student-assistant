export interface Profile {
  id: string;
  email: string;
}

export interface Message { 
  text: string; 
  sender: "user" | "ai";
};

export interface Chat {
  id: number | string;
  profile_id: string;
  title: string;
  messages: Message[];
}

export interface QueryMode {
  mode: 'question' | 'hint' | 'answer' | 'explanation';
}
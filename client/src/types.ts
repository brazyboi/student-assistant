export interface Profile {
  id: number;
  name: string;
  level: "highschool" | "undergrad" | "grad";
  role: "general" | "python_expert" | "math_tutor" | "writing_coach";
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
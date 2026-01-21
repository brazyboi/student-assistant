export interface Profile {
  id: string;
  email: string;
}

export type HintLevel = "none" | "conceptual" | "guiding" | "partial" | "solution";

export interface Message { 
  text: string; 
  sender: "user" | "ai";
};

export interface TutorSessionState {
  currentHintLevel: HintLevel;
  userHasAttempted: boolean;
  studentInput: string;
}

export interface Chat {
  id: number | string;
  profile_id: string;
  title: string;
  messages: Message[];
  tutorState?: TutorSessionState;
}

export interface QueryMode {
  mode: 'question' | 'hint' | 'answer' | 'explanation';
}
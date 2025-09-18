export interface NoteCreate {
  title: string;
  content: string;
}

export interface NoteUpdate {
  id: number;
  title?: string;
  content?: string;
}

export interface NoteResponse {
  id: number;
  user_id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}
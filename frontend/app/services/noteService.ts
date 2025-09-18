import { proxyApiClient } from '@/app/lib/api';
import { NoteCreate, NoteUpdate, NoteResponse } from '@/app/types/note';

export class NoteService {
  async getNotes(): Promise<NoteResponse[]> {
    return proxyApiClient.get<NoteResponse[]>('/note/notes');
  }

  async getNote(id: number): Promise<NoteResponse> {
    return proxyApiClient.get<NoteResponse>(`/note/notes/${id}`);
  }

  async createNote(data: NoteCreate): Promise<NoteResponse> {
    return proxyApiClient.post<NoteResponse>('/note/notes', data);
  }

  async updateNote(id: number, data: Partial<NoteUpdate>): Promise<NoteResponse> {
    return proxyApiClient.put<NoteResponse>(`/note/notes/${id}`, data);
  }

  async deleteNote(id: number): Promise<void> {
    return proxyApiClient.delete<void>(`/note/notes/${id}`);
  }
}

export const noteService = new NoteService();
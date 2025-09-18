import { create } from 'zustand';
import { noteService } from '@/app/services/noteService';
import { NoteCreate, NoteUpdate, NoteResponse } from '@/app/types/note';

interface NoteState {
  notes: Record<number, NoteResponse>;
  currentNote: NoteResponse | null;
  isLoading: boolean;
  error: string | null;

  fetchNotes: () => Promise<void>;
  fetchNote: (id: number) => Promise<void>;
  createNote: (data: NoteCreate) => Promise<NoteResponse>;
  updateNote: (id: number, data: Partial<NoteUpdate>) => Promise<NoteResponse>;
  deleteNote: (id: number) => Promise<void>;
  clearError: () => void;
  clearCurrentNote: () => void;
  getSortedNotes: () => NoteResponse[];
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: {},
  currentNote: null,
  isLoading: false,
  error: null,

  fetchNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const notesArray = await noteService.getNotes();
      const notes = notesArray.reduce((acc, note) => {
        acc[note.id] = note;
        return acc;
      }, {} as Record<number, NoteResponse>);
      set({ notes, isLoading: false });
    } catch (error: any) {
      console.log(error);
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch notes'
      });
      throw error;
    }
  },

  fetchNote: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const note = await noteService.getNote(id);
      set({ currentNote: note, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch note'
      });
      throw error;
    }
  },

  createNote: async (data: NoteCreate) => {
    set({ isLoading: true, error: null });
    try {
      const newNote = await noteService.createNote(data);
      set(state => ({
        notes: { ...state.notes, [newNote.id]: newNote },
        isLoading: false
      }));
      return newNote;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to create note'
      });
      throw error;
    }
  },

  updateNote: async (id: number, data: Partial<NoteUpdate>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedNote = await noteService.updateNote(id, data);
      set(state => ({
        notes: { ...state.notes, [id]: updatedNote },
        currentNote: state.currentNote?.id === id ? updatedNote : state.currentNote,
        isLoading: false
      }));
      return updatedNote;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to update note'
      });
      throw error;
    }
  },

  deleteNote: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await noteService.deleteNote(id);
      set(state => {
        const remainingNotes = { ...state.notes };
        delete remainingNotes[id];
        return {
          notes: remainingNotes,
          currentNote: state.currentNote?.id === id ? null : state.currentNote,
          isLoading: false
        };
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to delete note'
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  clearCurrentNote: () => {
    set({ currentNote: null });
  },

  getSortedNotes: () => {
    const { notes } = get();
    return Object.values(notes).sort((a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  },
}));
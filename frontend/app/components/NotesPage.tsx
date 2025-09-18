'use client';

import { useNavigation } from '@/app/contexts/NavigationContext';
import NotesListView from './NotesListView';
import NotesDetailView from './NotesDetailView';

export default function NotesPage() {
  const { currentParams } = useNavigation();

  const noteId = currentParams?.noteId;

  if (noteId) {
    return <NotesDetailView noteId={noteId} />;
  }

  return <NotesListView />;
}
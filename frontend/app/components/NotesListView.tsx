'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Heading,
  Dialog,
  TextField,
  Card,
} from '@radix-ui/themes';
import { useNoteStore } from '@/app/stores/noteStore';
import { useNavigation } from '@/app/contexts/NavigationContext';
import BaseSidebarView from './BaseSidebarView';

export default function NotesListView() {
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const { isLoading, error, fetchNotes, createNote, clearError, getSortedNotes } = useNoteStore();
  const { navigateToView } = useNavigation();

  const sortedNotes = getSortedNotes();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleCreateNote = async () => {
    if (!newNoteTitle.trim()) return;

    setIsCreating(true);
    try {
      const newNote = await createNote({
        title: newNoteTitle.trim(),
        content: ''
      });

      setIsNewNoteModalOpen(false);
      setNewNoteTitle('');
      navigateToView('notes', { noteId: newNote.id });
    } catch (error) {
      console.error('Failed to create note:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleNoteClick = (noteId: number) => {
    navigateToView('notes', { noteId });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getContentPreview = (content: string) => {
    return content.length > 100 ? content.substring(0, 100) + '...' : content;
  };

  if (error) {
    return (
      <Box p="4">
        <Text color="red">Error: {error}</Text>
        <Button onClick={() => clearError()} mt="2">
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    // <Box p="4" style={{ margin: '0 auto', width: '80%', maxWidth: '800px' }}>
    <BaseSidebarView>
      <Box style={{ width: '100%' }} pt="4">
      <Flex justify="between" direction="row" mb="4" gap="4">
        <Heading size="6">Notes</Heading>
        <Button onClick={() => setIsNewNoteModalOpen(true)}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4V20M20 12H4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          New Note
        </Button>
      </Flex>

      {isLoading && (
        <Text>Loading notes...</Text>
      )}

      {!isLoading && sortedNotes.length === 0 && (
        <Card>
          <Text>No notes yet. Create your first note!</Text>
        </Card>
      )}

      {!isLoading && sortedNotes.length > 0 && (
        <Flex direction="column" gap="3">
          {sortedNotes.map((note) => (
            <Card
              key={note.id}
              style={{ cursor: 'pointer' }}
              onClick={() => handleNoteClick(note.id)}
            >
              <Flex direction="column" gap="2">
                <Flex justify="between" align="center">
                  <Heading size="4">{note.title}</Heading>
                  <Text size="2" color="gray">
                    {formatDate(note.updated_at)}
                  </Text>
                </Flex>
                {note.content && (
                  <Text size="2" color="gray">
                    {getContentPreview(note.content)}
                  </Text>
                )}
              </Flex>
            </Card>
          ))}
        </Flex>
      )}

      <Dialog.Root open={isNewNoteModalOpen} onOpenChange={setIsNewNoteModalOpen}>
        <Dialog.Content style={{ maxWidth: '400px' }}>
          <Dialog.Title>Create New Note</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Enter a title for your new note.
          </Dialog.Description>

          <TextField.Root
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            placeholder="Note title..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleCreateNote();
              }
            }}
          />

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              onClick={handleCreateNote}
              disabled={!newNoteTitle.trim() || isCreating}
            >
              {isCreating ? 'Creating...' : 'Create'}
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
      </Box>
    </BaseSidebarView>
  );
}
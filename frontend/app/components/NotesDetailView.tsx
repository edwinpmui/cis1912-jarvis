'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Heading,
  TextField,
  TextArea,
} from '@radix-ui/themes';
import { useNoteStore } from '@/app/stores/noteStore';
import { useNavigation } from '@/app/contexts/NavigationContext';
import BaseSidebarView from './BaseSidebarView';

interface NotesDetailViewProps {
  noteId: number;
}

export default function NotesDetailView({ noteId }: NotesDetailViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { notes, isLoading, error, fetchNote, updateNote, clearError } = useNoteStore();
  const { navigateToView } = useNavigation();

  const note = notes[noteId];

  useEffect(() => {
    if (!note) {
      fetchNote(noteId);
    }
  }, [noteId, note, fetchNote]);

  useEffect(() => {
    if (note) {
      setEditTitle(note.title);
      setEditContent(note.content);
    }
  }, [note]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editTitle.trim()) return;

    setIsSaving(true);
    try {
      await updateNote(noteId, {
        id: noteId,
        title: editTitle.trim(),
        content: editContent
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (note) {
      setEditTitle(note.title);
      setEditContent(note.content);
    }
    setIsEditing(false);
  };

  const handleBack = () => {
    navigateToView('notes');
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

  if (isLoading) {
    return (
      <Box p="4">
        <Text>Loading note...</Text>
      </Box>
    );
  }

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

  if (!note) {
    return (
      <Box p="4">
        <Text>Note not found</Text>
        <Button onClick={handleBack} mt="2">
          Back to Notes
        </Button>
      </Box>
    );
  }

  return (
    <BaseSidebarView>
    <Box style={{ width: '100%' }} pt="4">
      <Flex justify="between" align="center" mb="4">
        <Button variant="ghost" onClick={handleBack}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 12H5M12 19L5 12L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </Button>

        <Flex gap="2">
          {isEditing ? (
            <>
              <Button variant="soft" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!editTitle.trim() || isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 3A2.828 2.828 0 1 1 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Edit
            </Button>
          )}
        </Flex>
      </Flex>

      <Flex direction="column" gap="4">
        {isEditing ? (
          <TextField.Root
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Note title..."
            size="3"
          />
        ) : (
          <Heading size="7">{note.title}</Heading>
        )}

        <Text size="2" color="gray">
          Last updated: {formatDate(note.updated_at)}
        </Text>

        {isEditing ? (
          <TextArea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Start writing your note..."
            rows={20}
            style={{
              minHeight: '400px',
              fontFamily: 'inherit',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
        ) : (
          <Box
            style={{
              minHeight: '400px',
              padding: '12px',
              border: '1px solid var(--gray-6)',
              borderRadius: '6px',
              backgroundColor: 'var(--gray-1)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}
          >
            {note.content ? (
              <Text>{note.content}</Text>
            ) : (
              <Text color="gray" style={{ fontStyle: 'italic' }}>
                No content yet. Click Edit to add content.
              </Text>
            )}
          </Box>
        )}
      </Flex>
    </Box>
    </BaseSidebarView>
  );
}
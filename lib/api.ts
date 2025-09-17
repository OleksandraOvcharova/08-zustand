import axios from "axios";
import type { Note, NewNoteData } from "@/types/note.ts";

interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

axios.defaults.baseURL = "https://notehub-public.goit.study";

export async function fetchNotes(
  search: string,
  page: number,
  tag: string | undefined
): Promise<NotesHttpResponse> {
  const response = await axios.get<NotesHttpResponse>("/api/notes", {
    params: {
      search,
      page,
      perPage: 9,
      tag,
    },
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });
  return response.data;
}

export async function createNote(newNote: NewNoteData) {
  const response = await axios.post<Note>("/api/notes", newNote, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });

  return response.data;
}

export async function deleteNote(noteId: string) {
  const response = await axios.delete<Note>(`/api/notes/${noteId}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });

  return response.data;
}

export async function fetchNoteById(id: string) {
  const response = await axios.get<Note>(`/api/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
  });
  return response.data;
}

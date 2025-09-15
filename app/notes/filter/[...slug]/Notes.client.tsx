"use client";

import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Loader from "@/components/Loader/Loader";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./page.module.css";

interface NotesClientProps {
  tag: string | undefined;
}

function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [debouncedSearch] = useDebounce(search, 300);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["notes", debouncedSearch, page, tag],
    queryFn: () => fetchNotes(debouncedSearch, page, tag),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const handleSearchUpdate = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  useEffect(() => {
    if (data && data.notes.length === 0) {
      toast("No notes found for your request.");
    }
  }, [data]);

  const totalPages = data?.totalPages ?? 0;

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {<SearchBox search={search} handleSearchUpdate={handleSearchUpdate} />}
        {isSuccess && totalPages > 1 && (
          <Pagination totalPages={totalPages} setPage={setPage} page={page} />
        )}
        {
          <button className={css.button} onClick={() => setShowModal(true)}>
            Create note +
          </button>
        }
      </header>
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
      {showModal && (
        <Modal onClose={handleModalClose}>
          <NoteForm handleFormClose={handleModalClose} />
        </Modal>
      )}
      <Toaster />
    </div>
  );
}

export default NotesClient;

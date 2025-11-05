"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, Star, Clock, Trash2 } from "lucide-react";

interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
  starred: boolean;
}

export default function DashboardPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const stored = localStorage.getItem("notes");
    if (stored) {
      setNotes(JSON.parse(stored));
    }
  }, []);

  const saveNotes = (updated: Note[]) => {
    setNotes(updated);
    localStorage.setItem("notes", JSON.stringify(updated));
  };

  const addNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: "New Note",
      content: "Start writing...",
      date: new Date().toISOString().split("T")[0],
      starred: false,
    };
    const updated = [newNote, ...notes];
    saveNotes(updated);
  };

  const deleteNote = (id: number) => {
    const updated = notes.filter((n) => n.id !== id);
    saveNotes(updated);
  };

  const toggleStar = (id: number) => {
    const updated = notes.map((n) =>
      n.id === id ? { ...n, starred: !n.starred } : n
    );
    saveNotes(updated);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-black text-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Notes</h1>
        <button
          onClick={addNote}
          className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          New
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className="group relative p-4 border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors"
            >
              {/* Clickable main area → open editor */}
              <Link href={`/edit/${note.id}`} className="block">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-white truncate flex-1">
                    {note.title}
                  </h3>
                  <Star
                    size={16}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleStar(note.id);
                    }}
                    className={`ml-6 cursor-pointer ${
                      note.starred
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-yellow-600"
                    }`}
                  />
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="ml-2 text-gray-500 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                  {note.content}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock size={12} className="mr-1" />
                  {note.date}
                </div>
              </Link>

            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-10">No notes yet</p>
        )}
      </div>
    </div>
  );
}


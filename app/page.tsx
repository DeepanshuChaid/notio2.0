"use client";
import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Trash2,
  Edit3,
  Star,
  Clock,
  Menu,
  X,
} from "lucide-react";

export default function NotesDashboard() {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "Meeting Notes",
      content: "Discussed project timeline and deliverables...",
      date: "2025-10-30",
      starred: true,
    },
    {
      id: 2,
      title: "Ideas",
      content: "New feature concepts for the app...",
      date: "2025-10-29",
      starred: false,
    },
    {
      id: 3,
      title: "To Do",
      content: "Complete design mockups, review code...",
      date: "2025-10-28",
      starred: false,
    },
    {
      id: 4,
      title: "Research",
      content: "Looking into new technologies and frameworks...",
      date: "2025-10-27",
      starred: true,
    },
  ]);
  const [selectedNote, setSelectedNote] = useState(notes[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleStar = (id) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, starred: !note.starred } : note,
      ),
    );
    if (selectedNote.id === id) {
      setSelectedNote({ ...selectedNote, starred: !selectedNote.starred });
    }
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    if (selectedNote.id === id && updatedNotes.length > 0) {
      setSelectedNote(updatedNotes[0]);
    }
  };

  const addNote = () => {
    const newNote = {
      id: Date.now(),
      title: "New Note",
      content: "Start writing...",
      date: new Date().toISOString().split("T")[0],
      starred: false,
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
  };

  useEffect(() => {
    const sidebar = document.getElementById("sidebar");
    const resizer = document.getElementById("resizer");
    if (!sidebar || !resizer) return;

    let isResizing = false;

    const startResize = () => {
      isResizing = true;
      document.body.style.cursor = "ew-resize";
    };

    const resize = (e) => {
      if (!isResizing) return;
      const newWidth = Math.min(Math.max(e.pageX, 240), 480);
      sidebar.style.width = newWidth + "px";
    };

    const stopResize = () => {
      isResizing = false;
      document.body.style.cursor = "default";
    };

    resizer.addEventListener("mousedown", startResize);
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResize);

    return () => {
      resizer.removeEventListener("mousedown", startResize);
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResize);
    };
  }, []);

  return (
    <div className="flex h-screen bg-black text-gray-100 overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        id="sidebar"
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:relative z-50 w-80 bg-neutral-900 border-r border-neutral-800 flex flex-col overflow-hidden transition-transform duration-300 ease-in-out h-full`}
      >
        {/* Resizer Handle - Desktop Only */}
        <div
          id="resizer"
          className="hidden lg:block absolute right-0 top-0 h-full w-1 cursor-ew-resize bg-transparent hover:bg-neutral-700/30 z-10"
        ></div>

        {/* Header */}
        <div className="p-6 border-b border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">Notes</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>
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
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => {
                setSelectedNote(note);
                setSidebarOpen(false);
              }}
              className={`p-4 border-b border-neutral-800 cursor-pointer transition-colors ${
                selectedNote.id === note.id
                  ? "bg-neutral-800"
                  : "hover:bg-neutral-800/50"
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-white truncate flex-1">
                  {note.title}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStar(note.id);
                  }}
                  className="ml-2"
                >
                  <Star
                    size={16}
                    className={
                      note.starred
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-yellow-600"
                    }
                  />
                </button>
              </div>
              <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                {note.content}
              </p>
              <div className="flex items-center text-xs text-gray-500">
                <Clock size={12} className="mr-1" />
                {note.date}
              </div>
            </div>
          ))}
        </div>

        {/* Add Note Button */}
        <div className="p-4 border-t border-neutral-800">
          <button
            onClick={addNote}
            className="w-full bg-neutral-800 hover:bg-neutral-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus size={20} />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-neutral-900 border-b border-neutral-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <Menu size={20} className="text-gray-400" />
            </button>
            <button
              onClick={() => toggleStar(selectedNote.id)}
              className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <Star
                size={20}
                className={
                  selectedNote.starred
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-600"
                }
              />
            </button>
            <button className="hidden md:block p-2 hover:bg-neutral-800 rounded-lg transition-colors">
              <Edit3 size={20} className="text-gray-400" />
            </button>
          </div>
          <button
            onClick={() => deleteNote(selectedNote.id)}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-gray-400 hover:text-red-400"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-neutral-950">
          <input
            type="text"
            value={selectedNote.title}
            onChange={(e) => {
              const updated = { ...selectedNote, title: e.target.value };
              setSelectedNote(updated);
              setNotes(notes.map((n) => (n.id === updated.id ? updated : n)));
            }}
            className="w-full text-2xl md:text-4xl font-bold bg-transparent border-none text-white placeholder-gray-600 focus:outline-none mb-4"
            placeholder="Note title"
          />
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Clock size={14} />
            <span>{selectedNote.date}</span>
          </div>
          <textarea
            value={selectedNote.content}
            onChange={(e) => {
              const updated = { ...selectedNote, content: e.target.value };
              setSelectedNote(updated);
              setNotes(notes.map((n) => (n.id === updated.id ? updated : n)));
            }}
            className="w-full min-h-[400px] bg-transparent border-none text-gray-300 text-base md:text-lg leading-relaxed focus:outline-none resize-none"
            placeholder="Start writing..."
          />
        </div>
      </div>
    </div>
  );
}

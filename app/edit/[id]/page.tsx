
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star, Clock, Trash2, ArrowLeft } from "lucide-react";

interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
  starred: boolean;
}

export default function EditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [note, setNote] = useState<Note | null>(null);
  const [allNotes, setAllNotes] = useState<Note[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("notes") || "[]") as Note[];
    setAllNotes(stored);
    const found = stored.find((n) => n.id.toString() === id);
    if (found) setNote(found);
  }, [id]);

  const updateNote = (updated: Note) => {
    setNote(updated);
    const updatedList = allNotes.map((n) =>
      n.id.toString() === id ? updated : n
    );
    setAllNotes(updatedList);
    localStorage.setItem("notes", JSON.stringify(updatedList));
  };

  const deleteNote = () => {
    const updatedList = allNotes.filter((n) => n.id.toString() !== id);
    localStorage.setItem("notes", JSON.stringify(updatedList));
    router.push("/");
  };

  if (!note)
    return (
      <p className="text-center text-gray-400 mt-10">Loading...</p>
    );

  return (
    <div className="flex flex-col h-screen bg-black text-gray-100">
      {/* Header */}
      <div className="bg-neutral-900 border-b border-neutral-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/")}
            className="p-2 hover:bg-neutral-800 rounded-lg"
          >
            <ArrowLeft size={20} className="text-gray-400" />
          </button>
          <button
            onClick={() => updateNote({ ...note, starred: !note.starred })}
            className="p-2 hover:bg-neutral-800 rounded-lg"
          >
            <Star
              size={20}
              className={
                note.starred
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-600"
              }
            />
          </button>
        </div>
        <button
          onClick={deleteNote}
          className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-gray-400 hover:text-red-400"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-neutral-950">
        <input
          type="text"
          value={note.title}
          onChange={(e) => updateNote({ ...note, title: e.target.value })}
          className="w-full text-2xl md:text-4xl font-bold bg-transparent border-none text-white placeholder-gray-600 focus:outline-none mb-4"
          placeholder="Note title"
        />
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Clock size={14} />
          <span>{note.date}</span>
        </div>
        <textarea
          value={note.content}
          onChange={(e) => updateNote({ ...note, content: e.target.value })}
          className="w-full min-h-[400px] bg-transparent border-none text-gray-300 text-base md:text-lg leading-relaxed focus:outline-none resize-none"
          placeholder="Start writing..."
        />
      </div>
    </div>
  );
}

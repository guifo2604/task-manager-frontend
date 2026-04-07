import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Task } from "../types";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => Promise<void>;
  taskToEdit: Task | null;
}

export function CreateTaskModal({ isOpen, onClose, onTaskCreated, taskToEdit }: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [content, setContent] = useState("");
  const [dataFinal, setDataFinal] = useState("");

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(taskToEdit?.title || "");
      setCaption(taskToEdit?.caption || "");
      setContent(taskToEdit?.content || "");
      setDataFinal(taskToEdit?.dataFinal || "");
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const storedUser = JSON.parse(localStorage.getItem("@TaskApp:user") || "{}");
      const payload = {
        title,
        caption,
        content,
        status: taskToEdit ? taskToEdit.status : "ToDo",
        dataInicial: taskToEdit ? taskToEdit.dataInicial : new Date().toISOString().split('T')[0],
        dataFinal
      };

      if (taskToEdit) {
        await api.put(`/tasks/${taskToEdit.id}/user/${storedUser.idUser}`, payload);
      } else {
        await api.post(`/tasks/${storedUser.idUser}`, payload);
      }

      await onTaskCreated();
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Erro ao salvar.");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-70 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl">
        <h2 className="text-xl font-bold mb-4">{taskToEdit ? "Editar Tarefa" : "Nova Tarefa"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título" className="w-full p-2 border rounded-lg outline-none focus:border-black" required />
          <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Resumo" className="w-full p-2 border rounded-lg outline-none focus:border-black" />
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Descrição" className="w-full p-2 border rounded-lg h-24 outline-none focus:border-black" />
          <input type="date" value={dataFinal} onChange={e => setDataFinal(e.target.value)} className="w-full p-2 border rounded-lg outline-none focus:border-black" required />
          <div className="flex gap-2 justify-end mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500">Cancelar</button>
            <button type="submit" className="px-6 py-2 bg-gray-900 text-white rounded-lg font-bold">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
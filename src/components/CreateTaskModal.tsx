import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { taskService } from "../services/taskService";
import type { Task, TaskRequest } from "../types";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => Promise<void>;
  taskToEdit: Task | null;
}

export function CreateTaskModal({ isOpen, onClose, onTaskCreated, taskToEdit }: CreateTaskModalProps) {
  const { user } = useAuth(); 
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [content, setContent] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(taskToEdit?.title || "");
      setCaption(taskToEdit?.caption || "");
      setContent(taskToEdit?.content || "");
      setDataFinal(taskToEdit?.dataFinal || "");
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return; 

    setLoading(true);

    try {
      const payload: TaskRequest = {
        title,
        caption,
        content,
        status: taskToEdit ? taskToEdit.status : "ToDo",
        dataInicial: taskToEdit ? taskToEdit.dataInicial : new Date().toISOString().split('T')[0],
        dataFinal
      };

      if (taskToEdit) {
        await taskService.update(taskToEdit.id, user.idUser, payload);
      } else {
       
        await taskService.create(user.idUser, payload);
      }

      await onTaskCreated(); 
      onClose();             
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
    
      const errorData = error.response?.data;
      
      if (Array.isArray(errorData)) {
        alert(errorData.join("\n")); 
      } else {
        alert("Erro ao guardar tarefa. Verifique os dados.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          {taskToEdit ? "Editar Tarefa" : "Nova Tarefa"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Ex: Estudar Java" 
              className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-gray-900 transition-all" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resumo (opcional)</label>
            <input 
              value={caption} 
              onChange={e => setCaption(e.target.value)} 
              placeholder="Breve descrição" 
              className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-gray-900 transition-all" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo</label>
            <textarea 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              placeholder="Detalhes da tarefa..." 
              className="w-full p-2 border rounded-lg h-28 outline-none focus:ring-2 focus:ring-gray-900 transition-all resize-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Entrega</label>
            <input 
              type="date" 
              value={dataFinal} 
              onChange={e => setDataFinal(e.target.value)} 
              className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-gray-900 transition-all" 
              required 
            />
          </div>

          <div className="flex gap-2 justify-end mt-6">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 text-gray-500 font-medium hover:text-gray-700"
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-gray-900 text-white rounded-lg font-bold hover:bg-black transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "A guardar..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useCallback } from "react";
import { api } from "../services/api";
import type { Task, User } from "../types"; 
import { TaskCard } from "../components/TaskCard"; 
import { CreateTaskModal } from "../components/CreateTaskModal";

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [viewTask, setViewTask] = useState<Task | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      const storedUser = localStorage.getItem("@TaskApp:user");
      if (!storedUser) return;
      const user: User = JSON.parse(storedUser);
      const response = await api.get<Task[]>(`/tasks/user/${user.idUser}`);
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const handleDeleteTask = async (taskId: number) => {
    if (!window.confirm("Deseja excluir?")) return;
    try {
      const storedUser = JSON.parse(localStorage.getItem("@TaskApp:user") || "{}");
      await api.delete(`/tasks/${taskId}/user/${storedUser.idUser}`);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      setViewTask(null);
    } catch (error) { 
      alert("Erro ao excluir"); 
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdateStatus = async (taskId: number, currentStatus: any) => {
    const statusOrder = ["ToDo", "InProgress", "Completed"];
    const nextStatus = statusOrder[(statusOrder.indexOf(currentStatus) + 1) % statusOrder.length];
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (!taskToUpdate) return;

    try {
      const storedUser = JSON.parse(localStorage.getItem("@TaskApp:user") || "{}");
      await api.put(`/tasks/${taskId}/user/${storedUser.idUser}`, {
        ...taskToUpdate,
        status: nextStatus
      });
      // Correção do erro de tipo do print:
      setTasks(prev => prev.map(t => t.id === taskId ? ({ ...t, status: nextStatus } as Task) : t));
    } catch (error) { 
      alert("Erro no status"); 
    }
  };

  if (loading) return <div className="p-8 text-center font-bold">Carregando...</div>;

  return (
    <div className="min-h-screen bg-[#f5f5dd] p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Minhas Tarefas</h1>
          <button 
            onClick={() => { setTaskToEdit(null); setIsModalOpen(true); }}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-black transition-all"
          >
            + Nova Tarefa
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onUpdateStatus={handleUpdateStatus}
              onView={(t) => setViewTask(t)} 
            /> 
          ))}
        </div>
      </div>

      <CreateTaskModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setTaskToEdit(null); }} 
        onTaskCreated={loadTasks} 
        taskToEdit={taskToEdit} 
      />

      {viewTask && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-60 backdrop-blur-sm">
          <div className="bg-[#fffdfa] w-full max-w-lg p-8 rounded-2xl shadow-2xl border-l-10px border-gray-900">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-3xl font-black text-gray-900">{viewTask.title}</h2>
              <button onClick={() => setViewTask(null)} className="text-gray-400 hover:text-black text-xl">✕</button>
            </div>
            <p className="text-gray-500 italic mb-6 border-b pb-4">{viewTask.caption}</p>
            <div className="bg-white/50 p-4 rounded-xl border border-gray-100 mb-8 min-h-100px">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{viewTask.content || "Sem descrição."}</p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex gap-6">
                <button 
                  onClick={() => {
                    const t = viewTask;
                    setViewTask(null);
                    setTaskToEdit(t);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline"
                >
                  ✏️ Editar
                </button>
                <button 
                  onClick={() => handleDeleteTask(viewTask.id)}
                  className="flex items-center gap-2 text-sm font-bold text-red-600 hover:underline"
                >
                  🗑️ Excluir
                </button>
              </div>
              <button onClick={() => setViewTask(null)} className="bg-gray-900 text-white px-6 py-2 rounded-lg font-bold text-sm">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
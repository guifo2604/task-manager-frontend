import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext"; // Usar o contexto
import { taskService } from "../services/taskService"; // Usar o serviço
import type { Task, TaskStatus } from "../types"; 
import { TaskCard } from "../components/TaskCard"; 
import { CreateTaskModal } from "../components/CreateTaskModal";

export function Dashboard() {
  const { user, signOut } = useAuth(); 
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [viewTask, setViewTask] = useState<Task | null>(null);

  const loadTasks = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await taskService.getByUser(user.idUser);
      setTasks(data);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { 
    loadTasks(); 
  }, [loadTasks]);

  const handleDeleteTask = async (taskId: number) => {
    if (!user || !window.confirm("Deseja realmente excluir esta tarefa?")) return;
    try {
      await taskService.delete(taskId, user.idUser);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      setViewTask(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) { 
      alert("Erro ao excluir a tarefa."); 
    }
  };

  const handleUpdateStatus = async (taskId: number, currentStatus: TaskStatus) => {
    if (!user) return;
    const statusOrder: TaskStatus[] = ["ToDo", "InProgress", "Completed"];
    const nextStatus = statusOrder[(statusOrder.indexOf(currentStatus) + 1) % statusOrder.length];
    
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (!taskToUpdate) return;

    try {
      const payload = { ...taskToUpdate, status: nextStatus };
      await taskService.update(taskId, user.idUser, payload);
      
      setTasks(prev => prev.map(t => t.id === taskId ? ({ ...t, status: nextStatus }) : t));
      
      if (viewTask?.id === taskId) setViewTask({ ...viewTask, status: nextStatus });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) { 
      alert("Erro ao atualizar o status."); 
    }
  };

  if (loading) return <div className="p-8 text-center font-bold text-gray-600">Carregando tarefas...</div>;

  return (
    <div className="min-h-screen bg-[#f5f5dd] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Olá, {user?.username}</h1>
            <p className="text-sm text-gray-500">Gerencia as tuas tarefas de hoje.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => { setTaskToEdit(null); setIsModalOpen(true); }}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-black transition-all"
            >
              + Nova Tarefa
            </button>
            <button 
              onClick={signOut}
              className="border border-red-200 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-50 transition-all"
            >
              Sair
            </button>
          </div>
        </header>

        {tasks.length === 0 ? (
          <div className="text-center p-20 bg-white/50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400">Ainda não tens tarefas. Começa por criar uma!</p>
          </div>
        ) : (
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
        )}
      </div>

      <CreateTaskModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setTaskToEdit(null); }} 
        onTaskCreated={loadTasks} 
        taskToEdit={taskToEdit} 
      />

      {viewTask && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
           {/* ... código do teu modal de visualização ... */}
           <div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-2xl">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-black text-gray-900">{viewTask.title}</h2>
                <button onClick={() => setViewTask(null)} className="text-gray-400 hover:text-black">✕</button>
              </div>
              <p className="text-gray-500 italic mb-4">{viewTask.caption}</p>
              <div className="bg-gray-50 p-4 rounded-xl mb-6">
                <p className="text-gray-800 whitespace-pre-wrap">{viewTask.content || "Sem descrição."}</p>
              </div>
              <div className="flex justify-between items-center border-t pt-4">
                <div className="flex gap-4">
                  <button 
                    onClick={() => { const t = viewTask; setViewTask(null); setTaskToEdit(t); setIsModalOpen(true); }}
                    className="text-blue-600 font-bold text-sm hover:underline"
                  >✏️ Editar</button>
                  <button 
                    onClick={() => handleDeleteTask(viewTask.id)}
                    className="text-red-600 font-bold text-sm hover:underline"
                  >🗑️ Excluir</button>
                </div>
                <button onClick={() => setViewTask(null)} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold">Fechar</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
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

  // 1. Função para carregar tarefas (agora fora do useEffect para ser reutilizável)
  const loadTasks = useCallback(async () => {
    try {
      const storedUser = localStorage.getItem("@TaskApp:user");
      if (!storedUser) return;
      const user: User = JSON.parse(storedUser);

      const response = await api.get<Task[]>(`/tasks/user/${user.idUser}`);
      setTasks(response.data);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // 2. Função para abrir o modal de criação (limpa o taskToEdit)
  function handleOpenCreateModal() {
    setTaskToEdit(null);
    setIsModalOpen(true);
  }

  // 3. Função para abrir o modal de edição (seta a task selecionada)
  function handleOpenEditModal(task: Task) {
    setTaskToEdit(task);
    setIsModalOpen(true);
  }

  async function handleDeleteTask(taskId: number) {
    if (!window.confirm("Tem certeza que deseja excluir?")) return;
    try {
      const storedUser = JSON.parse(localStorage.getItem("@TaskApp:user") || "{}");
      await api.delete(`/tasks/${taskId}/user/${storedUser.idUser}`);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Erro ao excluir tarefa");
    }
  }

  async function handleUpdateStatus(taskId: number, currentStatus: string) {
    const statusOrder: ("ToDo" | "InProgress" | "Completed")[] = ["ToDo", "InProgress", "Completed"];
    const currentIndex = statusOrder.indexOf(currentStatus as "ToDo" | "InProgress" | "Completed");
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];

    try {
      const storedUser = JSON.parse(localStorage.getItem("@TaskApp:user") || "{}");
      await api.put(`/tasks/${taskId}/user/${storedUser.idUser}`, {
        status: nextStatus
      });
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: nextStatus } : t));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Erro ao atualizar status");
    }
  }

  if (loading) return <div className="p-8 text-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-[#f5f5dd] p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Minhas Tarefas</h1>
          <button 
            onClick={handleOpenCreateModal} // Chama a função que limpa a edição
            className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-all">
            + Nova Tarefa
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onDelete={handleDeleteTask}
                onUpdateStatus={handleUpdateStatus}
                onEdit={handleOpenEditModal} // Agora passa a função que seta a taskToEdit
              /> 
            ))
          ) : (
            <p className="text-gray-500">Nenhuma tarefa encontrada. Que tal criar uma?</p>
          )}
        </div>
      </div>

      <CreateTaskModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setTaskToEdit(null); // Limpa ao fechar
        }} 
        onTaskCreated={() => loadTasks()} // Atualiza a lista suavemente
        taskToEdit={taskToEdit} // Passa a task para o Modal
      />
    </div>
  );
}
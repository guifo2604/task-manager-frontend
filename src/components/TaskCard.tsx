import type { Task } from "../types";

const statusTranslator = {
  ToDo: { label: "A Fazer", color: "bg-gray-100 text-gray-600 border-gray-200" },
  InProgress: { label: "Em Andamento", color: "bg-blue-100 text-blue-600 border-blue-200" },
  Completed: { label: "Concluída", color: "bg-green-100 text-green-600 border-green-200" },
  Overdue: { label: "Atrasada", color: "bg-red-100 text-red-600 border-red-200" },
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

interface TaskCardProps {
  task: Task;
  onDelete: (id: number) => void;
  onUpdateStatus: (id: number, currentStatus: string) => void;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onDelete, onUpdateStatus, onEdit }: TaskCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg text-gray-800">{task.title}</h3>
        <div className="flex gap-2">
           <button onClick={() => onEdit(task)} className="hover:opacity-70">✏️</button>
           <button onClick={() => onDelete(task.id)} className="hover:opacity-70">🗑️</button>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4">{task.caption}</p>

      <div className="flex justify-between items-center mt-4">
        <div className="flex flex-col text-xs text-gray-400">
          <span>Início: {formatDate(task.dataInicial)}</span>
          <span>Fim: {formatDate(task.dataFinal)}</span>
        </div>

        <button 
          onClick={() => onUpdateStatus(task.id, task.status)}
          className={`text-xs font-bold px-3 py-1 rounded-full border transition-colors ${statusTranslator[task.status as keyof typeof statusTranslator].color}`}
        >
          {statusTranslator[task.status as keyof typeof statusTranslator].label}
        </button>
      </div>
    </div>
  );
}
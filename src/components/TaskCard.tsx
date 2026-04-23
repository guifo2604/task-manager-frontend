import type { Task, TaskStatus } from "../types";

const statusTranslator = {
  ToDo: { label: "A Fazer", color: "bg-gray-100 text-gray-600 border-gray-200" },
  InProgress: { label: "Em Andamento", color: "bg-blue-100 text-blue-600 border-blue-200" },
  Completed: { label: "Concluída", color: "bg-green-100 text-green-600 border-green-200" },
};

// Função para deixar a data no formato brasileiro
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

interface TaskCardProps {
  task: Task;
  onUpdateStatus: (id: number, currentStatus: TaskStatus) => Promise<void>;
  onView: (task: Task) => void;
}

export function TaskCard({ task, onUpdateStatus, onView }: TaskCardProps) {
  return (
    <div 
      onClick={() => onView(task)}
      className="bg-blue-100 p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg text-gray-800 group-hover:text-gray-600 transition-colors">
          {task.title}
        </h3>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onUpdateStatus(task.id, task.status);
          }}
          className={`text-[10px] font-bold px-2 py-1 rounded-full border transition-all ${statusTranslator[task.status as keyof typeof statusTranslator]?.color || "bg-gray-100"}`}
        >
          {statusTranslator[task.status as keyof typeof statusTranslator]?.label || task.status}
        </button>
      </div>

      <p className="text-gray-600 text-sm line-clamp-2 mb-4">{task.caption}</p>
      
      {/* SEÇÃO DE DATAS DE VOLTA AQUI */}
      <div className="flex justify-between items-center mt-4 border-t border-gray-50 pt-4">
        <div className="flex flex-col text-[10px] text-gray-400 font-bold uppercase tracking-tight">
          <span>Início: {formatDate(task.dataInicial)}</span>
          <span>Prazo: {formatDate(task.dataFinal)}</span>
        </div>
        <span className="text-[10px] text-gray-300 font-bold group-hover:text-gray-900 transition-colors">
          GERENCIAR →
        </span>
      </div>
    </div>
  );
}
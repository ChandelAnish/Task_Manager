import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit2, CheckCircle } from 'lucide-react';
import { SerializedTask } from '@/lib/actions';

interface TaskCardProps {
  task: SerializedTask;
  onEdit: (task: SerializedTask) => void;
  handleDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, handleDelete }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20';
      case 'medium': return 'bg-yellow-500/20';
      case 'low': return 'bg-green-500/20';
      default: return 'bg-gray-500/20';
    }
  };

  // const handleDelete = async () => {
  //     const result = await deleteTask(task.id as string);
  //     if (!result.success) {
  //       alert(result.error);
  //     }
  // };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`
        bg-gray-800 border border-cyan-500/30 rounded-lg p-4 mb-4 
        text-white shadow-lg relative overflow-hidden
        ${getPriorityColor(task.priority)}
      `}
    >
      <div className="flex justify-between items-start">
        <div className="flex-grow pr-4">
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-semibold text-cyan-500 mr-2">{task.title}</h3>
            {task.status === 'completed' && (
              <CheckCircle className="text-green-500" size={18} />
            )}
          </div>
          {task.description && (
            <p className="text-gray-300 text-sm mb-2">{task.description}</p>
          )}
          <div className="flex flex-wrap gap-2 mb-2">
            {task.tags?.map((tag, index) => (
              <span 
                key={index} 
                className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="text-sm text-gray-400">
            {task.dueDate && (
              <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
            )}
            <p className="capitalize">Priority: {task.priority}</p>
            <p className="capitalize">Status: {task.status.replace('-', ' ')}</p>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(task)}
            className="text-cyan-500 hover:text-cyan-400"
          >
            <Edit2 size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={()=>(handleDelete(task.id))}
            className="text-red-500 hover:text-red-400"
          >
            <Trash2 size={20} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
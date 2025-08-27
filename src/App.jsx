import { useState, useEffect } from "react";
import { Plus, Trash2, Edit3, Check, X, Calendar } from "lucide-react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: ""
  });

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("taskManagerTasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("taskManagerTasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.title.trim()) return;

    const task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      status: "todo",
      priority: newTask.priority,
      dueDate: newTask.dueDate || undefined,
      createdAt: new Date().toISOString()
    };

    setTasks([...tasks, task]);
    setNewTask({ title: "", description: "", priority: "medium", dueDate: "" });
    setIsAddingTask(false);
  };

  const updateTaskStatus = (id, status) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "badge-high";
      case "medium": return "badge-medium";
      case "low": return "badge-low";
      default: return "badge-medium";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "todo": return "📋";
      case "progress": return "⚡";
      case "done": return "✅";
      default: return "📋";
    }
  };

  const tasksByStatus = {
    todo: tasks.filter(task => task.status === "todo"),
    progress: tasks.filter(task => task.status === "progress"),
    done: tasks.filter(task => task.status === "done")
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="card">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Task Manager Pro</h1>
              <p className="text-gray-600 mt-2">
                Organize your work with drag-and-drop task management
              </p>
            </div>
            <button 
              onClick={() => setIsAddingTask(true)}
              className="btn btn-primary flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Add Task Form */}
      {isAddingTask && (
        <div className="card mb-8">
          <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Task title"
              className="input w-full"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <textarea
              placeholder="Task description (optional)"
              className="input w-full min-h-[80px]"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select
                  className="input w-full"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Due Date (optional)</label>
                <input
                  type="date"
                  className="input w-full"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={addTask} disabled={!newTask.title.trim()} className="btn btn-primary flex items-center">
                <Check className="mr-2 h-4 w-4" />
                Add Task
              </button>
              <button onClick={() => setIsAddingTask(false)} className="btn btn-secondary flex items-center">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Columns */}
      <div className="grid md:grid-cols-3 gap-6">
        {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
          <div key={status}>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">{getStatusIcon(status)}</span>
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-2 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                {statusTasks.length}
              </span>
            </h2>
            
            <div className="space-y-4">
              {statusTasks.map((task) => (
                <div key={task.id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900">
                      {task.title}
                    </h3>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditingTask(task.id)}
                        className="p-1 text-gray-500 hover:text-gray-700"
                      >
                        <Edit3 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-gray-600 mb-3">
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className={getPriorityColor(task.priority)}>
                      {task.priority} priority
                    </span>
                    
                    {task.dueDate && (
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    {status !== "todo" && (
                      <button
                        className="btn btn-secondary text-sm"
                        onClick={() => updateTaskStatus(task.id, 
                          status === "progress" ? "todo" : "progress"
                        )}
                      >
                        ← {status === "progress" ? "Todo" : "Progress"}
                      </button>
                    )}
                    {status !== "done" && (
                      <button
                        className="btn btn-secondary text-sm"
                        onClick={() => updateTaskStatus(task.id, 
                          status === "todo" ? "progress" : "done"
                        )}
                      >
                        {status === "todo" ? "Start" : "Complete"} →
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {statusTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">{getStatusIcon(status)}</div>
                  <p>No {status} tasks</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="card mt-8">
        <h3 className="text-lg font-semibold mb-4">Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{tasksByStatus.done.length}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">{tasksByStatus.progress.length}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-600">{
              tasks.length > 0 ? Math.round((tasksByStatus.done.length / tasks.length) * 100) : 0
            }%</div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
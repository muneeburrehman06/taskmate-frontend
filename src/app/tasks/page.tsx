'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface Task {
  id: number;
  title: string;
  description: string | null;
  is_completed: boolean;
}

export default function TasksPage() {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // create task
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // edit task
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  /* ================= LOGOUT ================= */
  const logout = async () => {
    try {
      await api('/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}

    localStorage.removeItem('token');
    router.push('/login');
  };

  /* ================= FETCH TASKS ================= */
  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    api('/tasks', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setTasks(res.tasks ?? []))
      .catch(() => setError('Failed to load tasks'))
      .finally(() => setLoading(false));
  }, []);

  /* ================= ADD TASK ================= */
  const addTask = async () => {
    if (!title.trim()) return setError('Title is required');

    try {
      const res = await api('/tasks', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, description }),
      });

      setTasks(prev => [...prev, res.task]);
      setTitle('');
      setDescription('');
      setError('');
    } catch {
      setError('Failed to add task');
    }
  };

  /* ================= EDIT TASK ================= */
  const startEdit = (task: Task) => {
    setEditId(task.id);
    setEditTitle(task.title || '');
    setEditDescription(task.description || '');
  };

  const updateTask = async () => {
    if (!editId) return;

    try {
      const res = await api(`/tasks/${editId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      });

      setTasks(prev =>
        prev.map(t => (t.id === editId ? res.task : t))
      );

      setEditId(null);
      setEditTitle('');
      setEditDescription('');
    } catch {
      setError('Failed to update task');
    }
  };

  /* ================= DELETE ================= */
  const deleteTask = async (id: number) => {
    if (!confirm('Delete this task?')) return;

    try {
      await api(`/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks(prev => prev.filter(t => t.id !== id));
    } catch {
      setError('Failed to delete task');
    }
  };

  if (loading) return <p className="p-4">Loading tasks...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/* ===== DASHBOARD HEADER ===== */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#FF2D20]">
          TaskMate Dashboard
        </h1>

        <div className="space-x-3">
          <button
            onClick={() => router.push('/profile')}
            className="border border-[#FF2D20] text-[#FF2D20] px-4 py-2 rounded hover:bg-[#FF2D20] hover:text-white transition"
          >
            Update Profile
          </button>

          <button
            onClick={logout}
            className="bg-[#FF2D20] text-white px-4 py-2 rounded hover:opacity-90"
          >
            Logout
          </button>
        </div>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* ===== ADD TASK ===== */}
      <div className="bg-white p-4 shadow rounded mb-6">
        <input
          className="border p-2 w-full mb-2"
          placeholder="Task title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="Task description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button
          onClick={addTask}
          className="bg-[#FF2D20] text-white px-4 py-2 rounded"
        >
          Add Task
        </button>
      </div>

      {/* ===== TASK TABLE ===== */}
      <div className="bg-white shadow rounded">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map(task => (
              <tr key={task.id} className="border-t">
                <td className="p-3">
                  {editId === task.id ? (
                    <input
                      className="border p-1 w-full"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                    />
                  ) : (
                    task.title
                  )}
                </td>

                <td className="p-3">
                  {editId === task.id ? (
                    <input
                      className="border p-1 w-full"
                      value={editDescription}
                      onChange={e => setEditDescription(e.target.value)}
                    />
                  ) : (
                    task.description || '—'
                  )}
                </td>

                <td className="p-3 space-x-2">
                  {editId === task.id ? (
                    <>
                      <button
                        onClick={updateTask}
                        className="text-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="text-gray-600"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(task)}
                        className="text-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
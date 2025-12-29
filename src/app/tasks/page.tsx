'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface Task {
  id: number;
  title: string;
  description?: string;
  is_completed: boolean;
}

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Get token from localStorage safely (client-side)
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.push('/login');
      return;
    }
    setToken(storedToken);

    // Fetch tasks
    api('/tasks', {
      method: 'GET',
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then(res => setTasks(Array.isArray(res.tasks) ? res.tasks : []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const addTask = async () => {
    if (!title || !token) return alert('Title is required');

    const newTask = await api('/tasks', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, description }),
    });

    setTasks(prev => [...prev, newTask]);
    setTitle('');
    setDescription('');
  };

  const toggleComplete = async (task: Task) => {
    if (!token) return;
    const updated = await api(`/tasks/${task.id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ is_completed: !task.is_completed }),
    });

    setTasks(prev => prev.map(t => (t.id === task.id ? updated : t)));
  };

  const deleteTask = async (task: Task) => {
    if (!token) return;
    await api(`/tasks/${task.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    setTasks(prev => prev.filter(t => t.id !== task.id));
  };

  const logout = async () => {
    if (!token) return;
    try {
      await api('/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error('Logout error:', err);
    }

    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) return <p>Loading tasks...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My Tasks</h1>
        <button onClick={logout}>Logout</button>
      </div>

      {/* Add Task Form */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Task Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <p>No tasks yet</p>
      ) : (
        <ul>
          {tasks.map(task => (
            <li key={task.id} style={{ marginBottom: '10px' }}>
              <input
                type="checkbox"
                checked={task.is_completed}
                onChange={() => toggleComplete(task)}
              />
              <strong>{task.title}</strong> - {task.description || 'No description'}
              <button onClick={() => deleteTask(task)} style={{ marginLeft: '10px' }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

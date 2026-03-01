import React, { useState } from 'react';
import { Plus, Trash2, ExternalLink, Clock, AlertCircle } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

const TaskTable = ({ tasks, subjects, onSaveTask, onDeleteTask }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subject_id: subjects[0]?.id || '',
    deadline: '',
    duration_minutes: 60,
    priority: 2,
    task_type: 'Assignment',
    description: ''
  });

  const getUrgencyClass = (deadline, priority) => {
    const hoursLeft = (new Date(deadline) - new Date()) / (1000 * 60 * 60);
    if (hoursLeft < 24 || priority === 3) return 'urgency-high';
    if (hoursLeft < 72 || priority === 2) return 'urgency-medium';
    return 'urgency-low';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveTask({ ...formData, id: editingId });
    setShowAdd(false);
    setEditingId(null);
    setFormData({
        title: '',
        subject_id: subjects[0]?.id || '',
        deadline: '',
        duration_minutes: 60,
        priority: 2,
        task_type: 'Assignment',
        description: ''
    });
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setFormData({
        title: task.title,
        subject_id: task.subject_id,
        deadline: task.deadline.slice(0, 16), // Format for datetime-local
        duration_minutes: task.duration_minutes || (task.estimated_hours * 60),
        priority: task.priority,
        task_type: task.task_type,
        description: task.description || ''
    });
    setShowAdd(true);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Tasks & Deadlines</h2>
        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
          <Plus size={18} /> {showAdd ? 'Cancel' : 'Add Task'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <input type="text" placeholder="Task Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="btn-ghost" style={{ padding: '10px' }} />
          <select value={formData.subject_id} onChange={e => setFormData({...formData, subject_id: e.target.value})} className="btn-ghost" style={{ padding: '10px' }}>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <input type="datetime-local" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} required className="btn-ghost" style={{ padding: '10px' }} />
          <select value={formData.task_type} onChange={e => setFormData({...formData, task_type: e.target.value})} className="btn-ghost" style={{ padding: '10px' }}>
            {['Assignment', 'Quiz', 'Project', 'Midterm', 'Final'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input type="number" placeholder="Duration (min)" value={formData.duration_minutes} onChange={e => setFormData({...formData, duration_minutes: e.target.value})} className="btn-ghost" style={{ padding: '10px' }} />
          <select value={formData.priority} onChange={e => setFormData({...formData, priority: parseInt(e.target.value)})} className="btn-ghost" style={{ padding: '10px' }}>
            <option value="1">Low Priority</option>
            <option value="2">Medium Priority</option>
            <option value="3">High Priority</option>
          </select>
          <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="btn-ghost" style={{ padding: '10px', gridColumn: 'span 3', minHeight: '80px' }} />
          <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 3' }}>Save Task</button>
        </form>
      )}

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div className="task-row" style={{ fontWeight: 'bold', borderBottom: '2px solid var(--border)', background: 'rgba(255,255,255,0.03)' }}>
          <div></div>
          <div>Task Name</div>
          <div>Subject</div>
          <div>Deadline</div>
          <div>Duration</div>
          <div>Actions</div>
        </div>
        {tasks.map(task => (
          <div key={task.id} className="task-row">
            <div className={`urgency-indicator ${getUrgencyClass(task.deadline, task.priority)}`}></div>
            <div style={{ fontWeight: '500' }}>{task.title} <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>({task.task_type})</span></div>
            <div style={{ color: 'var(--text-muted)' }}>{subjects.find(s => s.id === task.subject_id)?.name || 'Unknown'}</div>
            <div style={{ fontSize: '0.85rem' }}><Clock size={14} style={{ marginRight: '4px' }} /> {new Date(task.deadline).toLocaleString()}</div>
            <div style={{ color: 'var(--primary)' }}>{task.duration_minutes || (task.estimated_hours * 60)} min</div>
            <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-ghost" style={{ padding: '4px' }} onClick={() => handleEdit(task)}>Edit</button>
                <button className="btn-ghost" style={{ padding: '4px', color: 'var(--urgent)' }} onClick={() => onDeleteTask(task.id)}><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskTable;

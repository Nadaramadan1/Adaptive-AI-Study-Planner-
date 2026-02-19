import React, { useState, useEffect } from 'react';
import './styles/index.css';
import { Calendar, PlusCircle, AlertCircle, BookOpen, Clock } from 'lucide-react';
import ScheduleGrid from './components/ScheduleGrid';
import ClassModal from './components/ClassModal';

const API_BASE = "http://127.0.0.1:8000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classSchedules, setClassSchedules] = useState([]);
  const [plan, setPlan] = useState([]);
  const [stress, setStress] = useState("Checking...");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Smart Task Adder State
  const [taskForm, setTaskForm] = useState({
    title: '',
    type: 'Assignment',
    date: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const planRes = await fetch(`${API_BASE}/plan/`);
      if (planRes.ok) {
        const planData = await planRes.json();
        setPlan(planData);
        if (planData.length > 0) setStress(planData[0].stress_level);
        else setStress("Light");
      }

      const tasksRes = await fetch(`${API_BASE}/tasks/`);
      if (tasksRes.ok) setTasks(await tasksRes.json());

      const subjectsRes = await fetch(`${API_BASE}/subjects/`);
      if (subjectsRes.ok) setSubjects(await subjectsRes.json());

      const classRes = await fetch(`${API_BASE}/class-schedule/`);
      if (classRes.ok) setClassSchedules(await classRes.json());
    } catch (e) {
      console.error("Link to backend failed", e);
    }
  };

  const handleAddTask = async (e) => {
    if (e) e.preventDefault();
    if (!taskForm.title || !taskForm.date) return;

    let subId = subjects[0]?.id;
    if (!subId) {
      const subRes = await fetch(`${API_BASE}/subjects/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: "General Study", difficulty: 5 })
      });
      if (subRes.ok) {
        const sub = await subRes.json();
        subId = sub.id;
      }
    }

    try {
      const res = await fetch(`${API_BASE}/tasks/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: taskForm.title,
          subject_id: subId,
          deadline: new Date(taskForm.date).toISOString(),
          estimated_hours: taskForm.type === 'Assignment' ? 3.0 : 5.0,
          priority: 1,
          task_type: taskForm.type
        })
      });

      if (res.ok) {
        setTaskForm({ title: '', type: 'Assignment', date: '' });
        fetchData();
      }
    } catch (e) {
      console.error("Add task failed", e);
    }
  };

  const handleSlotClick = (dayIdx, slotIdx) => {
    const existing = classSchedules.find(c => c.day === dayIdx && c.slot_index === slotIdx);
    setSelectedSlot({ day: dayIdx, slot_index: slotIdx, ...existing });
    setModalOpen(true);
  };

  const handleSaveClass = async (formData) => {
    try {
      if (selectedSlot?.id) {
        await fetch(`${API_BASE}/class-schedule/${selectedSlot.id}`, { method: 'DELETE' });
      }

      const res = await fetch(`${API_BASE}/class-schedule/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, day: selectedSlot.day, slot_index: selectedSlot.slot_index })
      });

      if (res.ok) {
        setModalOpen(false);
        fetchData();
      }
    } catch (e) {
      console.error("Save failed", e);
    }
  };

  const handleDeleteClass = async (id) => {
    try {
      await fetch(`${API_BASE}/class-schedule/${id}`, { method: 'DELETE' });
      setModalOpen(false);
      fetchData();
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  const handleUploadSchedule = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/upload-schedule/`, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        alert(`AI successfully imported ${data.count} classes! 📸✅`);
        fetchData();
      } else {
        const err = await res.json();
        alert(`Upload failed: ${err.detail || 'Unknown error'}`);
      }
    } catch (e) {
      console.error("Upload failed", e);
      alert("Could not connect to the AI service. Please check your internet or restart the backend.");
    }
  };

  return (
    <div className="app-container" style={{ padding: '20px 40px', maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(135deg, white, var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Adaptive Study Planner
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>AI-driven academic workload management</p>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div className={`stress-badge stress-${stress.toLowerCase().replace(' ', '-')}`}>
            {stress} Stress
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {/* University Schedule Grid Section */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Clock size={24} color="var(--primary)" /> University Schedule
          </h2>
          <ScheduleGrid
            classSchedules={classSchedules}
            onSlotClick={handleSlotClick}
            onUpload={handleUploadSchedule}
          />
        </div>

        <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
          {/* Sidebar */}
          <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <PlusCircle size={20} color="var(--primary)" /> Smart Task Adder
              </h3>

              <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: '0' }}>
                  <input
                    type="text"
                    placeholder="Task Title (e.g. Lab Report)"
                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: 'var(--border)', borderRadius: '8px', color: 'white' }}
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '0' }}>
                  <select
                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: 'var(--border)', borderRadius: '8px', color: 'white' }}
                    value={taskForm.type}
                    onChange={(e) => setTaskForm({ ...taskForm, type: e.target.value })}
                  >
                    <option value="Assignment">Assignment</option>
                    <option value="Quiz">Quiz</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '0' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    {taskForm.type === 'Assignment' ? "Deadline *" : "When will it be held? *"}
                  </label>
                  <input
                    type="datetime-local"
                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: 'var(--border)', borderRadius: '8px', color: 'white' }}
                    value={taskForm.date}
                    onChange={(e) => setTaskForm({ ...taskForm, date: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '5px' }}>
                  Add {taskForm.type}
                </button>
              </form>
            </div>

            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={20} color="var(--warning)" /> Weekly Load
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <strong>{classSchedules.filter(c => c.slot_type === 'Lecture').length * 1.5}h</strong> Lectures (L)
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <strong>{classSchedules.filter(c => c.slot_type === 'Section').length * 1.5}h</strong> Sections (S)
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px', borderTop: 'rgba(255,255,255,0.05) solid 1px', paddingTop: '8px' }}>
                  AI is redistributing <strong>{tasks.length}</strong> tasks around <strong>{classSchedules.length}</strong> classes.
                </p>
              </div>
            </div>
          </div>

          {/* Study Plan */}
          <div className="main-content">
            <div className="glass-card" style={{ padding: '24px', minHeight: '500px' }}>
              <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <BookOpen size={24} color="var(--primary)" /> Adaptive Study Sessions
              </h2>

              <div className="calendar-view" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                  <div key={day} style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '15px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{day}</div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', minHeight: '350px', padding: '8px', border: 'var(--border)' }}>
                      {plan.filter(p => p.day === idx).map(session => (
                        <div key={session.task_id} style={{ background: 'var(--surface)', padding: '10px', borderRadius: '8px', marginBottom: '8px', fontSize: '0.75rem', borderLeft: '3px solid var(--primary)', textAlign: 'left' }}>
                          <strong>{session.task_title}</strong>
                          <div style={{ marginTop: '4px', color: 'var(--primary)' }}>{session.hours}h</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ClassModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveClass}
        onDelete={handleDeleteClass}
        initialData={selectedSlot}
      />
    </div>
  );
}

export default App;

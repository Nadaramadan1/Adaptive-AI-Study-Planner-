import React, { useState, useEffect } from 'react';
import './styles/index.css';
import { 
  Calendar, PlusCircle, AlertCircle, BookOpen, Clock, 
  Settings, Zap, Moon, Sun, Coffee, Layout, ListChecks, 
  Link2, Trophy, BrainCircuit, Maximize2, Minimize2
} from 'lucide-react';
import ScheduleGrid from './components/ScheduleGrid';
import ClassModal from './components/ClassModal';
import TaskTable from './components/TaskTable';
import ResourceTable from './components/ResourceTable';
import PomodoroTimer from './components/PomodoroTimer';
import { storage } from './utils/storage';

const API_BASE = "http://127.0.0.1:8000";

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [tasks, setTasks] = useState(() => storage.getTasks());
  const [subjects, setSubjects] = useState(() => storage.getSubjects());
  const [resources, setResources] = useState(() => storage.getResources());
  const [classSchedules, setClassSchedules] = useState(() => storage.getClassSchedules());
  const [plan, setPlan] = useState(() => storage.get('study_hub_plan', []));
  const [stats, setStats] = useState(() => storage.getStats());
  const [moods, setMoods] = useState(() => storage.getMoods());
  const [stress, setStress] = useState("Light");
  const [theme, setTheme] = useState(() => storage.getTheme());
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    // Sync to storage on every state change
    storage.setTasks(tasks);
    storage.setSubjects(subjects);
    storage.setResources(resources);
    storage.setClassSchedules(classSchedules);
    storage.setStats(stats);
    storage.setMoods(moods);
    storage.setTheme(theme);
    
    // Set theme on body
    document.documentElement.setAttribute('data-theme', theme);
    console.log(`[Theme] Switched to ${theme}`);
  }, [tasks, subjects, resources, classSchedules, stats, moods, theme]);

  useEffect(() => {
    fetchData(); // Initial sync with backend if online
  }, []);

  const fetchData = async () => {
    try {
      const urls = [
        `${API_BASE}/plan/`,
        `${API_BASE}/tasks/`,
        `${API_BASE}/subjects/`,
        `${API_BASE}/class-schedule/`,
        `${API_BASE}/stats/`,
        `${API_BASE}/mood/`,
        `${API_BASE}/resources/`
      ];
      
      const responses = await Promise.all(urls.map(url => fetch(url)));
      const [planData, tasksData, subjectsData, classData, statsData, moodData, resData] = await Promise.all(
        responses.map(res => res.ok ? res.json() : [])
      );

      if (planData.length > 0) {
          setPlan(planData);
          setStress(planData[0].stress_level);
          storage.set('study_hub_plan', planData);
      }
      if (tasksData.length > 0) setTasks(tasksData);
      if (subjectsData.length > 0) setSubjects(subjectsData);
      if (classData.length > 0) setClassSchedules(classData);
      if (statsData.points !== undefined) setStats(statsData);
      if (moodData.length > 0) setMoods(moodData);
      if (resData.length > 0) setResources(resData);
      
    } catch (e) {
      console.error("Link to backend failed, using local data", e);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => {
        if (prev === 'dark') return 'light';
        if (prev === 'light') return 'eye-comfort';
        return 'dark';
    });
  };

  const handleSlotClick = (dayIdx, slotIdx) => {
    console.log(`[Click] Schedule slot: Day ${dayIdx}, Slot ${slotIdx}`);
    const existing = classSchedules.find(c => c.day === dayIdx && c.slot_index === slotIdx);
    setSelectedSlot({ day: dayIdx, slot_index: slotIdx, ...existing });
    setModalOpen(true);
  };

  const handleSaveClass = (formData) => {
    console.log(`[Save] Class:`, formData);
    const newClass = { ...formData, day: selectedSlot.day, slot_index: selectedSlot.slot_index, id: selectedSlot.id || Date.now() };
    
    setClassSchedules(prev => {
        const filtered = prev.filter(c => !(c.day === selectedSlot.day && c.slot_index === selectedSlot.slot_index));
        return [...filtered, newClass];
    });
    setModalOpen(false);
    
    // Optional: Sync to backend in background
    fetch(`${API_BASE}/class-schedule/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClass)
    }).catch(e => console.warn("Backend sync failed, staying local", e));
  };

  const handleDeleteClass = (id) => {
    console.log(`[Delete] Class ID: ${id}`);
    setClassSchedules(prev => prev.filter(c => c.id !== id));
    setModalOpen(false);
    
    fetch(`${API_BASE}/class-schedule/${id}`, { method: 'DELETE' })
        .catch(e => console.warn("Backend sync failed, staying local", e));
  };

  const handleAddTask = (taskData) => {
    console.log(`[Task] Adding/Updating:`, taskData);
    setTasks(prev => {
        const newTask = { ...taskData, id: taskData.id || Date.now() };
        const filtered = prev.filter(t => t.id !== newTask.id);
        return [...filtered, newTask];
    });
    fetch(`${API_BASE}/tasks/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
    }).catch(e => console.warn("Backend sync failed", e));
  };

  const handleDeleteTask = (id) => {
    console.log(`[Task] Deleting: ${id}`);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleAddResource = (resData) => {
    console.log(`[Resource] Adding/Updating:`, resData);
    setResources(prev => {
        const newRes = { ...resData, id: resData.id || Date.now() };
        const filtered = prev.filter(r => r.id !== newRes.id);
        return [...filtered, newRes];
    });
    fetch(`${API_BASE}/resources/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resData)
    }).catch(e => console.warn("Backend sync failed", e));
  };

  const handleDeleteResource = (id) => {
    console.log(`[Resource] Deleting: ${id}`);
    setResources(prev => prev.filter(r => r.id !== id));
  };

  const handleDragStart = (e, session) => {
    e.dataTransfer.setData('session', JSON.stringify(session));
    console.log(`[Drag] Starting:`, session.task_title);
  };

  const handleDrop = (e, dayIdx) => {
    e.preventDefault();
    const sessionData = JSON.parse(e.dataTransfer.getData('session'));
    console.log(`[Drop] Session ${sessionData.task_title} to Day ${dayIdx}`);
    
    setPlan(prev => {
        const updated = prev.map(s => {
            if (s.task_id === sessionData.task_id) {
                return { ...s, day: dayIdx };
            }
            return s;
        });
        storage.set('study_hub_plan', updated);
        return updated;
    });
  };

  if (isFocusMode) {
    return (
      <div className="focus-overlay">
        <button className="btn btn-ghost" onClick={() => { console.log("[UI] Focus Mode: false"); setIsFocusMode(false); }} style={{ position: 'absolute', top: '20px', right: '20px' }}>
          <Minimize2 size={20} /> Exit Focus
        </button>
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '2rem' }}>Focus Session</h2>
            <PomodoroTimer />
        </div>
      </div>
    );
  }

  return (
    <div className={`dashboard-container animate-fade-in`}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '900', color: 'var(--primary)', letterSpacing: '-0.02em' }}>
            Study Hub <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: '400' }}>/ AI Planner</span>
          </h1>
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <div className="stat-pill"><Zap size={14} color="var(--primary)" /> {stats.points} pts</div>
            <div className="stat-pill"><Trophy size={14} color="var(--secondary)" /> {stats.streak} day streak</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button className="btn btn-ghost" onClick={() => { console.log("[UI] Focus Mode: true"); setIsFocusMode(true); }}>
            <Maximize2 size={18} /> Focus Mode
          </button>
          <button className="btn btn-ghost" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={18} /> : theme === 'light' ? <Moon size={18} /> : <Coffee size={18} />}
          </button>
          <div className={`stress-badge stress-${stress.toLowerCase().replace(' ', '-')}`}>
            {stress} Stress
          </div>
        </div>
      </header>

      <nav style={{ display: 'flex', gap: '8px', marginBottom: '2rem', background: 'var(--surface)', padding: '6px', borderRadius: '14px', width: 'fit-content' }}>
        {[
          { id: 'overview', icon: Layout, label: 'Overview' },
          { id: 'schedule', icon: Calendar, label: 'Class Schedule' },
          { id: 'tasks', icon: ListChecks, label: 'Tasks' },
          { id: 'planner', icon: BookOpen, label: 'Study Planner' },
          { id: 'resources', icon: Link2, label: 'Resources' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-ghost'}`}
            style={{ border: 'none' }}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </nav>

      <div className="grid-layout" style={{ gridTemplateColumns: activeTab === 'overview' ? '2fr 1fr' : '1fr' }}>
        <main>
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Zap size={24} color="var(--primary)" /> Today's Focus
                </h2>
                {plan.filter(p => p.day === (new Date().getDay() + 1) % 7).length > 0 ? (
                  plan.filter(p => p.day === (new Date().getDay() + 1) % 7).map(session => (
                    <div key={session.task_id} className="task-row glass-card" style={{ marginBottom: '10px', padding: '15px' }}>
                      <div className="urgency-indicator urgency-high"></div>
                      <div>
                        <strong style={{ fontSize: '1.1rem' }}>{session.task_title}</strong>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{session.pomodoro_cycles} Pomodoro cycles • {session.hours} hrs</div>
                      </div>
                      <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{session.suggested_break_activity}</div>
                      <button className="btn btn-primary" style={{ padding: '6px 12px' }}>Start Session</button>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>No study sessions scheduled for today. Enjoy your free time! ☕</p>
                )}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ marginBottom: '1rem' }}><AlertCircle size={18} color="var(--urgent)" /> Urgent Deadlines</h3>
                  {tasks.filter(t => !t.is_completed).slice(0, 3).map(task => (
                    <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                      <span>{task.title}</span>
                      <span style={{ color: 'var(--urgent)', fontSize: '0.8rem' }}>{new Date(task.deadline).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ marginBottom: '1rem' }}><BrainCircuit size={18} color="var(--accent)" /> AI Suggestions</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Based on your progress, I suggest starting with <strong>{tasks[0]?.title || 'General Study'}</strong>. It has a high difficulty but you're on a streak!
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="glass-card" style={{ padding: '2rem' }}>
              <ScheduleGrid classSchedules={classSchedules} onSlotClick={handleSlotClick} />
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="glass-card" style={{ padding: '2rem' }}>
              <TaskTable tasks={tasks} subjects={subjects} onSaveTask={handleAddTask} onDeleteTask={handleDeleteTask} />
            </div>
          )}

          {activeTab === 'planner' && (
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h2 style={{ marginBottom: '2rem' }}>Weekly Study Pipeline</h2>
              <div className="calendar-view" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px' }}>
                {['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, idx) => (
                  <div 
                    key={day}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, idx)}
                  >
                    <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-muted)' }}>{day}</div>
                    <div style={{ 
                        background: 'rgba(255,255,255,0.02)', 
                        borderRadius: '15px', 
                        minHeight: '400px', 
                        padding: '10px', 
                        border: '1px solid var(--border)',
                        transition: 'background 0.2s'
                    }}>
                      {plan.filter(p => p.day === idx).map(session => (
                        <div 
                            key={session.task_id} 
                            draggable
                            onDragStart={(e) => handleDragStart(e, session)}
                            className="glass-card study-session-card" 
                            style={{ 
                                padding: '10px', 
                                marginBottom: '10px', 
                                fontSize: '0.8rem', 
                                borderLeft: '3px solid var(--primary)',
                                cursor: 'grab'
                            }}
                        >
                          <strong>{session.task_title}</strong>
                          <div style={{ marginTop: '5px', color: 'var(--primary)' }}>{session.hours}h</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>{session.pomodoro_cycles} cycles</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="glass-card" style={{ padding: '2rem' }}>
              <ResourceTable subjects={subjects} resources={resources} onSaveResource={handleAddResource} onDeleteResource={handleDeleteResource} />
            </div>
          )}
        </main>

        {activeTab === 'overview' && (
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-card pomodoro-wrap">
              <PomodoroTimer />
            </div>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}><Coffee size={18} color="var(--secondary)" /> Daily Reflection</h3>
              <textarea 
                placeholder="How are you feeling today?" 
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: 'var(--border)', borderRadius: '10px', padding: '10px', color: 'white', height: '80px', marginBottom: '10px' }}
              />
              <div style={{ display: 'flex', gap: '5px' }}>
                {['😊', '😐', '😫', '😴'].map(emo => (
                  <button key={emo} className="btn btn-ghost" style={{ padding: '8px' }}>{emo}</button>
                ))}
              </div>
            </div>
          </aside>
        )}
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

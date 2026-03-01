// Utility for localStorage persistence

const KEYS = {
    TASKS: 'study_hub_tasks',
    SUBJECTS: 'study_hub_subjects',
    RESOURCES: 'study_hub_resources',
    CLASS_SCHEDULES: 'study_hub_class_schedules',
    STATS: 'study_hub_stats',
    MOODS: 'study_hub_moods',
    THEME: 'study_hub_theme',
    POMODORO: 'study_hub_pomodoro',
    POMODORO_DURATION: 'study_hub_pomodoro_dur'
};

export const storage = {
    get: (key, defaultValue = []) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error(`Error reading ${key} from storage`, e);
            return defaultValue;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error(`Error saving ${key} to storage`, e);
        }
    },
    // Specialized helpers
    getTasks: () => storage.get(KEYS.TASKS, []),
    setTasks: (tasks) => storage.set(KEYS.TASKS, tasks),
    
    getSubjects: () => storage.get(KEYS.SUBJECTS, []),
    setSubjects: (subjects) => storage.set(KEYS.SUBJECTS, subjects),
    
    getResources: () => storage.get(KEYS.RESOURCES, []),
    setResources: (resources) => storage.set(KEYS.RESOURCES, resources),
    
    getClassSchedules: () => storage.get(KEYS.CLASS_SCHEDULES, []),
    setClassSchedules: (schedules) => storage.set(KEYS.CLASS_SCHEDULES, schedules),
    
    getStats: () => storage.get(KEYS.STATS, { points: 0, streak: 0, total_sessions: 0 }),
    setStats: (stats) => storage.set(KEYS.STATS, stats),
    
    getMoods: () => storage.get(KEYS.MOODS, []),
    setMoods: (moods) => storage.set(KEYS.MOODS, moods),
    
    getTheme: () => localStorage.getItem(KEYS.THEME) || 'dark',
    setTheme: (theme) => localStorage.setItem(KEYS.THEME, theme),

    getPomodoro: () => storage.get(KEYS.POMODORO, null),
    setPomodoro: (state) => storage.set(KEYS.POMODORO, state),
    
    getPomodoroDuration: () => storage.get(KEYS.POMODORO_DURATION, { focus: 25, break: 5 }),
    setPomodoroDuration: (dur) => storage.set(KEYS.POMODORO_DURATION, dur),

    KEYS
};

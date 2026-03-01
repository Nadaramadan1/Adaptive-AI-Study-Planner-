import React, { useRef } from 'react';
import { Upload, Link2, MapPin, Plus } from 'lucide-react';

const TIME_SLOTS = [
  "8:00 – 9:30",
  "9:30 – 11:00",
  "11:15 – 12:45",
  "12:45 – 2:15",
  "2:30 – 4:00",
  "4:15 – 5:45"
];

const DAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const ScheduleGrid = ({ classSchedules, onSlotClick, onUpload }) => {
  const fileInputRef = useRef(null);

  const getSlotContent = (dayIdx, slotIdx) => {
    return classSchedules.find(cls => cls.day === dayIdx && cls.slot_index === slotIdx);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-muted)' }}>Weekly Class Schedule</h3>
        <button className="btn btn-ghost" onClick={() => fileInputRef.current.click()}>
          <Upload size={16} /> Image OCR
        </button>
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={(e) => onUpload(e.target.files[0])} />
      </div>

      <div className="schedule-table-wrap">
        <table className="schedule-grid">
          <thead>
            <tr>
              <th style={{ width: '100px' }}>Slot</th>
              {DAYS.map(day => <th key={day}>{day}</th>)}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((time, sIdx) => (
              <tr key={time}>
                <td style={{ background: 'rgba(255,255,255,0.03)', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                  {time}
                </td>
                {DAYS.map((day, dIdx) => {
                  const content = getSlotContent(dIdx, sIdx);
                  return (
                    <td 
                        key={day} 
                        onClick={() => onSlotClick(dIdx, sIdx)}
                        className="schedule-cell"
                        style={{ position: 'relative', cursor: 'pointer' }}
                    >
                      {content ? (
                        <div className={`class-slot ${content.slot_type?.toLowerCase()}`}>
                          <div style={{ wordBreak: 'break-word' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{content.subject_name}</div>
                            <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '2px' }}>
                                {content.slot_type === 'Lecture' ? content.professor : content.teaching_assistant || content.section_group_code}
                            </div>
                          </div>
                          <div style={{ fontSize: '0.7rem', fontWeight: 'bold', marginTop: '4px', opacity: 0.9 }}>
                            {content.room}
                          </div>
                        </div>
                      ) : (
                        <div className="empty-cell-plus" style={{ display: 'flex', justifyContent: 'center', opacity: 0.3 }}>
                             <Plus size={20} />
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleGrid;

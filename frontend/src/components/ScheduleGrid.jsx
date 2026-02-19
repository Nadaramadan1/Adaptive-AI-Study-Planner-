import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

const TIME_SLOTS = [
    "8:00 – 9:30",
    "9:30 – 11:00",
    "11:15 – 12:45",
    "12:45 – 2:15",
    "2:30 – 4:00",
    "4:15 – 5:45",
    "6:00 – 7:30"
];

const DAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

const ScheduleGrid = ({ classSchedules, onSlotClick, onUpload }) => {
    const fileInputRef = useRef(null);

    const getSlotContent = (dayIdx, slotIdx) => {
        return classSchedules.find(cls => cls.day === dayIdx && cls.slot_index === slotIdx);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onUpload(file);
            e.target.value = ''; // Clear for next upload
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-muted)' }}>Weekly Classes</h3>
                <button
                    className="btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    onClick={() => fileInputRef.current.click()}
                >
                    <Upload size={14} /> Import from Photo
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                />
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table className="schedule-grid">
                    <thead>
                        <tr>
                            <th>Day</th>
                            {TIME_SLOTS.map((slot, i) => <th key={i}>{slot}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {DAYS.map((day, dIdx) => (
                            <tr key={day}>
                                <td style={{ fontWeight: 'bold', background: 'rgba(255,255,255,0.05)', cursor: 'default' }}>{day}</td>
                                {TIME_SLOTS.map((_, sIdx) => {
                                    const content = getSlotContent(dIdx, sIdx);
                                    return (
                                        <td
                                            key={sIdx}
                                            onClick={() => onSlotClick(dIdx, sIdx)}
                                            className={content ? `slot-occupied theme-${content.slot_type?.toLowerCase() || 'lecture'}` : ''}
                                        >
                                            {content ? (
                                                <>
                                                    <div className={`type-badge badge-${content.slot_type === 'Section' ? 's' : 'l'}`}>
                                                        {content.slot_type === 'Section' ? 'S' : 'L'}
                                                    </div>
                                                    <strong style={{ display: 'block' }}>{content.subject_name}</strong>

                                                    {content.slot_type === 'Section' && content.section_group_code && (
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 'bold', marginTop: '2px' }}>
                                                            Group: {content.section_group_code}
                                                        </div>
                                                    )}

                                                    {content.room && <small style={{ display: 'block' }}>Hall: {content.room}</small>}

                                                    {content.slot_type === 'Lecture' && content.professor && (
                                                        <small style={{ display: 'block', opacity: 0.6 }}>Inst: {content.professor}</small>
                                                    )}

                                                    {content.slot_type === 'Section' && content.teaching_assistant && (
                                                        <small style={{ display: 'block', opacity: 0.6 }}>TA: {content.teaching_assistant}</small>
                                                    )}
                                                </>
                                            ) : ''}
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

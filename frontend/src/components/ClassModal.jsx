import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';

const ClassModal = ({ isOpen, onClose, onSave, onDelete, initialData }) => {
    const [formData, setFormData] = useState({
        subject_name: '',
        slot_type: 'Lecture',
        room: '',
        professor: '',
        section_group_code: '',
        teaching_assistant: '',
        color: '#4f46e5'
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                subject_name: initialData.subject_name || '',
                slot_type: initialData.slot_type || 'Lecture',
                room: initialData.room || '',
                professor: initialData.professor || '',
                section_group_code: initialData.section_group_code || '',
                teaching_assistant: initialData.teaching_assistant || '',
                color: initialData.color || '#4f46e5'
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="glass-card modal-content animate-fade-in" style={{ width: '450px', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0 }}>{initialData?.id ? 'Edit Class' : 'Add Class'}</h3>
                    <button className="btn btn-ghost" onClick={onClose} style={{ padding: '6px' }}><X size={20} /></button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Subject Name *</label>
                        <input
                            className="btn-ghost"
                            style={{ width: '100%', padding: '12px' }}
                            value={formData.subject_name}
                            onChange={e => setFormData({ ...formData, subject_name: e.target.value })}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Type</label>
                            <select className="btn-ghost" style={{ width: '100%', padding: '12px' }} value={formData.slot_type} onChange={e => setFormData({ ...formData, slot_type: e.target.value })}>
                                <option value="Lecture">Lecture</option>
                                <option value="Section">Section</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Room / Hall</label>
                            <input className="btn-ghost" style={{ width: '100%', padding: '12px' }} value={formData.room} onChange={e => setFormData({ ...formData, room: e.target.value })} placeholder="e.g. Hall A1" />
                        </div>
                    </div>

                    {formData.slot_type === 'Lecture' ? (
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Instructor (Optional)</label>
                            <input className="btn-ghost" style={{ width: '100%', padding: '12px' }} value={formData.professor} onChange={e => setFormData({ ...formData, professor: e.target.value })} placeholder="Dr. Smith" />
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Section Number</label>
                                <input className="btn-ghost" style={{ width: '100%', padding: '12px' }} value={formData.section_group_code} onChange={e => setFormData({ ...formData, section_group_code: e.target.value })} placeholder="e.g. 101" />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>TA Name</label>
                                <input className="btn-ghost" style={{ width: '100%', padding: '12px' }} value={formData.teaching_assistant} onChange={e => setFormData({ ...formData, teaching_assistant: e.target.value })} placeholder="John Doe" />
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Session</button>
                        {initialData?.id && (
                            <button type="button" className="btn btn-ghost" onClick={() => onDelete(initialData.id)} style={{ color: 'var(--urgent)' }}>
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClassModal;

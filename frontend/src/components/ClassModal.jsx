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
        } else {
            setFormData({
                subject_name: '',
                slot_type: 'Lecture',
                room: '',
                professor: '',
                section_group_code: '',
                teaching_assistant: '',
                color: '#4f46e5'
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="glass-card modal-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3>{initialData?.id ? 'Edit Class' : 'Add Class'}</h3>
                    <X onClick={onClose} style={{ cursor: 'pointer' }} />
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Subject Name *</label>
                        <input
                            placeholder="Example: Data Structures"
                            value={formData.subject_name}
                            onChange={e => setFormData({ ...formData, subject_name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Slot Type *</label>
                        <select
                            value={formData.slot_type}
                            onChange={e => setFormData({ ...formData, slot_type: e.target.value })}
                            required
                        >
                            <option value="Lecture">Lecture</option>
                            <option value="Section">Section</option>
                        </select>
                    </div>

                    {formData.slot_type === 'Lecture' ? (
                        <>
                            <div className="form-group">
                                <label>Hall Number (Optional)</label>
                                <input
                                    placeholder="Example: Hall 4"
                                    value={formData.room}
                                    onChange={e => setFormData({ ...formData, room: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Instructor (Optional)</label>
                                <input
                                    placeholder="Example: Dr. Ahmed"
                                    value={formData.professor}
                                    onChange={e => setFormData({ ...formData, professor: e.target.value })}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="form-group">
                                <label>Hall Number *</label>
                                <input
                                    placeholder="Example: Lab 201"
                                    value={formData.room}
                                    onChange={e => setFormData({ ...formData, room: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Section Group Code *</label>
                                <input
                                    placeholder="Example: S21"
                                    value={formData.section_group_code}
                                    onChange={e => setFormData({ ...formData, section_group_code: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Teaching Assistant (Optional)</label>
                                <input
                                    placeholder="Example: Eng. Nada"
                                    value={formData.teaching_assistant}
                                    onChange={e => setFormData({ ...formData, teaching_assistant: e.target.value })}
                                />
                            </div>
                        </>
                    )}

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save</button>
                        {initialData?.id && (
                            <button
                                type="button"
                                onClick={() => onDelete(initialData.id)}
                                style={{ background: 'var(--danger)', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Trash2 size={20} />
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClassModal;

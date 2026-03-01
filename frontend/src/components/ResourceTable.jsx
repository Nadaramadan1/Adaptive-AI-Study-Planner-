import React, { useState } from 'react';
import { Plus, Link2, ExternalLink, Book, Youtube, HardDrive, Trash2 } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000";

const ResourceTable = ({ subjects, resources, onSaveResource, onDeleteResource }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    subject_id: subjects && subjects.length > 0 ? subjects[0].id : '',
    title: '',
    link: '',
    resource_type: 'Google Drive',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveResource({ ...formData, id: editingId });
    setShowAdd(false);
    setEditingId(null);
    setFormData({
        subject_id: subjects && subjects.length > 0 ? subjects[0].id : '',
        title: '',
        link: '',
        resource_type: 'Google Drive',
        notes: ''
    });
  };

  const handleEdit = (res) => {
    setEditingId(res.id);
    setFormData({
        subject_id: res.subject_id,
        title: res.title,
        link: res.link,
        resource_type: res.resource_type,
        notes: res.notes || ''
    });
    setShowAdd(true);
  };

  const getIcon = (type) => {
    if (type === 'YouTube') return <Youtube size={16} color="#ef4444" />;
    if (type === 'Google Drive') return <HardDrive size={16} color="#818cf8" />;
    return <Book size={16} color="#2dd4bf" />;
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Resource Vault</h2>
        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
          <Plus size={18} /> {showAdd ? 'Cancel' : 'Add Resource'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <select value={formData.subject_id} onChange={e => setFormData({...formData, subject_id: e.target.value})} className="btn-ghost" style={{ padding: '10px' }}>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <input type="text" placeholder="Resource Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="btn-ghost" style={{ padding: '10px' }} />
          <input type="url" placeholder="URL (YouTube, Drive, etc.)" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} required className="btn-ghost" style={{ padding: '10px' }} />
          <select value={formData.resource_type} onChange={e => setFormData({...formData, resource_type: e.target.value})} className="btn-ghost" style={{ padding: '10px' }}>
            {['Google Drive', 'YouTube', 'Notes'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input type="text" placeholder="Additional Notes" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="btn-ghost" style={{ padding: '10px', gridColumn: 'span 2' }} />
          <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 3' }}>Save Resource</button>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {resources && resources.map(res => (
          <div key={res.id} className="glass-card resource-card" style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px', minWidth: '40px', display: 'flex', justifyContent: 'center' }}>
              {getIcon(res.resource_type)}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {subjects.find(s => s.id === res.subject_id)?.name || 'General'}
              </div>
              <div style={{ fontWeight: '700', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{res.title}</div>
              {res.notes && <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '2px' }}>{res.notes}</div>}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
                <a href={res.link} target="_blank" rel="noreferrer" className="btn-ghost" style={{ padding: '8px', borderRadius: '8px' }} title="Open Resource">
                    <ExternalLink size={16} />
                </a>
                <button className="btn-ghost" style={{ padding: '8px', borderRadius: '8px', fontSize: '0.75rem' }} onClick={() => handleEdit(res)}>Edit</button>
                <button className="btn-ghost" style={{ padding: '8px', borderRadius: '8px', color: 'var(--urgent)' }} onClick={() => onDeleteResource(res.id)}>
                    <Trash2 size={16} />
                </button>
            </div>
          </div>
        ))}
        {(!resources || resources.length === 0) && (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', gridColumn: 'span 3', padding: '2rem' }}>
                No resources saved yet. Keep collecting knowledge! 📚
            </div>
        )}
      </div>
    </div>
  );
};

export default ResourceTable;

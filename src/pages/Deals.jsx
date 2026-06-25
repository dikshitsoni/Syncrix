import React, { useState } from 'react';
import { useSyncrix } from '../context/SyncrixContext';
import { 
  Briefcase, 
  Plus, 
  Edit, 
  Trash2, 
  DollarSign, 
  Calendar, 
  ArrowRight, 
  X, 
  AlertCircle,
  HelpCircle,
  ChevronsUpDown,
  Move
} from 'lucide-react';

const PIPELINE_STAGES = [
  { key: 'New Lead', name: 'New Lead', color: 'border-blue-400 bg-blue-50/10 text-blue-800' },
  { key: 'Proposal Sent', name: 'Proposal Sent', color: 'border-yellow-400 bg-yellow-50/10 text-yellow-800' },
  { key: 'Negotiating', name: 'Negotiating', color: 'border-purple-400 bg-purple-50/10 text-purple-800' },
  { key: 'Won', name: 'Won', color: 'border-emerald-400 bg-emerald-50/10 text-emerald-800' },
  { key: 'Lost', name: 'Lost', color: 'border-red-400 bg-red-50/10 text-red-800' }
];

export default function Deals() {
  const { deals, contacts, addDeal, editDeal, deleteDeal, updateDealStage } = useSyncrix();

  // Search/Filters
  const [dealQuery, setDealQuery] = useState('');

  // Drag and Drop active feedback state
  const [draggedOverStage, setDraggedOverStage] = useState(null);

  // Modal actions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [editId, setEditId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form inputs
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [value, setValue] = useState('');
  const [expectedCloseDate, setExpectedCloseDate] = useState('');
  const [stage, setStage] = useState('New Lead');
  const [formError, setFormError] = useState('');

  // Handle Drag Events
  const handleDragStart = (e, dealId) => {
    e.dataTransfer.setData('text/plain', dealId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, stageKey) => {
    e.preventDefault();
    if (draggedOverStage !== stageKey) {
      setDraggedOverStage(stageKey);
    }
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    setDraggedOverStage(null);
    const dealId = e.dataTransfer.getData('text/plain');
    if (dealId) {
      updateDealStage(dealId, targetStage);
    }
  };

  const handleDragLeave = (e) => {
    if (e.clientX === 0 && e.clientY === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX >= rect.right ||
      e.clientY < rect.top ||
      e.clientY >= rect.bottom
    ) {
      setDraggedOverStage(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedOverStage(null);
  };

  // Open modals
  const openAddModal = (initialStage = 'New Lead') => {
    setModalMode('add');
    setTitle('');
    setClientName(contacts[0]?.name || ''); // Default to first contact if exists
    setValue('');
    setExpectedCloseDate(new Date().toISOString().split('T')[0]); // Today
    setStage(initialStage);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (deal) => {
    setModalMode('edit');
    setEditId(deal.id);
    setTitle(deal.title);
    setClientName(deal.clientName);
    setValue(deal.value.toString());
    setExpectedCloseDate(deal.expectedCloseDate);
    setStage(deal.stage);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!title || !clientName || !value || !expectedCloseDate) {
      setFormError('Please fill out all required attributes.');
      return;
    }

    const dealData = { title, clientName, value, expectedCloseDate, stage };

    if (modalMode === 'add') {
      addDeal(dealData);
    } else {
      editDeal(editId, dealData);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    setDeleteConfirmId(id);
  };

  // Filter deals
  const filteredDeals = deals.filter(deal => 
    deal.title.toLowerCase().includes(dealQuery.toLowerCase()) ||
    deal.clientName.toLowerCase().includes(dealQuery.toLowerCase())
  );

  return (
    <div id="deals-page" className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header element */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-accent-dark tracking-tight">
            Deals Pipeline
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Drag and drop deals across stages or add new proposals here
          </p>
        </div>
        <div>
          <button
            id="add-deal-header-btn"
            onClick={() => openAddModal('New Lead')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-[#20512f] active:scale-95 shadow-md shadow-primary/10 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Create Deal Card</span>
          </button>
        </div>
      </div>

      {/* Query Search */}
      <div className="bg-white p-5 shadow-panel flex flex-col sm:flex-row gap-3 items-center transition-all duration-300" style={{ borderRadius: '24px' }}>
        <div className="relative w-full sm:max-w-md">
          <input
            id="deal-search"
            type="text"
            placeholder="Search deals by project title or client..."
            value={dealQuery}
            onChange={(e) => setDealQuery(e.target.value)}
            className="block w-full pl-4 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all placeholder-gray-400"
          />
        </div>
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
          💡 Drag cards to move stages, or click edit to update.
        </p>

      </div>

      {/* Kanban Board Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4 no-scrollbar">
        {PIPELINE_STAGES.map((col) => {
          const colDeals = filteredDeals.filter(d => d.stage === col.key);
          const totalVal = colDeals.reduce((sum, d) => sum + d.value, 0);
          const isOver = draggedOverStage === col.key;

          return (
            <div
              id={`kanban-column-${col.key.toLowerCase().replace(' ', '-')}`}
              key={col.key}
              onDragOver={(e) => handleDragOver(e, col.key)}
              onDrop={(e) => handleDrop(e, col.key)}
              onDragLeave={handleDragLeave}
              className={`flex flex-col transition-all duration-200 min-h-[500px] shrink-0 w-full sm:w-auto bg-white shadow-panel border-2 ${
                isOver
                  ? 'border-primary/30 bg-[#CFFFDC]/20' 
                  : 'border-transparent'}`}
              style={{ borderRadius: '24px' }}
            >
              {/* Column Header */}
              <div className={`p-4 border-b border-[#2E6F40]/10 flex items-center justify-between ${col.color}`} style={{ borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}>
                <div>
                  <h3 className="font-display text-sm font-extrabold tracking-tight uppercase">{col.name}</h3>
                  <p className="text-[10px] font-bold opacity-80 mt-0.5">
                    {colDeals.length} Deal{colDeals.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black">${totalVal.toLocaleString()}</span>
                </div>
              </div>

              {/* Column Body Container */}
              <div className="p-3 flex-1 space-y-3 overflow-y-auto max-h-[550px] scrollbar-none">
                {colDeals.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl">
                    <p className="text-[11px] font-bold">No deals here</p>
                    <button
                      onClick={() => openAddModal(col.key)}
                      className="mt-2 text-[10px] font-semibold text-primary hover:underline"
                    >
                      + Create One
                    </button>
                  </div>
                ) : (
                  colDeals.map((deal) => (
                    <div
                      id={`deal-card-${deal.id}`}
                      key={deal.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal.id)}
                      onDragEnd={handleDragEnd}
                      className={`deal-card bg-white border-b p-4 shadow-stat cursor-grab active:cursor-grabbing hover:shadow-md group relative transition-all duration-200 hover:-translate-y-0.5 ${col.color}`}
                      style={{ borderRadius: '16px' }}
                    >
                      {/* Controls on Hover */}
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          id={`edit-deal-${deal.id}`}
                          onClick={() => openEditModal(deal)}
                          className="p-1 rounded bg-gray-50 text-gray-600 hover:text-primary hover:bg-primary-light transition-colors"
                        >
                          <Edit size={12} />
                        </button>
                        <button
                          id={`delete-deal-${deal.id}`}
                          onClick={() => handleDelete(deal.id)}
                          className="p-1 rounded bg-gray-50 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      <div className="space-y-2">
                        {/* Title and Client */}
                        <div>
                          <h4 className="text-xs font-bold text-accent-dark tracking-tight leading-snug pr-8 truncate">
                            {deal.title}
                          </h4>
                          <span className="text-[10px] text-gray-400 font-semibold">
                            {deal.clientName}
                          </span>
                        </div>

                        {/* Value and Expected Date badge */}
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs font-extrabold text-primary">
                            ${deal.value.toLocaleString()}
                          </span>
                          
                          <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold bg-gray-50 px-1.5 py-0.5 rounded">
                            <Calendar size={10} />
                            <span>{deal.expectedCloseDate}</span>
                          </div>
                        </div>

                        {/* Dropdown helper for mobile / quick navigation */}
                        <div className="pt-2 border-t border-gray-50 flex items-center justify-between md:hidden">
                          <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Move:</span>
                          <select
                            value={deal.stage}
                            onChange={(e) => updateDealStage(deal.id, e.target.value)}
                            className="text-[10px] font-bold p-0.5 bg-gray-50 border border-gray-100 rounded focus:outline-none"
                          >
                            {PIPELINE_STAGES.map(s => (
                              <option key={s.key} value={s.key}>{s.name}</option>
                            ))}
                          </select>
                        </div>

                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Creation / Edit Deals Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#253D2C]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-display font-bold text-lg text-accent-dark">
                {modalMode === 'add' ? 'Create Deal Stage Card' : 'Modify Pipeline Deal'}
              </h3>
              <button 
                id="close-deal-modal"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-65/50 hover:bg-gray-50 transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {formError && (
                <div id="deal-form-error" className="bg-red-50 border border-red-100 text-red-700 text-xs p-3 rounded-lg flex items-center gap-2">
                  <AlertCircle size={15} />
                  <span>{formError}</span>
                </div>
              )}

              {/* Deal Title */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Deal Workspace Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="deal-title-field"
                  type="text"
                  required
                  placeholder="e.g. Website Redesign"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* Assigned Client Dropdown/Text input */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Assigned Contact <span className="text-red-500">*</span>
                </label>
                {contacts.length === 0 ? (
                  <input
                    id="deal-client-field-text"
                    type="text"
                    required
                    placeholder="Type client name..."
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                ) : (
                  <select
                    id="deal-client-field-select"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all cursor-pointer font-medium text-accent-dark"
                  >
                    <option value="" disabled>Select a workspace contact</option>
                    {contacts.map(c => (
                      <option key={c.id} value={c.name}>{c.name} ({c.company})</option>
                    ))}
                    <option value="New Client Generic">Manual Generic Guest</option>
                  </select>
                )}
              </div>

              {/* Value and Expected Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Deal Value ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="deal-value-field"
                    type="number"
                    required
                    placeholder="5000"
                    min="1"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Target Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="deal-date-field"
                    type="date"
                    required
                    value={expectedCloseDate}
                    onChange={(e) => setExpectedCloseDate(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Pipeline Stage Select */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Pipeline Stage Level
                </label>
                <select
                  id="deal-stage-select"
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all cursor-pointer font-semibold text-accent-dark"
                >
                  {PIPELINE_STAGES.map(s => (
                    <option key={s.key} value={s.key}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  id="cancel-deal-modal"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 active:scale-95 transition-all text-center"
                >
                  Cancel
                </button>
                <button
                  id="submit-deal-modal"
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-xl text-xs font-semibold text-white bg-primary hover:bg-[#20512f] active:scale-95 shadow-md shadow-primary/10 transition-all text-center"
                >
                  {modalMode === 'add' ? 'Create Deal' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-[#253D2C]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center space-y-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                <Trash2 size={24} />
              </div>
              <h3 className="font-display font-bold text-lg text-accent-dark">
                Delete Deal
              </h3>
              <p className="text-sm text-gray-500">
                Are you sure you want to permanently delete this deal pipeline card? This action cannot be undone.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  id="cancel-delete-deal"
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 active:scale-95 transition-all w-24 text-center cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="confirm-delete-deal"
                  type="button"
                  onClick={() => {
                    deleteDeal(deleteConfirmId);
                    setDeleteConfirmId(null);
                  }}
                  className="px-4 py-2 border border-transparent rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:scale-95 shadow-md shadow-red-600/10 transition-all w-24 text-center cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

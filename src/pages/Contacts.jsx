import React, { useState } from 'react';
import { useSyncrix } from '../context/SyncrixContext';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Building, 
  Check, 
  X,
  AlertCircle,
  MoreVertical
} from 'lucide-react';

export default function Contacts() {
  const { contacts, addContact, editContact, deleteContact } = useSyncrix();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [editId, setEditId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('Lead');

  const [formError, setFormError] = useState('');

  // Handle Modal Open
  const openAddModal = () => {
    setModalMode('add');
    setName('');
    setCompany('');
    setEmail('');
    setPhone('');
    setStatus('Lead');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (contact) => {
    setModalMode('edit');
    setEditId(contact.id);
    setName(contact.name);
    setCompany(contact.company);
    setEmail(contact.email);
    setPhone(contact.phone || '');
    setStatus(contact.status);
    setFormError('');
    setIsModalOpen(true);
  };

  // Submit Contact Form
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!name || !company || !email) {
      setFormError('Name, Company, and Email are strictly required.');
      return;
    }

    const contactData = { name, company, email, phone, status };

    if (modalMode === 'add') {
      addContact(contactData);
    } else {
      editContact(editId, contactData);
    }

    setIsModalOpen(false);
  };

  // Status Badge Color Provider
  const getStatusBadge = (statusType) => {
    switch (statusType) {
      case 'Lead':
        return 'bg-blue-50 text-blue-700 border-blue-105 border';
      case 'Active Client':
        return 'bg-emerald-50 text-emerald-700 border-emerald-105 border';
      case 'Past Client':
        return 'bg-gray-100 text-gray-700 border-gray-205 border';
      default:
        return 'bg-gray-50 text-gray-500';
    }
  };

  // Handle Delete
  const handleDelete = (id) => {
    setDeleteConfirmId(id);
  };

  // Run Search and Filter queries
  const filteredContacts = contacts.filter((c) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = 
      c.name.toLowerCase().includes(query) || 
      c.company.toLowerCase().includes(query) || 
      c.email.toLowerCase().includes(query) ||
      (c.phone && c.phone.includes(query));

    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div id="contacts-page" className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-accent-dark tracking-tight">
            Client Contacts
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Maintain high-value communication records, leads, and active projects
          </p>
        </div>
        <div>
          <button
            id="add-contact-btn"
            onClick={openAddModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary/95 active:scale-95 shadow-md shadow-primary/10 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Query Filter row */}
      <div className="bg-white p-5 shadow-panel flex flex-col md:flex-row gap-3 items-center justify-between hover:scale-[1.002] transition-all duration-300" style={{ borderRadius: '24px' }}>
        
        {/* Search input bar */}
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input
            id="contact-search-input"
            type="text"
            placeholder="Search by name, company, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all placeholder-gray-400"
          />
        </div>

        {/* Status Category Tabs */}
        <div className="flex items-center gap-1 w-full md:w-auto overflow-x-auto no-scrollbar py-1">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2 hidden md:inline">
            Status Filter:
          </span>
          {['All', 'Lead', 'Active Client', 'Past Client'].map((st) => (
            <button
              id={`filter-tab-${st.toLowerCase().replace(' ', '-')}`}
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-155 
                ${statusFilter === st 
                  ? 'bg-primary text-white font-bold shadow-sm shadow-primary/5' 
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Main Table or Card List */}
      {filteredContacts.length === 0 ? (
        <div className="bg-white shadow-panel p-12 text-center flex flex-col items-center justify-center min-h-[300px] hover:scale-[1.002] transition-all duration-300" style={{ borderRadius: '32px' }}>
          <div className="h-14 w-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center mb-4">
            <Users size={28} />
          </div>
          <h3 className="font-display text-lg font-bold text-accent-dark">
            {searchTerm || statusFilter !== 'All' ? 'No matching contacts' : 'Your contacts is empty'}
          </h3>
          <p className="text-sm text-gray-500 max-w-xs mt-1">
            {searchTerm || statusFilter !== 'All' 
              ? 'Try adjusting your search criteria or removing active filters.' 
              : 'Add your clients, partners, and high-quality leads to unlock deals.'}
          </p>
          {(searchTerm || statusFilter !== 'All') ? (
            <button
              id="clear-contact-filters"
              onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
              className="mt-4 text-xs font-semibold text-primary hover:underline hover:text-primary-dark"
            >
              Reset All Filters
            </button>
          ) : (
            <button
              id="empty-add-contact-btn"
              onClick={openAddModal}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 border border-transparent rounded-lg text-xs font-semibold text-white bg-primary hover:bg-[#20512f] transition-all"
            >
              <Plus size={14} /> Add First Contact
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white shadow-panel overflow-hidden hover:scale-[1.002] transition-all duration-300 space-y-0" style={{ borderRadius: '32px' }}>
          
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-xs border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Client Name</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Phone Number</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-accent-dark">
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center shrink-0">
                          {contact.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold">{contact.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Building size={14} className="text-gray-400" />
                        <span>{contact.company}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Mail size={14} className="text-gray-400" />
                        <span>{contact.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {contact.phone ? (
                        <div className="flex items-center gap-1.5">
                          <Phone size={14} className="text-gray-400" />
                          <span>{contact.phone}</span>
                        </div>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadge(contact.status)}`}>
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          id={`edit-contact-btn-${contact.id}`}
                          onClick={() => openEditModal(contact)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-gray-50 transition-colors"
                          title="Edit Contact"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          id={`delete-contact-btn-${contact.id}`}
                          onClick={() => handleDelete(contact.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Contact"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile responsive Cards instead of horizontal scrolling table */}
          <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
            {filteredContacts.map((contact) => (
              <div 
                key={contact.id} 
                className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col justify-between space-y-3 shadow-inner hover:border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center shrink-0">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-accent-dark text-sm">{contact.name}</h4>
                      <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                        <Building size={12} />
                        {contact.company}
                      </p>
                    </div>
                  </div>
                  
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${getStatusBadge(contact.status)}`}>
                    {contact.status}
                  </span>
                </div>

                <div className="space-y-1 bg-gray-50 p-2.5 rounded-xl text-xs text-gray-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Mail size={12} className="text-gray-400 shrink-0" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                  {contact.phone && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <Phone size={12} className="text-gray-400 shrink-0" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-1 border-t border-gray-50">
                  <button
                    onClick={() => openEditModal(contact)}
                    className="flex-1 flex justify-center items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    <Edit size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="flex-1 flex justify-center items-center gap-1 px-3 py-1.5 border border-red-100 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Modal Popup for Add or Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#253D2C]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-display font-bold text-lg text-accent-dark">
                {modalMode === 'add' ? 'Add New CRM Contact' : 'Edit Contact Details'}
              </h3>
              <button 
                id="close-contact-modal"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {formError && (
                <div id="contact-form-error" className="bg-red-50 border border-red-100 text-red-700 text-xs p-3 rounded-lg flex items-center gap-2">
                  <AlertCircle size={15} />
                  <span>{formError}</span>
                </div>
              )}

              {/* Name field */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Contact Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact-name-field"
                  type="text"
                  required
                  placeholder="e.g. Alice Jenkins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* Company & Email fields side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-company-field"
                    type="text"
                    required
                    placeholder="e.g. Acme Corp"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-email-field"
                    type="email"
                    required
                    placeholder="e.g. alice@acme.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Phone & Status select */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Phone Number (Optional)
                  </label>
                  <input
                    id="contact-phone-field"
                    type="text"
                    placeholder="e.g. (555) 019-2834"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Lifecycle Status
                  </label>
                  <select
                    id="contact-status-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-all cursor-pointer"
                  >
                    <option value="Lead">Lead</option>
                    <option value="Active Client">Active Client</option>
                    <option value="Past Client">Past Client</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  id="cancel-contact-modal"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 active:scale-95 transition-all text-center"
                >
                  Cancel
                </button>
                <button
                  id="submit-contact-modal"
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-xl text-xs font-semibold text-white bg-primary hover:bg-[#20512f] active:scale-95 shadow-md shadow-primary/10 transition-all text-center"
                >
                  {modalMode === 'add' ? 'Add Contact' : 'Save Changes'}
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
                Delete Contact
              </h3>
              <p className="text-sm text-gray-500">
                Are you absolutely sure you want to delete this contact? This will remove them forever.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  id="cancel-delete-contact"
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 active:scale-95 transition-all w-24 text-center cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="confirm-delete-contact"
                  type="button"
                  onClick={() => {
                    deleteContact(deleteConfirmId);
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

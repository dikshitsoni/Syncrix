import React, { createContext, useContext, useState, useEffect } from 'react';

const SyncrixContext = createContext(null);

const DEFAULT_DEMO_USER = {
  id: 'demo-user-id',
  name: 'Demo',
  email: 'demo@syncrix.com',
  company: 'Demo Creation',
  password: 'password123',
  createdAt: '2026-01-15T08:00:00Z',
  avatarColor: '#2E6F40'
};

const DEFAULT_CONTACTS = [
  { id: 'c1', userId: 'demo-user-id', name: 'Alice Jenkins', company: 'Acme Corp', email: 'alice@acme.com', phone: '(555) 019-2834', status: 'Active Client' },
  { id: 'c2', userId: 'demo-user-id', name: 'Brad Pittman', company: 'Orbit Tech', email: 'brad@orbit.tech', phone: '(555) 014-9843', status: 'Lead' },
  { id: 'c3', userId: 'demo-user-id', name: 'Catherine Zeta', company: 'Zenith Inc', email: 'catherine@zenith.com', phone: '(555) 017-3866', status: 'Active Client' },
  { id: 'c4', userId: 'demo-user-id', name: 'David Miller', company: 'Apex Studio', email: 'david@apex.studio', phone: '(555) 012-7491', status: 'Lead' },
  { id: 'c5', userId: 'demo-user-id', name: 'Emma Watson', company: 'Potter Media', email: 'emma@pottermey.com', phone: '(555) 011-2233', status: 'Past Client' },
  { id: 'c6', userId: 'demo-user-id', name: 'Frank Castle', company: 'Micro Ventures', email: 'frank@punisher.co', phone: '(555) 015-8822', status: 'Active Client' },
];

const DEFAULT_DEALS = [
  { id: 'd1', userId: 'demo-user-id', title: 'Website Redesign', clientName: 'Acme Corp', value: 5500, expectedCloseDate: '2026-06-15', stage: 'Proposal Sent' },
  { id: 'd2', userId: 'demo-user-id', title: 'CRM Integration', clientName: 'Zenith Inc', value: 12000, expectedCloseDate: '2026-07-01', stage: 'Negotiating' },
  { id: 'd3', userId: 'demo-user-id', title: 'Brand Identity Guidelines', clientName: 'Potter Media', value: 3500, expectedCloseDate: '2026-04-10', stage: 'Won' },
  { id: 'd4', userId: 'demo-user-id', title: 'Mobile App MVP', clientName: 'Orbit Tech', value: 18500, expectedCloseDate: '2026-08-30', stage: 'New Lead' },
  { id: 'd5', userId: 'demo-user-id', title: 'SEO Auditing Setup', clientName: 'Apex Studio', value: 1200, expectedCloseDate: '2026-05-12', stage: 'Won' },
  { id: 'd6', userId: 'demo-user-id', title: 'Legacy Migration', clientName: 'Micro Ventures', value: 9000, expectedCloseDate: '2026-03-20', stage: 'Lost' },
];

const DEFAULT_ACTIVITIES = [
  { id: 'a1', userId: 'demo-user-id', type: 'deals', title: 'Deal Updated', message: 'Website Redesign was moved to "Proposal Sent"', date: '2026-05-27T10:30:00Z' },
  { id: 'a2', userId: 'demo-user-id', type: 'contacts', title: 'Contact Added', message: 'David Miller was added as a Lead', date: '2026-05-26T14:15:00Z' },
  { id: 'a3', userId: 'demo-user-id', type: 'deals', title: 'Deal Won 🎉', message: 'SEO Auditing Setup was marked as Won ($1,200)', date: '2026-05-25T09:00:00Z' },
  { id: 'a4', userId: 'demo-user-id', type: 'contacts', title: 'Status Closed', message: 'Alice Jenkins state changed to "Active Client"', date: '2026-05-24T16:45:00Z' },
  { id: 'a5', userId: 'demo-user-id', type: 'deals', title: 'Proposal Sent', message: 'CRM Integration quote delivered ($12,000)', date: '2026-05-23T11:20:00Z'},
];

export function SyncrixProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const local = localStorage.getItem('syncrix_users');
    return local ? JSON.parse(local) : [DEFAULT_DEMO_USER];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const local = localStorage.getItem('syncrix_current_user');
    if (local) {
      return JSON.parse(local);
    }
    return { ...DEFAULT_DEMO_USER, isDemo: true };
  });

  const isDemo = !currentUser || currentUser.id === 'demo-user-id' || !!currentUser.isDemo;

  const [contacts, setContacts] = useState(() => {
    const local = localStorage.getItem('syncrix_contacts');
    return local ? JSON.parse(local) : DEFAULT_CONTACTS;
  });

  const [deals, setDeals] = useState(() => {
    const local = localStorage.getItem('syncrix_deals');
    return local ? JSON.parse(local) : DEFAULT_DEALS;
  });

  const [activities, setActivities] = useState(() => {
    const local = localStorage.getItem('syncrix_activities');
    return local ? JSON.parse(local) : DEFAULT_ACTIVITIES;
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('syncrix_theme') || 'light';
  });

  // Sync to database simulated through localStorage
  useEffect(() => {
    localStorage.setItem('syncrix_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('syncrix_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('syncrix_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('syncrix_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('syncrix_deals', JSON.stringify(deals));
  }, [deals]);

  useEffect(() => {
    localStorage.setItem('syncrix_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('syncrix_theme', theme);
  }, [theme]);

  // Auth Functions
  const login = (email, password) => {
    const trimmedEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.trim().toLowerCase() === trimmedEmail && u.password === password);
    if (user) {
      if (isDemo && user.id !== 'demo-user-id') {
        setContacts(prev => prev.filter(c => c.userId !== 'demo-user-id'));
        setDeals(prev => prev.filter(d => d.userId !== 'demo-user-id'));
        setActivities(prev => prev.filter(a => a.userId !== 'demo-user-id'));
      }
      
      const authenticatedUser = { ...user };
      delete authenticatedUser.isDemo;

      setCurrentUser(authenticatedUser);
      addActivityLog(user.id, 'auth', 'Logged In', 'Welcome back to Syncrix!');
      return { success: true };
    }
    return { success: false, message: 'Invalid email or password.' };
  };

  const signup = (name, email, company, password) => {
    const trimmedEmail = email.trim().toLowerCase();
    if (users.some(u => u.email.trim().toLowerCase() === trimmedEmail)) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email: trimmedEmail,
      company,
      password,
      createdAt: new Date().toISOString(),
      avatarColor: ['#2E6F40', '#68BA7F', '#253D2C', '#3b82f6', '#ec4899', '#8b5cf6'][Math.floor(Math.random() * 6)]
    };

    if (isDemo) {
      setContacts(prev => prev.filter(c => c.userId !== 'demo-user-id'));
      setDeals(prev => prev.filter(d => d.userId !== 'demo-user-id'));
      setActivities(prev => prev.filter(a => a.userId !== 'demo-user-id'));
    }

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);

    // Empty list for new users (no dummy data)
    const initialUserActivities = [
      { id: `a-${Date.now()}-1`, userId: newUser.id, type: 'auth', title: 'Workspace Initialized', message: 'Welcome to your brand new Syncrix CRM workspace!', date: new Date().toISOString() }
    ];
    setActivities(prev => [...prev, ...initialUserActivities]);

    return { success: true };
  };

  const logout = () => {
    if (currentUser && !currentUser.isDemo) {
      addActivityLog(currentUser.id, 'auth', 'Logged Out', 'You have been logged out of the session.');
    }
    localStorage.removeItem('syncrix_current_user');
    setCurrentUser({ ...DEFAULT_DEMO_USER, isDemo: true });

    // Restore demo datasets
    setContacts(prev => {
      const clean = prev.filter(c => c.userId !== 'demo-user-id');
      return [...clean, ...DEFAULT_CONTACTS];
    });
    setDeals(prev => {
      const clean = prev.filter(d => d.userId !== 'demo-user-id');
      return [...clean, ...DEFAULT_DEALS];
    });
    setActivities(prev => {
      const clean = prev.filter(a => a.userId !== 'demo-user-id');
      return [...clean, ...DEFAULT_ACTIVITIES];
    });
  };

  const updateUserProfile = (profileData) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...profileData };
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    addActivityLog(currentUser.id, 'settings', 'Profile Updated', 'You updated your workspace profile settings.');
  };

  // Contacts Actions
  const addContact = (contactData) => {
    if (!currentUser) return;
    const newContact = {
      id: `contact-${Date.now()}`,
      userId: currentUser.id,
      ...contactData
    };
    setContacts(prev => [newContact, ...prev]);
    addActivityLog(currentUser.id, 'contacts', 'Contact Added', `${contactData.name} from ${contactData.company} was added.`);
  };

  const editContact = (id, contactData) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...contactData } : c));
    if (currentUser) {
      addActivityLog(currentUser.id, 'contacts', 'Contact Updated', `Details for ${contactData.name} were updated.`);
    }
  };

  const deleteContact = (id) => {
    const contact = contacts.find(c => c.id === id);
    setContacts(prev => prev.filter(c => c.id !== id));
    if (currentUser && contact) {
      addActivityLog(currentUser.id, 'contacts', 'Contact Deleted', `${contact.name} was removed from contacts.`);
    }
  };

  // Deals Actions
  const addDeal = (dealData) => {
    if (!currentUser) return;
    const newDeal = {
      id: `deal-${Date.now()}`,
      userId: currentUser.id,
      ...dealData,
      value: Number(dealData.value) || 0
    };
    setDeals(prev => [newDeal, ...prev]);
    addActivityLog(currentUser.id, 'deals', 'Deal Created', `New Deal "${dealData.title}" ($${Number(dealData.value).toLocaleString()}) was registered.`);
  };

  const editDeal = (id, dealData) => {
    setDeals(prev => prev.map(d => d.id === id ? { ...d, ...dealData, value: Number(dealData.value) || 0 } : d));
    if (currentUser) {
      addActivityLog(currentUser.id, 'deals', 'Deal Updated', `Deal details for "${dealData.title}" were edited.`);
    }
  };

  const deleteDeal = (id) => {
    const deal = deals.find(d => d.id === id);
    setDeals(prev => prev.filter(d => d.id !== id));
    if (currentUser && deal) {
      addActivityLog(currentUser.id, 'deals', 'Deal Deleted', `Deal "${deal.title}" was removed.`);
    }
  };

  const updateDealStage = (id, newStage) => {
    const deal = deals.find(d => d.id === id);
    if (!deal) return;
    
    setDeals(prev => prev.map(d => d.id === id ? { ...d, stage: newStage } : d));
    
    if (currentUser) {
      let message = `"${deal.title}" moved to "${newStage}" stage.`;
      if (newStage === 'Won') {
        message = `🎉 High five! Deal "${deal.title}" was WON ($${deal.value.toLocaleString()})!`;
      } else if (newStage === 'Lost') {
        message = `Deal "${deal.title}" ($${deal.value.toLocaleString()}) was updated to Lost.`;
      }
      addActivityLog(currentUser.id, 'deals', 'Deal Stage Changed', message);
    }
  };

  // Activity Log helper
  const addActivityLog = (userId, type, title, message) => {
    const log = {
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId,
      type,
      title,
      message,
      date: new Date().toISOString()
    };
    setActivities(prev => [log, ...prev].slice(0, 100)); // Maintain last 100 entries max
  };

  // Filter lists to current authorized user
  const userContacts = contacts.filter(c => currentUser && c.userId === currentUser.id);
  const userDeals = deals.filter(d => currentUser && d.userId === currentUser.id);
  const userActivities = activities.filter(a => currentUser && a.userId === currentUser.id);

  return (
    <SyncrixContext.Provider value={{
      currentUser,
      isDemo,
      login,
      signup,
      logout,
      contacts: userContacts,
      deals: userDeals,
      activities: userActivities,
      theme,
      setTheme,
      addContact,
      editContact,
      deleteContact,
      addDeal,
      editDeal,
      deleteDeal,
      updateDealStage,
      updateUserProfile
    }}>
      {children}
    </SyncrixContext.Provider>
  );
}

export function useSyncrix() {
  const context = useContext(SyncrixContext);
  if (!context) {
    throw new Error('useSyncrix must be used within a SyncrixProvider');
  }
  return context;
}

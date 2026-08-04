import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { fetchLucknowLiveWeather } from '../utils/weatherService';

const AppContext = createContext();

const API_BASE = '/api';

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('smarthome_theme') || 'dark');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('smarthome_user') || '{"name":"Alexus Admin","email":"admin@alexus.io","role":"admin"}'));
  const [token, setToken] = useState(localStorage.getItem('smarthome_token') || '');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [weatherData, setWeatherData] = useState(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [devices, setDevices] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [rules, setRules] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [security, setSecurity] = useState({
    doorLocked: true,
    alarmActive: false,
    motionDetected: false,
    securityMode: 'ARMED_AWAY',
    pinCode: '1234'
  });
  const [notifications, setNotifications] = useState([]);
  const [energyData, setEnergyData] = useState(null);
  const [socket, setSocket] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // login, register, forgot

  // Theme Sync
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('smarthome_theme', theme);
  }, [theme]);

  // Socket.IO Initialization
  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('⚡ Socket connected to server');
    });

    newSocket.on('initial_state', (data) => {
      if (data.devices) setDevices(data.devices);
      if (data.rooms) setRooms(data.rooms);
      if (data.security) setSecurity(data.security);
      if (data.notifications) setNotifications(data.notifications);
    });

    newSocket.on('device_updated', (updatedDevice) => {
      setDevices(prev => prev.map(d => d._id === updatedDevice._id ? updatedDevice : d));
    });

    newSocket.on('device_created', (newDev) => {
      setDevices(prev => [...prev, newDev]);
    });

    newSocket.on('device_deleted', ({ id }) => {
      setDevices(prev => prev.filter(d => d._id !== id));
    });

    newSocket.on('security_updated', (newSec) => {
      setSecurity(newSec);
    });

    newSocket.on('new_notification', (notif) => {
      setNotifications(prev => [notif, ...prev]);
      // Hide on/off notifications from screen toasts
      if (notif.type === 'SECURITY') {
        addToast(notif.message, 'danger');
      }
    });

    newSocket.on('rule_created', (rule) => setRules(prev => [...prev, rule]));
    newSocket.on('rule_updated', (rule) => setRules(prev => prev.map(r => r._id === rule._id ? rule : r)));
    newSocket.on('rule_deleted', ({ id }) => setRules(prev => prev.filter(r => r._id !== id)));

    newSocket.on('schedule_created', (sch) => setSchedules(prev => [...prev, sch]));
    newSocket.on('schedule_updated', (sch) => setSchedules(prev => prev.map(s => s._id === sch._id ? sch : s)));
    newSocket.on('schedule_deleted', ({ id }) => setSchedules(prev => prev.filter(s => s._id !== id)));

    newSocket.on('notifications_cleared', () => {
      setNotifications([]);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const loadLucknowWeather = async () => {
    setIsWeatherLoading(true);
    const data = await fetchLucknowLiveWeather();
    setWeatherData(data);
    setIsWeatherLoading(false);
  };

  // Fetch initial REST data & live weather
  useEffect(() => {
    fetchDevices();
    fetchRooms();
    fetchRules();
    fetchSchedules();
    fetchSecurity();
    fetchEnergy();
    loadLucknowWeather();

    // Refresh weather every 10 minutes
    const weatherInterval = setInterval(loadLucknowWeather, 10 * 60 * 1000);
    return () => clearInterval(weatherInterval);
  }, []);

  const addToast = (message, type = 'info') => {
    // Hide messages about turning devices on/off from screen popups
    const msgLower = (message || '').toLowerCase();
    if (
      msgLower.includes('turned on') || 
      msgLower.includes('turned off') || 
      msgLower.includes('switched on') || 
      msgLower.includes('switched off') || 
      msgLower.includes('light on') || 
      msgLower.includes('light off') || 
      msgLower.includes('fan on') || 
      msgLower.includes('fan off')
    ) {
      return; // Suppress on/off screen messages
    }

    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const fetchDevices = async () => {
    try {
      const res = await fetch(`${API_BASE}/devices`);
      if (res.ok) {
        const data = await res.json();
        setDevices(data);
      }
    } catch (e) {
      console.warn('Backend REST fetch fallback for devices');
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API_BASE}/rooms`);
      if (res.ok) {
        const data = await res.json();
        setRooms(data);
      }
    } catch (e) {}
  };

  const fetchRules = async () => {
    try {
      const res = await fetch(`${API_BASE}/rules`);
      if (res.ok) {
        const data = await res.json();
        setRules(data);
      }
    } catch (e) {}
  };

  const fetchSchedules = async () => {
    try {
      const res = await fetch(`${API_BASE}/schedules`);
      if (res.ok) {
        const data = await res.json();
        setSchedules(data);
      }
    } catch (e) {}
  };

  const fetchSecurity = async () => {
    try {
      const res = await fetch(`${API_BASE}/security/status`);
      if (res.ok) {
        const data = await res.json();
        setSecurity(data);
      }
    } catch (e) {}
  };

  const fetchEnergy = async () => {
    try {
      const res = await fetch(`${API_BASE}/energy/stats`);
      if (res.ok) {
        const data = await res.json();
        setEnergyData(data);
      }
    } catch (e) {}
  };

  const toggleDevice = async (id) => {
    // Optimistic UI update
    setDevices(prev => prev.map(d => d._id === id ? { ...d, state: !d.state } : d));
    
    if (socket) {
      socket.emit('toggle_device_socket', { id });
    } else {
      try {
        await fetch(`${API_BASE}/devices/${id}/toggle`, { method: 'PATCH' });
      } catch (e) {}
    }
  };

  const updateDevice = async (id, updates) => {
    try {
      const res = await fetch(`${API_BASE}/devices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        setDevices(prev => prev.map(d => d._id === id ? updated : d));
        addToast(`Updated ${updated.name}`, 'success');
      }
    } catch (e) {
      addToast('Failed to update device', 'danger');
    }
  };

  const handleLogin = (userData, tokenStr) => {
    setUser(userData);
    setToken(tokenStr);
    localStorage.setItem('smarthome_user', JSON.stringify(userData));
    localStorage.setItem('smarthome_token', tokenStr);
    setShowAuthModal(false);
    addToast(`Welcome back, ${userData.name}!`, 'success');
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('smarthome_user');
    localStorage.removeItem('smarthome_token');
    addToast('Logged out successfully', 'info');
  };

  const clearNotifications = async () => {
    try {
      const res = await fetch(`${API_BASE}/reports/notifications`, { method: 'DELETE' });
      if (res.ok) {
        setNotifications([]);
        addToast('Activity stream cleared', 'info');
      }
    } catch (e) {
      // Fallback: clear locally even if server is unreachable
      setNotifications([]);
    }
  };

  return (
    <AppContext.Provider value={{
      theme, setTheme,
      user, setUser,
      token, setToken,
      activeTab, setActiveTab,
      devices, setDevices, toggleDevice, updateDevice, fetchDevices,
      rooms, setRooms, fetchRooms,
      rules, setRules, fetchRules,
      schedules, setSchedules, fetchSchedules,
      security, setSecurity, fetchSecurity,
      notifications, setNotifications, clearNotifications,
      energyData, fetchEnergy,
      toasts, addToast,
      showAuthModal, setShowAuthModal,
      authMode, setAuthMode,
      handleLogin, handleLogout,
      weatherData, isWeatherLoading, refreshWeather: loadLucknowWeather,
      mobileMenuOpen, setMobileMenuOpen
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

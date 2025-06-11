"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { FiMenu, FiDollarSign, FiHome, FiGrid, FiPieChart, FiLogOut, FiCalendar, FiSettings, FiBarChart2 } from 'react-icons/fi';
import DashboardTab from './tabs/DashboardTab';
import CategoriesTab from './tabs/CategoriesTab';
import BudgetsTab from './tabs/BudgetsTab';
import TransactionsTab from './tabs/TransactionsTab';
import ReportsTab from './tabs/ReportsTab';
import CalendarTab from './tabs/CalendarTab';
import SettingsTab from './tabs/SettingsTab';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import { authService } from './services/auth';
import './App.css';
import NotificationsDropdown from './components/NotificationsDropdown';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Protected Route component
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

const AppContent = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Define a stable error handler using useCallback
    const handleError = useCallback((error) => {
        if (error) {
            console.error("Global error caught:", error);
        }
    }, []);

    const handleLogin = useCallback((userData) => {
        setUser(userData);
        setIsAuthenticated(true);
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const storedUser = localStorage.getItem('user');
                
                if (!token || !storedUser) {
                    setIsAuthenticated(false);
                    setLoading(false);
                    return;
                }

                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
                setLoading(false);
            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                setIsAuthenticated(false);
                handleError("Authentication check failed. Please log in again.");
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [handleError]);

    useEffect(() => {
        if (user) {
            authService.updateUser(user);
        }
    }, [user]);

    const handleLogout = () => {
        try {
            authService.logout();
            setIsAuthenticated(false);
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            handleError(error);
        }
    };

    const handleUserUpdate = useCallback((updatedUser) => {
        setUser(updatedUser);
    }, []);

    const handleTabChange = (value) => {
        setActiveTab(value);
    };

    // Helper to get initials from name or email
    const getInitials = (user) => {
        if (!user) return '';
        if (user.name) {
            const names = user.name.trim().split(' ');
            if (names.length === 1) return names[0][0].toUpperCase();
            return (names[0][0] + names[names.length - 1][0]).toUpperCase();
        }
        if (user.email) return user.email[0].toUpperCase();
        return '';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const renderTabContent = () => {
        const tab = tabs.find(t => t.value === activeTab);
        return tab ? <tab.component 
            key={tab.value} 
            user={user} 
            onError={handleError}
            onUserUpdate={handleUserUpdate}
        /> : null; 
    };

    // Define tabs with component types instead of direct JSX elements
    const tabs = [
        {
            value: 'dashboard',
            label: 'Dashboard',
            component: DashboardTab,
            icon: <FiHome />
        },
        {
            value: 'transactions',
            label: 'Transactions',
            component: TransactionsTab,
            icon: <FiDollarSign />
        },
        {
            value: 'categories',
            label: 'Categories',
            component: CategoriesTab,
            icon: <FiGrid />
        },
        {
            value: 'budgets',
            label: 'Budgets',
            component: BudgetsTab,
            icon: <FiPieChart />
        },
        {
            value: 'reports',
            label: 'Reports',
            component: ReportsTab,
            icon: <FiBarChart2 />
        },
        {
            value: 'calendar',
            label: 'Calendar',
            component: CalendarTab,
            icon: <FiCalendar />
        },
        {
            value: 'settings',
            label: 'Settings',
            component: SettingsTab,
            icon: <FiSettings />
        }
    ];

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <div className="app">
                            <header className="dashboard-header">
                                <button className="menu-button" onClick={() => setSidebarOpen(!sidebarOpen)}>
                                    <FiMenu />
                                    <span className="sr-only">Toggle Menu</span>
                                </button>
                                <div className="logo" style={{ margin: '0 auto' }}>
                                    <FiDollarSign className="logo-icon" />
                                    <span className="logo-text">Traxpense</span>
                                </div>
                                <div className="header-actions">
                                    <NotificationsDropdown />
                                    <button
                                        className="avatar-button"
                                        onClick={() => setActiveTab('settings')}
                                        title="Profile Settings"
                                    >
                                        <div className="avatar">
                                            <div className="avatar-initials">
                                                {getInitials(user) || "U"}
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </header>
                            <div className="dashboard-content">
                                <aside className={`sidebar ${sidebarOpen ? '' : 'closed'}`}>
                                    <nav className="sidebar-nav">
                                        {tabs.map((tab) => (
                                            <button
                                                key={tab.value}
                                                className={`nav-item ${activeTab === tab.value ? 'active' : ''}`}
                                                onClick={() => handleTabChange(tab.value)}
                                            >
                                                {tab.icon}
                                                <span>{tab.label}</span>
                                            </button>
                                        ))}
                                        <button className="nav-item" onClick={handleLogout}>
                                            <FiLogOut />
                                            <span>Logout</span>
                                        </button>
                                    </nav>
                                </aside>
                                <main className="main-content">
                                    <div className="container mx-auto px-4 py-8">
                                        {renderTabContent()}
                                    </div>
                                </main>
                            </div>
                        </div>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
};

export default App; 
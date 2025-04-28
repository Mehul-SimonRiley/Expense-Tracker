"use client"

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FiMenu, FiBell, FiDollarSign, FiHome, FiGrid, FiPieChart, FiLogOut, FiCalendar, FiSettings, FiBarChart2 } from 'react-icons/fi';
import DashboardTab from './tabs/DashboardTab';
import CategoriesTab from './tabs/CategoriesTab';
import BudgetsTab from './tabs/BudgetsTab';
import TransactionsTab from './tabs/TransactionsTab';
import ReportsTab from './tabs/ReportsTab';
import CalendarTab from './tabs/CalendarTab';
import SettingsTab from './tabs/SettingsTab';
import LoginPage from './LoginPage';
import { authService } from './services/auth';
import './ExpenseTracker.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const userData = await authService.getCurrentUser();
                setUser(userData);
                setIsAuthenticated(!!userData);
            } catch (error) {
                console.error('Auth check failed:', error);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Update user data in localStorage when it changes
    useEffect(() => {
        if (user) {
            authService.updateUser(user);
        }
    }, [user]);

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

    const tabs = [
        {
            value: 'dashboard',
            label: 'Dashboard',
            content: <DashboardTab />,
            icon: <FiHome />
        },
        {
            value: 'transactions',
            label: 'Transactions',
            content: <TransactionsTab />,
            icon: <FiDollarSign />
        },
        {
            value: 'categories',
            label: 'Categories',
            content: <CategoriesTab />,
            icon: <FiGrid />
        },
        {
            value: 'budgets',
            label: 'Budgets',
            content: <BudgetsTab />,
            icon: <FiPieChart />
        },
        {
            value: 'reports',
            label: 'Reports',
            content: <ReportsTab />,
            icon: <FiBarChart2 />
        },
        {
            value: 'calendar',
            label: 'Calendar',
            content: <CalendarTab />,
            icon: <FiCalendar />
        },
        {
            value: 'settings',
            label: 'Settings',
            content: <SettingsTab user={user} />,
            icon: <FiSettings />
        }
    ];

    const handleLogout = () => {
        authService.logout();
        setIsAuthenticated(false);
        setUser(null);
    };

    const handleTabChange = (value) => {
        setActiveTab(value);
    };

    const renderTabContent = () => {
        const tab = tabs.find(t => t.value === activeTab);
        return tab ? tab.content : null;
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/login"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/" replace />
                        ) : (
                            <LoginPage onLogin={() => setIsAuthenticated(true)} />
                        )
                    }
                />
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <div className="dashboard-container">
                                <header className="dashboard-header">
                                    <button className="menu-button" onClick={() => setSidebarOpen(!sidebarOpen)}>
                                        <FiMenu />
                                    </button>
                                    <div className="logo">
                                        <FiDollarSign className="logo-icon" />
                                        <span className="logo-text">Traxpense</span>
                                    </div>
                                    <div className="header-actions">
                                        <button className="notification-button">
                                            <FiBell />
                                            <span className="notification-badge">3</span>
                                        </button>
                                        <button
                                            className="avatar-button"
                                            onClick={() => setActiveTab('settings')}
                                            title="Profile Settings"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-700">
                                                {getInitials(user) || "U"}
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
                                                    {tab.label}
                                                </button>
                                            ))}
                                            <button className="nav-item" onClick={handleLogout}>
                                                <FiLogOut />
                                                Logout
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
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;

"use client"

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FiMenu, FiSearch, FiBell, FiDollarSign, FiHome, FiGrid, FiPieChart, FiLogOut, FiCalendar, FiSettings, FiBarChart2 } from 'react-icons/fi';
import { CustomTabs } from './components/ui/tabs';
import DashboardTab from './tabs/DashboardTab';
import CategoriesTab from './tabs/CategoriesTab';
import BudgetsTab from './tabs/BudgetsTab';
import TransactionsTab from './tabs/TransactionsTab';
import ReportsTab from './tabs/ReportsTab';
import CalendarTab from './tabs/CalendarTab';
import SettingsTab from './tabs/SettingsTab';
import LoginPage from './LoginPage';
import { auth } from './api';
import './ExpenseTracker.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setIsAuthenticated(false);
                    setLoading(false);
                    return;
                }

                await auth.getCurrentUser();
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.removeItem('token');
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

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
            content: <SettingsTab />,
            icon: <FiSettings />
        }
    ];

    const handleLogout = async () => {
        try {
            await auth.logout();
            localStorage.removeItem('token');
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
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
                                        <div className="search-container">
                                            <FiSearch className="search-icon" />
                                            <input type="text" className="search-input" placeholder="Search..." />
                                        </div>
                                        <button className="notification-button">
                                            <FiBell />
                                            <span className="notification-badge">3</span>
                                        </button>
                                        <div className="avatar">JD</div>
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

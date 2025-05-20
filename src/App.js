import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import components
import Navbar from './components/Navbar/Navbar';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

// Import pages
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';

// Import context
import { AuthProvider } from './context/AuthContext';

// Basic placeholder components for pages we haven't fully implemented yet
// Basic placeholder components for pages we haven't fully implemented yet
const HomePage = () => <div style={{ padding: '20px' }}><h1>ABACADABA.com - Home Page</h1></div>;
const DashboardPage = () => <div style={{ padding: '20px' }}><h1>ABACADABA.com - Dashboard Page</h1></div>;
const QuestionHistoryPage = () => <div style={{ padding: '20px' }}><h1>ABACADABA.com - History Page</h1></div>;
const UploadQuestionPage = () => <div style={{ padding: '20px' }}><h1>ABACADABA.com - Upload Question Page</h1></div>;
const CreditsPage = () => <div style={{ padding: '20px' }}><h1>ABACADABA.com - Credits Page</h1></div>;

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app">
                    <Navbar />
                    <main>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route
                                path="/dashboard"
                                element={
                                    <PrivateRoute>
                                        <DashboardPage />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/upload"
                                element={
                                    <PrivateRoute>
                                        <UploadQuestionPage />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/history"
                                element={
                                    <PrivateRoute>
                                        <QuestionHistoryPage />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/credits"
                                element={
                                    <PrivateRoute>
                                        <CreditsPage />
                                    </PrivateRoute>
                                }
                            />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </main>
                    <ToastContainer position="bottom-right" />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
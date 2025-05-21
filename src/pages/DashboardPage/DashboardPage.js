import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import styles from './DashboardPage.module.css';

// Sample chart components - you'll need to install recharts
// npm install recharts
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const DashboardPage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // State for dashboard data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        questionCount: 0,
        recentQuestions: [],
        questionTypeBreakdown: [],
        usageOverTime: [],
        creditHistory: []
    });
    const [systemStatus, setSystemStatus] = useState({
        apiStatus: 'operational',
        processingQueueStatus: 'normal',
        maintenanceAnnouncements: []
    });

    // Colors for charts
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // In a real implementation, you would fetch this data from your API
                // For now, we'll use sample data

                // Mock API call - replace with actual endpoint once available
                // const response = await axios.get('/api/dashboard');
                // setStats(response.data);

                // Sample data for demonstration
                setStats({
                    questionCount: 32,
                    recentQuestions: [
                        {
                            id: 1,
                            question_text: 'Which of the following is NOT one of the examples of a supervisory job title?',
                            image_path: '/sample_question1.png',
                            question_type: 'multiple_choice',
                            created_at: '2025-05-18T14:23:15',
                            status: 'completed'
                        },
                        {
                            id: 2,
                            question_text: 'Calculate the derivative of f(x) = 3x² + 2x - 5',
                            image_path: '/sample_question2.png',
                            question_type: 'calculation',
                            created_at: '2025-05-19T09:45:30',
                            status: 'completed'
                        },
                        {
                            id: 3,
                            question_text: 'Explain the significance of mitochondria in eukaryotic cells.',
                            image_path: '/sample_question3.png',
                            question_type: 'text',
                            created_at: '2025-05-20T11:17:42',
                            status: 'processing'
                        }
                    ],
                    questionTypeBreakdown: [
                        { name: 'Multiple Choice', value: 15 },
                        { name: 'Calculation', value: 8 },
                        { name: 'Text/Essay', value: 6 },
                        { name: 'True/False', value: 3 }
                    ],
                    usageOverTime: [
                        { date: '05/14', questions: 2 },
                        { date: '05/15', questions: 3 },
                        { date: '05/16', questions: 5 },
                        { date: '05/17', questions: 4 },
                        { date: '05/18', questions: 7 },
                        { date: '05/19', questions: 6 },
                        { date: '05/20', questions: 5 }
                    ],
                    creditHistory: [
                        { date: '05/15', action: 'Purchase', amount: 20 },
                        { date: '05/16', action: 'Usage', amount: -5 },
                        { date: '05/17', action: 'Usage', amount: -4 },
                        { date: '05/18', action: 'Usage', amount: -7 },
                        { date: '05/19', action: 'Purchase', amount: 10 },
                        { date: '05/20', action: 'Usage', amount: -6 }
                    ],
                    subjectAreas: [
                        { subject: 'Mathematics', count: 12 },
                        { subject: 'Science', count: 8 },
                        { subject: 'Business', count: 7 },
                        { subject: 'Computer Science', count: 5 }
                    ]
                });

                // Sample system status
                setSystemStatus({
                    apiStatus: 'operational',
                    processingQueueStatus: 'normal',
                    maintenanceAnnouncements: []
                });

            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data. Please try again later.');
                toast.error('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Calculate remaining credits based on usage history
    const calculateRemainingCredits = () => {
        // In a real implementation, this would come from the user object
        // For now, we'll calculate it from our sample data
        return stats.creditHistory.reduce((total, transaction) => total + transaction.amount, 0);
    };

    // Estimate credit duration at current usage rate
    const estimateCreditDuration = () => {
        const credits = calculateRemainingCredits();
        const recentDailyUsage = stats.usageOverTime.slice(-7).reduce((sum, day) => sum + day.questions, 0) / 7;

        if (recentDailyUsage <= 0) return "∞ days";

        const days = Math.floor(credits / recentDailyUsage);
        return `~${days} days`;
    };

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Determine status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return '#48bb78'; // green
            case 'processing':
                return '#4299e1'; // blue
            case 'failed':
                return '#f56565'; // red
            default:
                return '#a0aec0'; // gray
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loader}></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className={styles.errorContainer}>
                <p className={styles.errorMessage}>{error}</p>
                <button
                    className={styles.retryButton}
                    onClick={() => window.location.reload()}
                >
                    Retry
                </button>
            </div>
        );
    }

    // Calculate remaining credits
    const remainingCredits = calculateRemainingCredits();
    const creditDuration = estimateCreditDuration();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Dashboard</h1>

            {/* Welcome Section */}
            <div className={styles.welcomeSection}>
                <div className={styles.welcomeText}>
                    <h2>Welcome back, {user?.full_name || 'User'}!</h2>
                    <p>Here's an overview of your EXAM_BOT activity</p>
                </div>
                <div className={styles.quickActions}>
                    <button
                        className={styles.uploadButton}
                        onClick={() => navigate('/upload')}
                    >
                        Upload New Question
                    </button>
                    {remainingCredits < 10 && (
                        <button
                            className={styles.buyCreditButton}
                            onClick={() => navigate('/credits')}
                        >
                            Buy Credits
                        </button>
                    )}
                </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className={styles.dashboardGrid}>
                {/* Credits Card */}
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Credit Balance</h3>
                    <div className={styles.creditInfo}>
                        <div className={styles.creditCount}>
                            <span className={styles.creditNumber}>{remainingCredits}</span>
                            <span className={styles.creditLabel}>credits</span>
                        </div>
                        <div className={styles.creditMeta}>
                            <p>At your current usage rate, credits will last approximately {creditDuration}</p>
                            <Link to="/credits" className={styles.viewDetailsLink}>Manage Credits</Link>
                        </div>
                    </div>
                    <div className={styles.recentTransactions}>
                        <h4>Recent Transactions</h4>
                        <ul className={styles.transactionList}>
                            {stats.creditHistory.slice(-3).map((transaction, index) => (
                                <li key={index} className={styles.transaction}>
                                    <span className={styles.transactionDate}>{transaction.date}</span>
                                    <span className={styles.transactionAction}>{transaction.action}</span>
                                    <span className={`${styles.transactionAmount} ${transaction.amount > 0 ? styles.positive : styles.negative}`}>
                                        {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Usage Stats Card */}
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Usage Statistics</h3>
                    <div className={styles.statsHighlight}>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>{stats.questionCount}</span>
                            <span className={styles.statLabel}>Total Questions</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>{stats.usageOverTime.slice(-1)[0]?.questions || 0}</span>
                            <span className={styles.statLabel}>Today</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>
                                {(stats.questionCount / (stats.questionCount + remainingCredits) * 100).toFixed(0)}%
                            </span>
                            <span className={styles.statLabel}>Utilization</span>
                        </div>
                    </div>
                    <div className={styles.usageChart}>
                        <h4>Questions Processed (Last 7 days)</h4>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={stats.usageOverTime} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="questions" stroke="#4299e1" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Question Type Breakdown */}
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Question Types</h3>
                    <div className={styles.pieChartContainer}>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={stats.questionTypeBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {stats.questionTypeBreakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className={styles.typeDistribution}>
                        {stats.questionTypeBreakdown.map((type, index) => (
                            <div key={index} className={styles.typeItem}>
                                <div
                                    className={styles.typeColor}
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                ></div>
                                <span className={styles.typeName}>{type.name}</span>
                                <span className={styles.typeCount}>{type.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Performance Insights */}
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Performance Insights</h3>
                    <div className={styles.subjectPerformance}>
                        <h4>Subject Areas</h4>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={stats.subjectAreas} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="subject" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#8884d8">
                                    {stats.subjectAreas.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className={styles.timeSavings}>
                        <h4>Estimated Time Savings</h4>
                        <p className={styles.savingsEstimate}>
                            <strong>{stats.questionCount * 10} minutes</strong> saved by using EXAM_BOT
                            <span className={styles.savingsDetail}>(based on avg. 10 min/question)</span>
                        </p>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Recent Questions</h3>
                    <div className={styles.recentQuestionsContainer}>
                        {stats.recentQuestions.length === 0 ? (
                            <div className={styles.emptyState}>
                                <p>No questions processed yet.</p>
                                <button
                                    className={styles.uploadButton}
                                    onClick={() => navigate('/upload')}
                                >
                                    Upload Your First Question
                                </button>
                            </div>
                        ) : (
                            <ul className={styles.recentQuestionsList}>
                                {stats.recentQuestions.map(question => (
                                    <li key={question.id} className={styles.recentQuestion}>
                                        <Link to={`/questions/${question.id}`} className={styles.questionLink}>
                                            <div className={styles.questionMeta}>
                                                <span
                                                    className={styles.questionStatus}
                                                    style={{ backgroundColor: getStatusColor(question.status) }}
                                                >
                                                    {question.status}
                                                </span>
                                                <span className={styles.questionDate}>{formatDate(question.created_at)}</span>
                                            </div>
                                            <div className={styles.questionContent}>
                                                <p className={styles.questionPreview}>
                                                    {question.question_text.length > 100
                                                        ? `${question.question_text.substring(0, 100)}...`
                                                        : question.question_text}
                                                </p>
                                                <span className={styles.questionType}>{question.question_type}</span>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className={styles.viewAllContainer}>
                            <Link to="/history" className={styles.viewAllLink}>
                                View All Questions
                            </Link>
                        </div>
                    </div>
                </div>

                {/* System Status */}
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>System Status</h3>
                    <div className={styles.statusContainer}>
                        <div className={styles.statusItem}>
                            <span className={styles.statusLabel}>API Status:</span>
                            <span className={`${styles.statusValue} ${systemStatus.apiStatus === 'operational' ? styles.statusGood : styles.statusBad}`}>
                                {systemStatus.apiStatus === 'operational' ? 'Operational' : 'Experiencing Issues'}
                            </span>
                        </div>
                        <div className={styles.statusItem}>
                            <span className={styles.statusLabel}>Processing Queue:</span>
                            <span className={`${styles.statusValue} ${systemStatus.processingQueueStatus === 'normal' ? styles.statusGood : styles.statusWarning}`}>
                                {systemStatus.processingQueueStatus === 'normal' ? 'Normal' : 'Backlogged'}
                            </span>
                        </div>

                        {systemStatus.maintenanceAnnouncements.length > 0 ? (
                            <div className={styles.announcements}>
                                <h4>Announcements</h4>
                                <ul className={styles.announcementsList}>
                                    {systemStatus.maintenanceAnnouncements.map((announcement, index) => (
                                        <li key={index} className={styles.announcement}>
                                            {announcement}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className={styles.noAnnouncements}>
                                <p>No scheduled maintenance or service disruptions.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
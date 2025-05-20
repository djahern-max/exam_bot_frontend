import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Clock, CreditCard } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Dashboard</h1>
                <p className={styles.subtitle}>Welcome to ABACADABA.com, {user?.email}</p>
            </div>

            <div className={styles.statsContainer}>
                <div className={styles.statsCard}>
                    <div className={styles.statsIcon}>
                        <CreditCard size={24} />
                    </div>
                    <div className={styles.statsInfo}>
                        <h3 className={styles.statsValue}>{user?.credits}</h3>
                        <p className={styles.statsLabel}>Available Credits</p>
                    </div>
                </div>
            </div>

            <div className={styles.actionsContainer}>
                <h2 className={styles.sectionTitle}>Quick Actions</h2>
                <div className={styles.actionCards}>
                    <Link to="/upload" className={styles.actionCard}>
                        <div className={styles.actionIcon}>
                            <Upload size={24} />
                        </div>
                        <h3 className={styles.actionTitle}>Upload Question</h3>
                        <p className={styles.actionDescription}>
                            Upload a screenshot of your exam question for analysis
                        </p>
                    </Link>

                    <Link to="/history" className={styles.actionCard}>
                        <div className={styles.actionIcon}>
                            <Clock size={24} />
                        </div>
                        <h3 className={styles.actionTitle}>Question History</h3>
                        <p className={styles.actionDescription}>
                            View your previously analyzed questions
                        </p>
                    </Link>

                    <Link to="/credits" className={styles.actionCard}>
                        <div className={styles.actionIcon}>
                            <CreditCard size={24} />
                        </div>
                        <h3 className={styles.actionTitle}>Buy Credits</h3>
                        <p className={styles.actionDescription}>
                            Purchase more credits to analyze more questions
                        </p>
                    </Link>
                </div>
            </div>

            <div className={styles.getStartedContainer}>
                <h2 className={styles.sectionTitle}>Getting Started</h2>
                <div className={styles.stepCard}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                        <h3 className={styles.stepTitle}>Take a Screenshot</h3>
                        <p className={styles.stepDescription}>
                            Take a clear screenshot of your exam question
                        </p>
                    </div>
                </div>

                <div className={styles.stepCard}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                        <h3 className={styles.stepTitle}>Upload the Screenshot</h3>
                        <p className={styles.stepDescription}>
                            Upload the screenshot to our system
                        </p>
                    </div>
                </div>

                <div className={styles.stepCard}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                        <h3 className={styles.stepTitle}>Get Your Answer</h3>
                        <p className={styles.stepDescription}>
                            Our AI will analyze the question and provide the answer
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Search, BookOpen, CheckCircle, BookMarked } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

const HomePage = () => {
    // State to track screen width
    const [isMobile, setIsMobile] = useState(false);

    // Check screen width on initial render and window resize
    useEffect(() => {
        const checkScreenWidth = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Initial check
        checkScreenWidth();

        // Add event listener for window resize
        window.addEventListener('resize', checkScreenWidth);

        // Clean up event listener
        return () => window.removeEventListener('resize', checkScreenWidth);
    }, []);

    return (
        <div className={styles.fullPage}>
            <div className={styles.centeredContent}>
                {/* Enhanced Logo */}
                <div className={styles.logo}>
                    <div className={styles.logoText}>
                        {/* Adding more color and style to the name */}
                        <div className={styles.logoWrapper}>
                            <span className={styles.siteName}>
                                A<span className={styles.letterB}>B</span>A<span className={styles.letterC}>C</span>A<span className={styles.letterD}>D</span>A<span className={styles.letterB}>B</span>A
                            </span>
                            {!isMobile && (
                                <span className={styles.domain}>
                                    <span className={styles.dot}>.</span>com
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Improved Tagline */}
                <div className={styles.subtitle}>
                    Where <span className={styles.highlightPink}>students</span> and <span className={styles.highlightPurple}>learners</span> get <span className={styles.highlightBlue}>instant answers</span> to their <span className={styles.highlightGreen}>exam questions</span>
                </div>

                {/* Features Grid - Only rendered on larger screens due to CSS display property */}
                <div className={styles.featuresGrid}>
                    <div className={styles.featureItem}>
                        <div className={`${styles.featureIcon} ${styles.featurePink}`}>
                            <Search size={22} />
                        </div>
                        <div className={styles.featureText}>Analyze</div>
                    </div>

                    <div className={styles.featureItem}>
                        <div className={`${styles.featureIcon} ${styles.featurePurple}`}>
                            <BookOpen size={22} />
                        </div>
                        <div className={styles.featureText}>Learn</div>
                    </div>

                    <div className={styles.featureItem}>
                        <div className={`${styles.featureIcon} ${styles.featureGreen}`}>
                            <CheckCircle size={22} />
                        </div>
                        <div className={styles.featureText}>Verify</div>
                    </div>

                    <div className={styles.featureItem}>
                        <div className={`${styles.featureIcon} ${styles.featureOrange}`}>
                            <BookMarked size={22} />
                        </div>
                        <div className={styles.featureText}>Review</div>
                    </div>
                </div>

                {/* Action Buttons - With enhanced styling */}
                <div className={styles.actionContainer}>
                    <Link to="/register" className={styles.primaryButton}>
                        Get Started <ArrowUpRight size={18} />
                    </Link>

                    <Link to="/login" className={styles.secondaryButton}>
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
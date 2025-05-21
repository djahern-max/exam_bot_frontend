import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.navbarContainer}>
                <Link to="/" className={styles.navbarLogo}>
                    <span className={styles.siteName}>
                        A<span className={styles.letterB}>B</span>A<span className={styles.letterC}>C</span>A<span className={styles.letterD}>D</span>A<span className={styles.letterB}>B</span>A
                    </span>
                    <span className={styles.domain}>.com</span>
                </Link>

                <div className={styles.menuIcon} onClick={toggleMenu}>
                    <div className={`${styles.menuBar} ${menuOpen ? styles.open : ''}`}></div>
                    <div className={`${styles.menuBar} ${menuOpen ? styles.open : ''}`}></div>
                    <div className={`${styles.menuBar} ${menuOpen ? styles.open : ''}`}></div>
                </div>

                <ul className={`${styles.navMenu} ${menuOpen ? styles.active : ''}`}>
                    {user ? (
                        <>
                            <li className={styles.navItem}>
                                <span className={styles.credits}>
                                    Credits: {user.credits}
                                </span>
                            </li>
                            <li className={styles.navItem}>
                                <Link
                                    to="/dashboard"
                                    className={`${styles.navLink} ${styles.dashboardLink} ${location.pathname === '/dashboard' ? styles.activeLink : ''}`}
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li className={styles.navItem}>
                                <Link
                                    to="/upload"
                                    className={`${styles.navLink} ${styles.uploadLink} ${location.pathname === '/upload' ? styles.activeLink : ''}`}
                                >
                                    Upload Question
                                </Link>
                            </li>
                            <li className={styles.navItem}>
                                <Link
                                    to="/history"
                                    className={`${styles.navLink} ${styles.historyLink} ${location.pathname === '/history' ? styles.activeLink : ''}`}
                                >
                                    History
                                </Link>
                            </li>
                            <li className={styles.navItem}>
                                <Link
                                    to="/credits"
                                    className={`${styles.navLink} ${styles.creditsLink} ${location.pathname === '/credits' ? styles.activeLink : ''}`}
                                >
                                    Buy Credits
                                </Link>
                            </li>
                            <li className={styles.navItem}>
                                <button
                                    onClick={handleLogout}
                                    className={styles.logoutButton}
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className={styles.navItem}>
                                <Link
                                    to="/login"
                                    className={`${styles.navLink} ${location.pathname === '/login' ? styles.activeLink : ''}`}
                                >
                                    Login
                                </Link>
                            </li>
                            <li className={styles.navItem}>
                                <Link to="/register" className={styles.navLinkButton}>
                                    Register
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
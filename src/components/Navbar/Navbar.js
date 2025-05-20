import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className={styles.navbar}>
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
                                <Link to="/dashboard" className={styles.navLink}>
                                    Dashboard
                                </Link>
                            </li>
                            <li className={styles.navItem}>
                                <Link to="/upload" className={styles.navLink}>
                                    Upload Question
                                </Link>
                            </li>
                            <li className={styles.navItem}>
                                <Link to="/history" className={styles.navLink}>
                                    History
                                </Link>
                            </li>
                            <li className={styles.navItem}>
                                <Link to="/credits" className={styles.navLink}>
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
                                <Link to="/login" className={styles.navLink}>
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
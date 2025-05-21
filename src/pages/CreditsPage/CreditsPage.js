import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import styles from './CreditsPage.module.css';

// Import Stripe.js if you're using it on the frontend
// import { loadStripe } from '@stripe/stripe-js';
// const stripePromise = loadStripe('your_publishable_key');

const CreditsPage = () => {
    const { user, token, refreshUserData } = useContext(AuthContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [transactionHistory, setTransactionHistory] = useState([]);

    // Credit package options
    const creditPackages = [
        {
            id: 'basic',
            name: 'Basic Package',
            credits: 20,
            price: 4.99,
            popular: false,
            description: 'Good for getting started with multiple choice questions',
            estimatedQuestions: {
                basic: 20,
                standard: 6,
                premium: 2
            }
        },
        {
            id: 'standard',
            name: 'Standard Package',
            credits: 50,
            price: 9.99,
            popular: true,
            description: 'Perfect for regular use with detailed explanations',
            estimatedQuestions: {
                basic: 50,
                standard: 16,
                premium: 6
            }
        },
        {
            id: 'premium',
            name: 'Premium Package',
            credits: 150,
            price: 24.99,
            popular: false,
            description: 'Best value for comprehensive exam preparation',
            estimatedQuestions: {
                basic: 150,
                standard: 50,
                premium: 18
            }
        },
        {
            id: 'unlimited',
            name: 'Unlimited Package',
            credits: 500,
            price: 59.99,
            popular: false,
            description: 'For intensive study periods and full course coverage',
            estimatedQuestions: {
                basic: 500,
                standard: 166,
                premium: 62
            }
        }
    ];

    // Fetch transaction history
    useEffect(() => {
        const fetchTransactionHistory = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/payments/history', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setTransactionHistory(response.data);
            } catch (error) {
                console.error('Error fetching transaction history:', error);
                toast.error('Failed to load transaction history');
            } finally {
                setLoading(false);
            }
        };

        fetchTransactionHistory();
    }, [token]);

    // Handle package selection
    const handlePackageSelect = (packageId) => {
        setSelectedPackage(packageId);
    };

    // Handle payment process
    const handlePayment = async () => {
        if (!selectedPackage) {
            toast.warning('Please select a credit package');
            return;
        }

        try {
            setPaymentLoading(true);

            // Get the selected package details
            const packageDetails = creditPackages.find(pkg => pkg.id === selectedPackage);

            // Create payment intent with Stripe
            const response = await axios.post('/api/payments/create-payment-intent', {
                amount: packageDetails.price * 100, // Convert to cents for Stripe
                credits: packageDetails.credits,
                package_name: packageDetails.name
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Handle Stripe checkout session
            if (response.data.url) {
                // Redirect to Stripe Checkout
                window.location.href = response.data.url;
            } else if (response.data.client_secret) {
                // For custom payment form integration
                // You would use Stripe Elements here
                // This is a simplified example
                toast.success('Payment processed successfully!');

                // Refresh user data to update credit balance
                await refreshUserData();

                // Fetch updated transaction history
                const historyResponse = await axios.get('/api/payments/history', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setTransactionHistory(historyResponse.data);
            }
        } catch (error) {
            console.error('Payment error:', error);
            toast.error('Payment failed. Please try again.');
        } finally {
            setPaymentLoading(false);
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Buy Credits</h1>

            <div className={styles.creditsHeader}>
                <div className={styles.currentCredits}>
                    <span className={styles.creditLabel}>Your Current Balance</span>
                    <span className={styles.creditCount}>{user?.credits || 0}</span>
                    <span className={styles.creditUnit}>credits</span>
                </div>

                <div className={styles.creditsInfo}>
                    <p>
                        Credits are used to process exam questions. Different question types and detail levels require different amounts of credits.
                    </p>
                </div>
            </div>

            <h2 className={styles.sectionTitle}>Select a Package</h2>

            <div className={styles.packagesContainer}>
                {creditPackages.map(pkg => (
                    <div
                        key={pkg.id}
                        className={`${styles.packageCard} ${selectedPackage === pkg.id ? styles.selected : ''} ${pkg.popular ? styles.popular : ''}`}
                        onClick={() => handlePackageSelect(pkg.id)}
                    >
                        {pkg.popular && <div className={styles.popularBadge}>Most Popular</div>}

                        <h3 className={styles.packageName}>{pkg.name}</h3>
                        <div className={styles.packageCredits}>
                            <span className={styles.creditAmount}>{pkg.credits}</span>
                            <span className={styles.creditLabel}>credits</span>
                        </div>

                        <div className={styles.packagePrice}>
                            <span className={styles.currency}>$</span>
                            <span className={styles.amount}>{pkg.price.toFixed(2)}</span>
                        </div>

                        <p className={styles.packageDescription}>{pkg.description}</p>

                        <div className={styles.estimatedQuestions}>
                            <h4>Estimated Questions:</h4>
                            <ul>
                                <li><strong>{pkg.estimatedQuestions.basic}</strong> Basic questions</li>
                                <li><strong>{pkg.estimatedQuestions.standard}</strong> Standard questions</li>
                                <li><strong>{pkg.estimatedQuestions.premium}</strong> Premium questions</li>
                            </ul>
                        </div>

                        <div className={styles.valueIndicator}>
                            <div className={styles.valueBar} style={{ width: `${(pkg.credits / pkg.price) / 5}%` }}></div>
                            <span className={styles.valueLabel}>Value: {(pkg.credits / pkg.price).toFixed(1)} credits/$</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.checkoutContainer}>
                <button
                    className={styles.checkoutButton}
                    onClick={handlePayment}
                    disabled={!selectedPackage || paymentLoading}
                >
                    {paymentLoading ? 'Processing...' : 'Proceed to Payment'}
                </button>

                <p className={styles.secureInfo}>
                    <span className={styles.secureIcon}>🔒</span>
                    Secure payment processed by Stripe. We don't store your card details.
                </p>
            </div>

            <div className={styles.transactionSection}>
                <h2 className={styles.sectionTitle}>Transaction History</h2>

                {loading ? (
                    <div className={styles.loadingContainer}>
                        <div className={styles.loader}></div>
                        <p>Loading transaction history...</p>
                    </div>
                ) : transactionHistory.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>No transactions yet.</p>
                    </div>
                ) : (
                    <div className={styles.transactionsTable}>
                        <div className={styles.tableHeader}>
                            <div className={styles.dateCell}>Date</div>
                            <div className={styles.descriptionCell}>Description</div>
                            <div className={styles.amountCell}>Amount</div>
                            <div className={styles.creditsCell}>Credits</div>
                            <div className={styles.statusCell}>Status</div>
                        </div>

                        {transactionHistory.map(transaction => (
                            <div key={transaction.id} className={styles.tableRow}>
                                <div className={styles.dateCell}>{formatDate(transaction.created_at)}</div>
                                <div className={styles.descriptionCell}>{transaction.description}</div>
                                <div className={styles.amountCell}>
                                    ${(transaction.amount / 100).toFixed(2)}
                                </div>
                                <div className={styles.creditsCell}>
                                    +{transaction.credits}
                                </div>
                                <div className={styles.statusCell}>
                                    <span className={`${styles.statusBadge} ${styles[transaction.status]}`}>
                                        {transaction.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.faqSection}>
                <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>

                <div className={styles.faqItem}>
                    <h3>How do credits work?</h3>
                    <p>
                        Credits are used to process your exam questions. Each time you upload a question,
                        a certain number of credits are deducted based on the complexity level you select.
                    </p>
                </div>

                <div className={styles.faqItem}>
                    <h3>Do credits expire?</h3>
                    <p>
                        No, your credits never expire. They'll remain in your account until you use them.
                    </p>
                </div>

                <div className={styles.faqItem}>
                    <h3>Can I get a refund?</h3>
                    <p>
                        We don't offer refunds for purchased credits, but if you experience any technical issues,
                        please contact our support team and we'll do our best to resolve the issue.
                    </p>
                </div>

                <div className={styles.faqItem}>
                    <h3>How do I know which package is right for me?</h3>
                    <p>
                        Consider how many questions you need to process and their complexity.
                        For regular exam preparation, the Standard Package is a popular choice.
                        For intensive study periods or full course coverage, consider the Premium or Unlimited Package.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CreditsPage;
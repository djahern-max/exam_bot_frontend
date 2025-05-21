import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from './QuestionDetailPage.module.css';

const QuestionDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processingStatus, setProcessingStatus] = useState('');

    // Fetch question details on component mount
    useEffect(() => {
        const fetchQuestionDetails = async () => {
            try {
                const response = await axios.get(`/api/questions/${id}`);
                setQuestion(response.data);

                // Check if processing is complete
                if (response.data.status === 'processing') {
                    setProcessingStatus('processing');
                    // Set up polling if question is still processing
                    const interval = setInterval(checkProcessingStatus, 3000);
                    return () => clearInterval(interval);
                }
            } catch (error) {
                console.error('Error fetching question details:', error);
                setError('Failed to load question details. Please try again.');
                toast.error('Failed to load question details');
            } finally {
                setLoading(false);
            }
        };

        // Function to check processing status
        const checkProcessingStatus = async () => {
            try {
                const response = await axios.get(`/api/questions/${id}`);
                setQuestion(response.data);

                if (response.data.status !== 'processing') {
                    setProcessingStatus('completed');
                    clearInterval(intervalId);
                }
            } catch (error) {
                console.error('Error checking processing status:', error);
                clearInterval(intervalId);
            }
        };

        let intervalId;
        fetchQuestionDetails();

        // Cleanup function
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [id]);

    // Handle deletion
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            try {
                await axios.delete(`/api/questions/${id}`);
                toast.success('Question deleted successfully');
                navigate('/history');
            } catch (error) {
                console.error('Error deleting question:', error);
                toast.error('Failed to delete question');
            }
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loader}></div>
                <p>Loading question details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <p className={styles.errorMessage}>{error}</p>
                <Link to="/history" className={styles.backButton}>
                    Back to Question History
                </Link>
            </div>
        );
    }

    if (!question) {
        return (
            <div className={styles.notFoundContainer}>
                <p>Question not found.</p>
                <Link to="/history" className={styles.backButton}>
                    Back to Question History
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Question Details</h1>
                <div className={styles.actions}>
                    <Link to="/history" className={styles.backButton}>
                        Back to History
                    </Link>
                    <button
                        className={styles.deleteButton}
                        onClick={handleDelete}
                    >
                        Delete Question
                    </button>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.metadata}>
                    <span className={styles.questionType}>
                        {question.question_type === 'multiple_choice' ? 'Multiple Choice' : 'Open Ended'}
                    </span>
                    <span className={styles.dateCreated}>
                        {formatDate(question.created_at)}
                    </span>
                </div>

                <div className={styles.content}>
                    <div className={styles.imageSection}>
                        {question.image_path && (
                            <img
                                src={`${process.env.REACT_APP_API_URL || ''}${question.image_path}`}
                                alt="Question"
                                className={styles.questionImage}
                            />
                        )}
                    </div>

                    <div className={styles.detailsSection}>
                        <div className={styles.questionText}>
                            <h3>Question:</h3>
                            <p>{question.question_text || 'Processing question text...'}</p>
                        </div>

                        {question.question_type === 'multiple_choice' && question.options && (
                            <div className={styles.options}>
                                <h3>Options:</h3>
                                <ul className={styles.optionsList}>
                                    {Object.entries(question.options).map(([key, value]) => (
                                        <li
                                            key={key}
                                            className={`${styles.option} ${key === question.answer ? styles.correctOption : ''}`}
                                        >
                                            <span className={styles.optionKey}>{key}</span>
                                            <span className={styles.optionValue}>{value}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className={styles.answer}>
                            <h3>Answer:</h3>
                            {processingStatus === 'processing' ? (
                                <div className={styles.processing}>
                                    <p>Processing your question...</p>
                                    <div className={styles.progressBar}>
                                        <div className={styles.progress}></div>
                                    </div>
                                </div>
                            ) : question.question_type === 'multiple_choice' ? (
                                <div>
                                    {question.answer ? (
                                        <p>
                                            <strong>Option {question.answer}:</strong>{' '}
                                            {question.options && question.options[question.answer]}
                                        </p>
                                    ) : (
                                        <p>Answer not available yet</p>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    {question.answer ? (
                                        <p>{question.answer}</p>
                                    ) : (
                                        <p>Answer not available yet</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {question.explanation && (
                            <div className={styles.explanation}>
                                <h3>Explanation:</h3>
                                <p>{question.explanation}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionDetailPage;
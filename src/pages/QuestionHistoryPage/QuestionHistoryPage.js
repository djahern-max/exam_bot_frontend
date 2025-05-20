import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from './QuestionHistoryPage.module.css';

const QuestionHistoryPage = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeQuestion, setActiveQuestion] = useState(null);
    const [filter, setFilter] = useState('all'); // 'all', 'multiple_choice', or 'open_ended'

    // Fetch questions on component mount
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get('/api/questions');
                setQuestions(response.data);
            } catch (error) {
                console.error('Error fetching questions:', error);
                toast.error('Failed to load question history');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    // Handle question deletion
    const handleDeleteQuestion = async (id) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            try {
                await axios.delete(`/api/questions/${id}`);
                setQuestions(questions.filter(q => q.id !== id));
                if (activeQuestion && activeQuestion.id === id) {
                    setActiveQuestion(null);
                }
                toast.success('Question deleted successfully');
            } catch (error) {
                console.error('Error deleting question:', error);
                toast.error('Failed to delete question');
            }
        }
    };

    // Filter questions based on type
    const filteredQuestions = filter === 'all'
        ? questions
        : questions.filter(q => q.question_type === filter);

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

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <p>Loading questions...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Question History</h1>

            <div className={styles.filterContainer}>
                <button
                    className={`${styles.filterButton} ${filter === 'all' ? styles.activeFilter : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All Questions
                </button>
                <button
                    className={`${styles.filterButton} ${filter === 'multiple_choice' ? styles.activeFilter : ''}`}
                    onClick={() => setFilter('multiple_choice')}
                >
                    Multiple Choice
                </button>
                <button
                    className={`${styles.filterButton} ${filter === 'open_ended' ? styles.activeFilter : ''}`}
                    onClick={() => setFilter('open_ended')}
                >
                    Open Ended
                </button>
            </div>

            {filteredQuestions.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No questions found.</p>
                    <Link to="/upload" className={styles.uploadButton}>
                        Upload a Question
                    </Link>
                </div>
            ) : (
                <div className={styles.content}>
                    <div className={styles.questionsList}>
                        {filteredQuestions.map((question) => (
                            <div
                                key={question.id}
                                className={`${styles.questionCard} ${activeQuestion && activeQuestion.id === question.id ? styles.activeCard : ''}`}
                                onClick={() => setActiveQuestion(question)}
                            >
                                <div className={styles.questionCardHeader}>
                                    <span className={styles.questionType}>
                                        {question.question_type === 'multiple_choice' ? 'Multiple Choice' : 'Open Ended'}
                                    </span>
                                    <span className={styles.questionDate}>
                                        {formatDate(question.created_at)}
                                    </span>
                                </div>
                                <div className={styles.questionText}>
                                    {question.question_text.length > 100
                                        ? `${question.question_text.substring(0, 100)}...`
                                        : question.question_text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.questionDetail}>
                        {activeQuestion ? (
                            <div className={styles.detailContent}>
                                <div className={styles.detailHeader}>
                                    <h2>Question Details</h2>
                                    <button
                                        className={styles.deleteButton}
                                        onClick={() => handleDeleteQuestion(activeQuestion.id)}
                                    >
                                        Delete
                                    </button>
                                </div>

                                <div className={styles.imageContainer}>
                                    <img
                                        src={`/${activeQuestion.image_path}`}
                                        alt="Question screenshot"
                                        className={styles.questionImage}
                                    />
                                </div>

                                <div className={styles.questionInfo}>
                                    <h3>Question:</h3>
                                    <p>{activeQuestion.question_text}</p>
                                </div>

                                {activeQuestion.question_type === 'multiple_choice' && activeQuestion.options && (
                                    <div className={styles.questionInfo}>
                                        <h3>Options:</h3>
                                        <ul className={styles.optionsList}>
                                            {Object.entries(activeQuestion.options).map(([key, value]) => (
                                                <li
                                                    key={key}
                                                    className={key === activeQuestion.answer ? styles.correctOption : ''}
                                                >
                                                    <strong>{key}:</strong> {value}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className={styles.questionInfo}>
                                    <h3>Answer:</h3>
                                    <div className={styles.answer}>
                                        {activeQuestion.question_type === 'multiple_choice' ? (
                                            <p>
                                                <strong>Option {activeQuestion.answer}:</strong>{' '}
                                                {activeQuestion.options && activeQuestion.options[activeQuestion.answer]}
                                            </p>
                                        ) : (
                                            <p>{activeQuestion.answer}</p>
                                        )}
                                    </div>
                                </div>

                                {activeQuestion.explanation && (
                                    <div className={styles.questionInfo}>
                                        <h3>Explanation:</h3>
                                        <p className={styles.explanation}>{activeQuestion.explanation}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className={styles.noSelection}>
                                <p>Select a question to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionHistoryPage;

import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from './UploadQuestionPage.module.css';

const UploadQuestionPage = () => {
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // State management
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [credits, setCredits] = useState(user?.credits || 0);
    const [dragActive, setDragActive] = useState(false);

    // Handle file input change
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        handleFile(selectedFile);
    };

    // Process the selected file
    const handleFile = (selectedFile) => {
        if (selectedFile) {
            // Check file type
            const validTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/jpg'];
            if (!validTypes.includes(selectedFile.type)) {
                setError('Please upload a valid image file (JPEG, PNG, HEIC)');
                return;
            }

            // Check file size (max 10MB)
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError('File size should be less than 10MB');
                return;
            }

            setFile(selectedFile);
            setError(null);

            // Create preview URL
            const previewUrl = URL.createObjectURL(selectedFile);
            setPreview(previewUrl);
        }
    };

    // Handle drag events
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    // Handle drop event
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    // Handle file upload button click
    const handleFileUploadClick = () => {
        fileInputRef.current.click();
    };

    // Reset the form
    const handleReset = () => {
        setFile(null);
        setPreview(null);
        setError(null);
        setSuccess(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setError('Please select an image file');
            return;
        }

        if (credits <= 0) {
            setError('You do not have enough credits. Please purchase credits to continue.');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            // Add the required question_type field that your backend expects
            formData.append('question_type', 'multiple_choice');
            // You could make this a selectable option in your UI later

            console.log('Sending request with token:', token);
            console.log('FormData entries:');
            for (let [key, value] of formData.entries()) {
                console.log(key, ':', value instanceof File ? `File: ${value.name}, size: ${value.size}, type: ${value.type}` : value);
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/questions/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Do not set Content-Type, the browser will set it correctly with boundary
                },
                body: formData
            });

            console.log('Response status:', response.status);

            // Try to parse as JSON, but handle text responses too
            let data;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                data = await response.json();
            } else {
                data = { detail: await response.text() };
            }

            console.log('Response data:', data);

            if (!response.ok) {
                throw new Error(
                    typeof data.detail === 'string'
                        ? data.detail
                        : (data.detail && Array.isArray(data.detail) && data.detail.length > 0)
                            ? data.detail[0].msg || JSON.stringify(data.detail)
                            : 'Failed to upload question'
                );
            }

            setSuccess('Question uploaded successfully!');
            setCredits(prev => prev - 1); // Assuming each question costs 1 credit

            // Navigate to question detail page after a brief delay
            setTimeout(() => {
                navigate(`/questions/${data.id}`);
            }, 2000);
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.message || 'An error occurred during upload');
        } finally {
            setLoading(false);
        }
    };

    const handleCameraCapture = async () => {
        try {
            // Check if mediaDevices is supported
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setError('Camera access is not supported in your browser');
                return;
            }

            const stream = await navigator.mediaDevices.getUserMedia({ video: true });

            // Create video element to show the stream
            const videoElement = document.createElement('video');
            videoElement.srcObject = stream;
            videoElement.play();

            // Take a snapshot after 1 second
            setTimeout(() => {
                // Create a canvas element to capture the image
                const canvas = document.createElement('canvas');
                canvas.width = videoElement.videoWidth;
                canvas.height = videoElement.videoHeight;

                // Draw the video frame to the canvas
                const ctx = canvas.getContext('2d');
                ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

                // Convert canvas to file
                canvas.toBlob((blob) => {
                    // Create file from blob
                    const capturedFile = new File([blob], 'captured_image.png', { type: 'image/png' });

                    // Stop all video tracks
                    stream.getTracks().forEach(track => track.stop());

                    // Process the captured file
                    handleFile(capturedFile);
                }, 'image/png');
            }, 1000);

            // Removed the line: console.log('Upload successful, response data:', data);
            // as data is not defined in this context
        } catch (err) {
            setError(`Failed to access camera: ${err.message}`);
        }
    };;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Upload Exam Question</h1>

            <div className={styles.creditsInfo}>
                <p>Available Credits: <span className={styles.creditCount}>{credits}</span></p>
                {credits <= 3 && (
                    <button
                        className={styles.buyCreditsButton}
                        onClick={() => navigate('/credits')}
                    >
                        Buy Credits
                    </button>
                )}
            </div>

            {error && (
                <div className={styles.errorMessage}>
                    {typeof error === 'object' ? error.message || JSON.stringify(error) : error}
                </div>
            )}

            {success && (
                <div className={styles.successMessage}>
                    {success}
                </div>
            )}

            <form
                className={styles.uploadForm}
                onSubmit={handleSubmit}
                onDragEnter={handleDrag}
            >
                <div
                    className={`${styles.dropzone} ${dragActive ? styles.active : ''} ${preview ? styles.hasPreview : ''}`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/jpeg,image/png,image/heic,image/heif,image/jpg"
                        className={styles.fileInput}
                    />

                    {preview ? (
                        <div className={styles.previewContainer}>
                            <img src={preview} alt="Question preview" className={styles.imagePreview} />
                            <button
                                type="button"
                                className={styles.removeButton}
                                onClick={handleReset}
                            >
                                Remove
                            </button>
                        </div>
                    ) : (
                        <div className={styles.uploadPrompt}>
                            <div className={styles.uploadIcon}>
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 16L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M9 11L12 8 15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M20 16.7428C21.2215 15.734 22 14.2079 22 12.5C22 9.46243 19.5376 7 16.5 7C16.2815 7 16.0771 6.886 15.9661 6.69774C14.6621 4.48484 12.2544 3 9.5 3C5.35786 3 2 6.35786 2 10.5C2 12.5661 2.83545 14.4371 4.18695 15.7935" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <p className={styles.uploadText}>
                                Drag & drop your exam question image here<br />
                                or click to browse files
                            </p>
                            <button
                                type="button"
                                className={styles.browseButton}
                                onClick={handleFileUploadClick}
                            >
                                Browse Files
                            </button>
                            <button
                                type="button"
                                className={styles.cameraButton}
                                onClick={handleCameraCapture}
                            >
                                Take Photo
                            </button>
                        </div>
                    )}
                </div>

                <div className={styles.helpText}>
                    <p>Supported file types: JPEG, PNG, HEIC (Max 10MB)</p>
                    <p>Each question upload costs 1 credit</p>
                </div>

                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={!file || loading || credits <= 0}
                >
                    {loading ? 'Processing...' : 'Upload Question'}
                </button>
            </form>

            <div className={styles.examples}>
                <h2>Getting the best results:</h2>
                <ul>
                    <li>Make sure the image is clear and well-lit</li>
                    <li>Ensure the entire question is visible in the frame</li>
                    <li>For math problems, include all symbols and equations</li>
                    <li>For multiple choice, include all answer options</li>
                </ul>
            </div>
        </div>
    );
};

export default UploadQuestionPage;
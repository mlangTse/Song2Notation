import React, { useState } from 'react';
import axios from 'axios';
import NotationViewer from './NotationViewer';

function FileUploader() {
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please upload a file first!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setLoading(true);
        setUploadProgress(0);

        try {
            const result = await axios.post("http://localhost:5000/process-audio", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                },
            });

            setResponse(result.data);
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Error processing the file. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Upload Audio File</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={loading}>
                {loading ? "Uploading..." : "Upload and Process"}
            </button>
            <div style={{ margin: '20px 0', height: '30px', width: '100%', background: '#f3f3f3' }}>
                <div
                    style={{
                        width: `${uploadProgress}%`,
                        height: '100%',
                        background: '#4caf50',
                        transition: 'width 0.2s',
                    }}
                />
            </div>
            {response && (
                <div>
                    <h3>Music Notation:</h3>
                    <NotationViewer musicxmlPath={response.musicxml_path} />
                </div>
            )}
        </div>
    );
}

export default FileUploader;
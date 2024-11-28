import React, { useState } from 'react';
import { processAudio } from '../services/api';

function FileUploader() {
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please upload a file first!");
            return;
        }

        try {
            const result = await processAudio(file);
            setResponse(result);
        } catch (error) {
            alert("Error uploading file. Please try again.");
        }
    };

    return (
        <div>
            <h2>Upload Audio File</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload and Process</button>
            {response && (
                <div>
                    <h3>Response:</h3>
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default FileUploader;
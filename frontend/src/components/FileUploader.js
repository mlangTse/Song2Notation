import React, { useState } from "react";
import { processAudio } from "../services/api";
import NotationViewer from "./NotationViewer";

function FileUploader() {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [musicXmlPath, setMusicXmlPath] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
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
      const response = await processAudio(formData, setUploadProgress);
      setMusicXmlPath(response.musicxml_path);
    } catch (error) {
      console.error("Error processing audio:", error);
      alert("Failed to process the file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Upload Your Song</h2>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload and Generate"}
      </button>
      {uploadProgress > 0 && (
        <div style={{ margin: "20px 0", width: "100%", background: "#f3f3f3" }}>
          <div
            style={{
              width: `${uploadProgress}%`,
              height: "10px",
              background: "#4caf50",
              transition: "width 0.2s",
            }}
          />
        </div>
      )}
      {musicXmlPath && (
        <div>
          <h3>Generated Musical Notation:</h3>
          <NotationViewer musicXmlPath={musicXmlPath} />
        </div>
      )}
    </div>
  );
}

export default FileUploader;
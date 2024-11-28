import axios from 'axios';

export const processAudio = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await axios.post("http://localhost:5000/process-audio", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error processing audio file:", error);
        throw error;
    }
};

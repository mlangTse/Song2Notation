import axios from "axios";

export const processAudio = async (formData, setUploadProgress) => {
  const response = await axios.post("http://54.252.148.37/process-audio", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      setUploadProgress(percentCompleted);
    },
  });
  return response.data;
};
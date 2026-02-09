import { useState } from "react";
import { backend, cloudinaryUpload } from "./api";
import "./App.css";

export default function App() {
  const [files, setFiles] = useState([]);
  const [stage, setStage] = useState("idle");
  const [uploadedCount, setUploadedCount] = useState(0);

  const handleFileSelect = (e) => {
    setFiles([...e.target.files]);
    setUploadedCount(0);
  };

  const uploadAllFiles = async () => {
    if (files.length === 0) return;

    for (const file of files) {
      await uploadSingleFile(file);
      setUploadedCount((prev) => prev + 1);
    }

    setStage("idle");
    setFiles([]);
  };

  const uploadSingleFile = async (file) => {
    setStage("uploading");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "audio_unsigned");

    const cloudinaryRes = await cloudinaryUpload.post(
      "/auto/upload",
      formData
    );

    setStage("registering");

    await backend.post("/file/register", {
      secure_url: cloudinaryRes.data.secure_url,
      public_id: cloudinaryRes.data.public_id
    });
  };

  return (
    <div className="page">
      <header>
        <h1>EchoFin Audio Upload</h1>
        <p>Upload multiple audio files safely</p>
      </header>

      <div className="card">
        <label className="file-drop">
          <input
            type="file"
            accept="audio/*"
            multiple
            onChange={handleFileSelect}
          />

          {files.length > 0 ? (
            <div>
              <strong>{files.length} file(s) selected</strong>
              <span>{uploadedCount} uploaded</span>
            </div>
          ) : (
            <span>Click to select audio files</span>
          )}
        </label>

        <button
          disabled={files.length === 0 || stage === "uploading"}
          onClick={uploadAllFiles}
        >
          Upload Files
        </button>
      </div>

      <div className="card status">
        <Status
          label="Uploading to Cloudinary"
          active={stage === "uploading"}
          done={uploadedCount > 0}
        />
        <Status
          label="Registering with backend"
          active={stage === "registering"}
          done={stage === "idle" && uploadedCount > 0}
        />
      </div>
    </div>
  );
}

function Status({ label, active, done }) {
  return (
    <div className={`status-row ${active ? "active" : ""}`}>
      <span className="dot">{done ? "✔" : active ? "…" : "○"}</span>
      <span>{label}</span>
    </div>
  );
}

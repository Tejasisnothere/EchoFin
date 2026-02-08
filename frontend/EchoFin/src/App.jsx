import { useState } from "react";
import { backend, cloudinaryUpload } from "./api";
import "./App.css";

export default function App() {
  const [file, setFile] = useState(null);
  const [stage, setStage] = useState("idle");
  const [fileId, setFileId] = useState(null);
  const [normalizedUrl, setNormalizedUrl] = useState(null);

  const uploadAudio = async () => {
    if (!file) return;

    setStage("uploading");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "audio_unsigned");

    const cloudinaryRes = await cloudinaryUpload.post(
      "/auto/upload",
      formData
    );

    setStage("registering");

    const backendRes = await backend.post("/file/register", {
      secure_url: cloudinaryRes.data.secure_url,
      public_id: cloudinaryRes.data.public_id
    });

    setFileId(backendRes.data.file_id);
    setStage("processing");
    pollStatus(backendRes.data.file_id);
  };

  const pollStatus = (id) => {
    const interval = setInterval(async () => {
      const res = await backend.get(`/file/${id}`);

      if (res.data.status === "completed") {
        setNormalizedUrl(res.data.normalized.url);
        setStage("completed");
        clearInterval(interval);
      }

      if (res.data.status === "failed") {
        setStage("failed");
        clearInterval(interval);
      }
    }, 2500);
  };

  return (
    <div className="page">
      <header>
        <h1>EchoFin Audio Processor</h1>
        <p>Upload, normalize, and process audio asynchronously</p>
      </header>

      <div className="card">
        <label className="file-drop">
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          {file ? (
            <div>
              <strong>{file.name}</strong>
              <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          ) : (
            <span>Click to select an audio file</span>
          )}
        </label>

        <button
          disabled={!file || stage !== "idle"}
          onClick={uploadAudio}
        >
          Upload & Process
        </button>
      </div>

      <div className="card status">
        <Status label="Uploading to Cloudinary" active={stage === "uploading"} done={stage !== "idle"} />
        <Status label="Registering with backend" active={stage === "registering"} done={["processing","completed"].includes(stage)} />
        <Status label="Normalizing audio" active={stage === "processing"} done={stage === "completed"} />
      </div>

      {stage === "completed" && (
        <div className="card result">
          <h3>Normalized Audio</h3>
          <audio controls src={normalizedUrl}></audio>
        </div>
      )}

      {stage === "failed" && (
        <div className="card error">
          Processing failed. Please try again.
        </div>
      )}
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

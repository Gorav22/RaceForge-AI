import React, { useState } from "react";

interface StatusResponse {
  status: string;
  output_url?: string;
}

interface RodinResponse {
  subscription_key: string;
  [key: string]: any;
}

const BACKEND_URL = "http://localhost:3000"; // change to deployed URL if needed

const Generate3DModel: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [modelUrl, setModelUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert("Please enter a text prompt!");
      return;
    }

    setLoading(true);
    setStatus("Sending text prompt to backend...");

    try {
      const res = await fetch(`${BACKEND_URL}/generate-text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data: RodinResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to start 3D generation");
      }

      const subscriptionKey = data.jobs.subscription_key;
      setStatus("3D model generation started...");

      // Poll for status
      let currentStatus = "pending";
      let outputUrl: string | null = null;

      

      if (outputUrl) {
        setModelUrl(outputUrl);
        setStatus("✅ Model generation complete!");
      }
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "50px auto", textAlign: "center" }}>
      <h2>🧠 Generate 3D Model from Text</h2>

      <textarea
        placeholder="Describe your 3D model (e.g., 'a futuristic flying car')"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{
          width: "100%",
          height: 100,
          padding: 10,
          fontSize: 16,
          borderRadius: 6,
          border: "1px solid #ccc",
        }}
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          marginTop: 16,
          padding: "10px 20px",
          background: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Processing..." : "Generate 3D Model"}
      </button>

      <p style={{ marginTop: 20, fontWeight: "bold" }}>{status}</p>

      {modelUrl && (
        <div style={{ marginTop: 20 }}>
          <p>✅ 3D Model Ready:</p>
          <a href={modelUrl} target="_blank" rel="noopener noreferrer">
            {modelUrl}
          </a>
          <iframe
            src={modelUrl}
            title="3D Model"
            style={{ width: "100%", height: "500px", border: "none" }}
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
};

export default Generate3DModel;

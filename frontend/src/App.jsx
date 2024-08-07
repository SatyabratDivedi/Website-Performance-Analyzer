import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./App.css";
import { FaSquareGithub, FaSquareXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";

const App = () => {
  const [url, setUrl] = useState("");
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMetrics(null);
    const toastId = toast.loading("Please Wait...");
    try {
      const res = await axios.post("https://website-performance-analyzer-backend.vercel.app/analyze", { url });
      console.log(res.data)
      setMetrics(res.data.data);
      toast.success(res.data.msg, { id: toastId });
    } catch (error) {
      setError("Error analyzing the website. Please try again.");
      toast.error(error.response.data.error, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='app'>
      <div className='header'>
        <a href='https://github.com/SatyabratDivedi' target="_blank">
          <FaSquareGithub style={{ transform: "translateY(5px)" }} />
        </a>
        <a href='https://linkedin.com/in/satyabrat-divedi-a3555a183' target="_blank">
          <FaLinkedin style={{ transform: "translateY(5px)" }} />
        </a>
        <a href='https://twitter.com/satyabratd5605' target="_blank">
          <FaSquareXTwitter style={{ transform: "translateY(5px)" }} />
        </a>
      </div>
      <h1 className='title'>SpeedX - Website Performance Analyzer</h1>
      <form className='form' onSubmit={handleSubmit}>
        <input type='text' value={url} onChange={(e) => setUrl(e.target.value)} placeholder='Enter website URL' className='input' />
        <button type='submit' className='button' disabled={loading} style={{ cursor: loading ? "wait" : "pointer" }}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>
      {error && <p className='error'>{error}</p>}
      {metrics && (
        <div className='metrics-card'>
          <h2>Performance Metrics</h2>
          <p>
            <strong>Page Load Time:</strong> {metrics.pageLoadTime} ms
          </p>
          <p>
            <strong>Total Request Size:</strong> {metrics.totalRequestSize} KB
          </p>
          <p>
            <strong>Number of Requests:</strong> {metrics.numberOfRequests}
          </p>
        </div>
      )}
    </div>
  );
};

export default App;

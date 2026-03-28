import { useState } from "react";
import { analyzeEmail } from "../services/api";
import ResultCard from "./ResultCard";

const EmailForm = () => {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    if (!email) return alert("Enter email!");

    try {
      const data = await analyzeEmail(email);
      setResult(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <textarea
        className="w-full border p-2"
        placeholder="Paste email here..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 mt-2"
      >
        Analyze
      </button>

      {result && <ResultCard data={result} />}
    </div>
  );
};

export default EmailForm;
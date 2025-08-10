import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAutoReview } from "../AutoReviewContext";

const RepoDetailsGitlab = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const { autoReview } = useAutoReview();

  const [repo, setRepo] = useState<any>(null);
  const [lines, setLines] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!name) return;

    const fetchRepoDetails = async () => {
      try {
        setLoading(true);
        const encodedName = encodeURIComponent(name);

        // Fetch repo details from GitLab backend route
        const res = await fetch(`/gitlab/api/repo/${encodedName}`);
        if (!res.ok) throw new Error("Failed to fetch repo details");
        const repoData = await res.json();
        setRepo(repoData);

        // GitLab default branch fallback
        const branch = repoData.default_branch || "main";

        // Fetch lines of code
        const linesRes = await fetch(`/gitlab/api/repo/${encodedName}/lines?branch=${branch}`);
        if (!linesRes.ok) throw new Error("Failed to fetch line count");
        const linesData = await linesRes.json();
        setLines(linesData.lines);

        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRepoDetails();
  }, [name]);

  if (loading) return <p>Loading repository details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!repo) return <p>No repository found</p>;

  const autoReviewEnabled = !!autoReview[repo.id];

  return (
    <div style={{ justifyItems: "left" }}>
      <button
        onClick={() => navigate("/repo?provider=gitlab")}
        style={{
          marginBottom: "20px",
          padding: "8px 16px",
          textAlign: "left",
          backgroundColor: "#ffffffff",
          color: "black",
          border: "1px solid black",
          borderRadius: "4px",
          cursor: "pointer",
          justifyItems: "start",
          display: "inline-block",
        }}
      >
        &larr; Back
      </button>

      <div
        style={{
          maxWidth: "600px",
          margin: "20px auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: 8,
        }}
      >
        <h2>{repo.name}</h2>
        {repo.description && <p style={{ fontStyle: "italic", color: "#555" }}>{repo.description}</p>}
        <p>
          <strong>Stars:</strong> {repo.star_count}
        </p>
        <p>
          <strong>Default Branch:</strong> {repo.default_branch || "main"}
        </p>
        <p>
          <strong>Lines of code in {repo.default_branch || "main"} branch:</strong> {lines !== null ? lines : "N/A"}
        </p>
        <p>
          <strong>Auto Review:</strong> {autoReviewEnabled ? "Enabled" : "Disabled"}
        </p>
      </div>
    </div>
  );
};

export default RepoDetailsGitlab;

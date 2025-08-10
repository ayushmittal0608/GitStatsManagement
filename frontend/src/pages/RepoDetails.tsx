import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAutoReview } from "../AutoReviewContext";
import { useSearchParams } from "react-router-dom";

const RepoDetailsPage = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();

  const [repo, setRepo] = useState<any>(null);
  const [lines, setLines] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const provider = searchParams.get("provider") as "github" | "gitlab" || "github";
  const { autoReview } = useAutoReview();

  useEffect(() => {
    if (!name) return;

    const fetchRepoDetails = async () => {
      try {
        setLoading(true);

        // fetch repo details
        const res = await fetch(`/${provider}/api/repo/${name}`);
        if (!res.ok) throw new Error("Failed to fetch repo details");
        const repoData = await res.json();
        setRepo(repoData);

        // fetch lines
        const linesRes = await fetch(`/${provider}/api/repo/${name}/lines?branch=${repoData.default_branch}`);
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
        onClick={() => navigate("/repo")}
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

      <div style={{ maxWidth: "600px", margin: "20px auto", padding: "20px", border: "1px solid #ccc", borderRadius: 8 }}>
        <h2>{repo.name}</h2>
        {repo.description && <p style={{ fontStyle: "italic", color: "#555" }}>{repo.description}</p>}
        <p><strong>Stars:</strong> {provider === "github" ? repo.stargazers_count : repo.star_count}</p>
        <p><strong>Default Branch:</strong> {repo.default_branch}</p>
        <p><strong>Lines of code in {repo.default_branch} branch:</strong> {lines !== null ? lines : "N/A"}</p>
        <p>
          <strong>Auto Review:</strong> {autoReviewEnabled ? "Enabled" : "Disabled"}
        </p>
      </div>
    </div>
  );
};

export default RepoDetailsPage;

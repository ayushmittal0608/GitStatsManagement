import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAutoReview } from "../AutoReviewContext";
import { useSearchParams } from "react-router-dom";

const Repo = () => {
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { autoReview, toggleAutoReview } = useAutoReview();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const provider = searchParams.get("provider") as "github" | "gitlab" || "github";

  useEffect(() => {
    fetch(`/${provider}/api/repos`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch repos");
        return res.json();
      })
      .then((data) => {
        setRepos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [provider]);

  if (loading) return <p>Loading repos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ justifyItems: "right" }}>
      <button
        onClick={() => navigate(`/account?provider=${provider}`)}
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
        Account Info &rarr;
      </button>
      <div>
        <h1>Your {provider === "github" ? "GitHub" : "GitLab"} Repositories</h1>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            display: "grid",
            gap: "16px",
            justifyItems: "start",
          }}
        >
          {repos.map((repo) => (
            <li key={`${repo.id}`}>
              <div
                style={{
                  border: "1px solid #ccc",
                  padding: "16px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  backgroundColor: "#fff",
                  width: "1000px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Link
                    to={`/repo/${provider}/${provider === "gitlab" ? encodeURIComponent(repo.path_with_namespace) : repo.name}?provider=${provider}`}
                    style={{
                      textDecoration: "none",
                      color: "#0366d6",
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}
                  >
                    {repo.name}
                  </Link>

                  <label
                    htmlFor={`auto-review-${repo.id}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#f0f0f0",
                      padding: "5px 10px",
                      borderRadius: "15px",
                      fontSize: "14px",
                      cursor: "pointer",
                      userSelect: "none",
                      gap: "6px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    Auto Review
                    <input
                      type="checkbox"
                      checked={!!autoReview[repo.id]}
                      onChange={() => toggleAutoReview(repo.id)}
                      id={`auto-review-${repo.id}`}
                      style={{ cursor: "pointer" }}
                    />
                  </label>
                </div>

                <p
                  style={{
                    marginTop: "8px",
                    color: "#555",
                    textAlign: "left",
                    fontStyle: repo.description ? "normal" : "italic",
                  }}
                >
                  {repo.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Repo;

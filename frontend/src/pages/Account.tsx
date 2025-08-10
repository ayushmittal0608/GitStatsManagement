import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAutoReview } from "../AutoReviewContext";
import { useSearchParams } from "react-router-dom";

interface UserProfile {
  login: string;
  name: string;
  public_repos: number;
  avatar_url: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { autoReview } = useAutoReview();
  const [searchParams] = useSearchParams();
  const provider = searchParams.get("provider") as "github" | "gitlab" || "github";
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("/auth/logout", { method: "POST" });
      localStorage.removeItem("accessToken");
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/${provider}/api/user`);
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data: UserProfile = await res.json();
        setProfile(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!profile) return <p>No profile data found</p>;

  const autoReviewCount = Object.values(autoReview).filter(Boolean).length;

  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
      <div
        style={{
          width: 400,
          height: 500,
          margin: "auto",
          marginLeft: "300px",
          padding: 20,
          border: "1px solid #ccc",
          borderRadius: 8,
          textAlign: "center",
        }}
      >
        <h2>GitHub Profile</h2>
        {profile.avatar_url && (
          <img
            src={profile.avatar_url}
            alt={`${profile.login} avatar`}
            style={{ width: 200, height: 200, borderRadius: "50%", marginBottom: 16 }}
          />
        )}
        <p style={{ fontSize: "18px" }}>
          <strong>Display Name:</strong> {profile.name || "N/A"}
        </p>
        <p style={{ fontSize: "18px" }}>
          <strong>Username:</strong> {profile.login}
        </p>
        <p style={{ fontSize: "18px" }}>
          <strong>Total Public Repositories:</strong> {profile.public_repos}
        </p>
        <p style={{ fontSize: "18px" }}>
          <strong>Total auto reviewer:</strong> {autoReviewCount}
        </p>
      </div>
      <button
        onClick={handleLogout}
        style={{
          marginBottom: "20px",
          padding: "8px 16px",
          textAlign: "left",
          height: 50,
          backgroundColor: "#ffffffff",
          color: "black",
          border: "1px solid black",
          borderRadius: "4px",
          cursor: "pointer",
          justifyItems: "right",
          justifyContent: "flex-end",
          display: "inline-block",
          marginLeft: "300px",
        }}
      >
        Logout &rarr;
      </button>
    </div>
  );
};

export default Profile;

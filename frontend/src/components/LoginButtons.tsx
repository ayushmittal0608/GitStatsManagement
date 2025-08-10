import React from "react";

interface Props {
    onLoginGithub: () => void;
    onLoginGitlab: () => void;
};

const LoginButtons: React.FC<Props> = ({
    onLoginGithub,
    onLoginGitlab,
}) => {
    return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "300px",
        margin: "40px auto",
      }}
    >
      <button
        onClick={onLoginGithub}
        style={{
          padding: "20px",
          fontSize: "1.5rem",
          fontWeight: "bold",
          backgroundColor: "#ffffffff",
          color: "black",
          border: "3px solid black",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Login with GitHub
      </button>

      <button
        onClick={onLoginGitlab}
        style={{
          padding: "20px",
          fontSize: "1.5rem",
          fontWeight: "bold",
          backgroundColor: "#ffffffff",
          color: "black",
          border: "3px solid black",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Login with GitLab
      </button>

      
    </div>
  );
}

export default LoginButtons;
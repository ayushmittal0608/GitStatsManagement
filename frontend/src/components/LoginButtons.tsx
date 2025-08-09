import React from "react";

interface Props {
    onLoginGithub: () => void;
    onLoginGitlab: () => void;
    onLoginBitbucket: () => void;
};

const LoginButtons: React.FC<Props> = ({
    onLoginGithub,
    onLoginGitlab,
    onLoginBitbucket,
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
          backgroundColor: "#24292e",
          color: "white",
          border: "none",
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
          backgroundColor: "#fc6d26",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Login with GitLab
      </button>

      <button
        onClick={onLoginBitbucket}
        style={{
          padding: "20px",
          fontSize: "1.5rem",
          fontWeight: "bold",
          backgroundColor: "#205081",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Login with Bitbucket
      </button>
    </div>
  );
}

export default LoginButtons;
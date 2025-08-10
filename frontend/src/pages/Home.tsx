import LoginButtons from '../components/LoginButtons'

const Home = () => {
  const handleGithubLogin = () => {
    const clientId = "Ov23lirJKX7q8CuhNstD";
    const redirectUri = encodeURIComponent("https://crispy-waffle-qrvgxpgj5w4hxv7r-5000.app.github.dev/github/auth/github/callback");
    const scope = "read:user user:email";
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&login`;
    window.location.href = githubAuthUrl;
  }

  const handleGitlabLogin = () => {
    const clientId = "22d1b46af9ef1be2b4d3d85a7d57b1821514db93252e5429bb2448c704f25853";
    const redirectUri = encodeURIComponent("https://crispy-waffle-qrvgxpgj5w4hxv7r-5000.app.github.dev/gitlab/auth/gitlab/callback");
    const scope = encodeURIComponent("read_user api");
    const gitlabAuthUrl = `https://gitlab.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&prompt=login`;
    window.location.href = gitlabAuthUrl;
  }

  return (
      <div style={{
        border: "3px solid black",
        padding: "30px",
        width: "700px"
      }}>
        <h2>Login with:</h2>
        <LoginButtons
          onLoginGithub={handleGithubLogin}
          onLoginGitlab={handleGitlabLogin}
        />
      </div>
  )
}

export default Home


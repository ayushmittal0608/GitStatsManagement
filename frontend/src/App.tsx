import { Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./pages/Home"
import Repository from "./pages/Repository"
import RepoDetails from "./pages/RepoDetails"
import Account from "./pages/Account"
import RepoDetailsGitlab from "./pages/RepoDetailsGitlab";

function App() {
  return (
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/repo' element={<Repository />} />
        <Route path='/repo/github/:name' element={<RepoDetails />} />
        <Route path='/repo/gitlab/:name' element={<RepoDetailsGitlab/>} />
        <Route path='/account' element={<Account />} />
      </Routes>
  );
}

export default App

import { useContext, useState } from "react";
import "../App.css";
import socket from "../socket.js";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";

function LoginForm() {

  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let [error, setError] = useState("");
  let { saveJwtToken, setLoggedIn, saveUser, setUser } = useContext(AppContext);

  let navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!username || !password) {
      setError("All fields are required.");
    }
    else {
      setError("")
      let response = await fetch("https://chatter-backend-production-1d5f.up.railway.app/login", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      let result = await response.json();

      if (result.success) {
        const sessionID = localStorage.getItem("sessionID");

        if (!socket.connected) {
          socket.auth = { sessionID, username };
          socket.connect();
        }
        
        socket.emit("login", { id: result.user.id });

        saveJwtToken(result.token);
        saveUser(result.user);
        setUser(result.user);
        setLoggedIn(true);
        navigate("/");
      }
      else {
        setError(result.message);
      }
    }
  }

  return (
    <div className="flex flex-col w-full justify-between h-full items-center gap-20">
      <div className="flex bg-(--side-bar-bg) justify-center gap-10 w-full p-5 text-[30px] text-(--side-bar-color)">
        <div className="flex justify-center">Chatter</div>
        <img className="w-[50px] flex" src="/chat-icon.png" alt="Chatter icon" />
      </div>
      <div className="flex flex-col text-(--side-bar-color) items-center rounded-[50px] bg-(--side-bar-bg) gap-10w w-2/5 p-10">
        <h2 className="text-[34px]">Log in to Chatter</h2>
        <form className="flex flex-col items-center w-full gap-10 text-[20px]">
          <div className="flex w-9/10 justify-between items-center gap-10">
            <label htmlFor="username">Username:</label>
            <input
              className="text-[18px] border-b-1 b-none outline-none"
              name="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              type="text"
            />
          </div>
          <div className="flex w-9/10 justify-between items-center gap-10">
            <label htmlFor="password">Password:</label>
            <input
              className="text-[18px] border-b-1 b-none outline-none"
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
            />
          </div>
          <button onClick={handleSubmit} className="b-none py-[5px] bg-[gray] w-[120px] self-center rounded-[20px] ">Log In</button>
        </form>
        <Link to="/signup">Don't have an account? Sign Up</Link>
        {
          error &&
          <div className="error">{error}</div>
        }
      </div>
      <div className="flex flex-col bg-(--side-bar-bg) gap-1 items-center w-full p-5 text-[16px]">
        <div className="text-[24px] flex justify-center">Copyright &copy; 2025 Chatter</div>
        <a href="https://www.flaticon.com/free-icons/chat-app" target="_blank" title="chat app icons">Chat app icons created by Bahu Icons - Flaticon</a>
      </div>
    </div>

  )
}

export default LoginForm;

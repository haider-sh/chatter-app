import { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

function SignupForm() {
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let [confirmPassword, setConfirmPassword] = useState("");
  let [error, setError] = useState("");

  let navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!username || !password || !confirmPassword) {
      setError("All fields are required.");
    }
    else if (password !== confirmPassword) {
      setError("Passwords do not match.");
    }
    else {
      setError("");

      let response = await fetch("https://chatter-backend-production-1d5f.up.railway.app/signup", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      let result = await response.json();

      if (result.success) {
        navigate("/login");
      }
      else {
        setError(result.message);
      }
    };
  }

  return (
    <div className="flex flex-col w-full justify-between h-min items-center gap-20">
      <div className="flex bg-(--side-bar-bg) justify-center gap-10 w-full p-5 text-[30px] text-(--side-bar-color)">
        <div className="flex justify-center">Chatter</div>
        <img className="w-[50px] flex" src="/chat-icon.png" alt="Chatter icon" />
      </div>
      <div className="flex flex-col text-(--side-bar-color) items-center rounded-[50px] box-border bg-(--side-bar-bg) gap-10 w-2/5 p-10 ">
        <h2 className="text-[34px]">Sign up for Chatter</h2>
        <form className="flex flex-col items-center w-full gap-10 text-[20px]">
          <div className="flex w-9/10 justify-between items-center gap-10">
            <label htmlFor="username">Username:</label>
            <input
              className="text-[18px] border-b-1 b-none outline-none"
              name="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="flex w-9/10 justify-between items-center gap-10">
            <label htmlFor="password">Password:</label>
            <input
              className="text-[18px] border-b-1 b-none outline-none"
              name="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="flex w-9/10 justify-between items-center gap-10">
            <label htmlFor="confirmpassword">Confirm Password:</label>
            <input
              className="text-[18px] border-b-1 b-none outline-none"
              name="confirmpassword"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>
          <button onClick={handleSubmit} className="b-none py-[5px] bg-[gray] w-[120px] self-center rounded-[20px] ">Sign Up</button>
        </form>
        {
          error &&
          <div className="error">{error}</div>
        }
      </div>
      <div className="flex flex-col bg-(--side-bar-bg) gap-1 items-center w-full p-5 text-[16px]">
        <div className="text-[24px] flex justify-center">Copyright &copy; 2025 Chatter</div>
        <a href="https://www.flaticon.com/free-icons/chat-app" target="_blank" title="chat app icons">Chat app icons created by Bahu Icons - Flaticon</a>      </div>
    </div>
  )
}

export default SignupForm

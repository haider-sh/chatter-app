import { useContext, useEffect, useState } from "react";
import "../App.css";
import { AppContext } from "../AppContext";
import Friendbox from "./Friendbox";
import Userbox from "./Userbox";

function Friend() {
  let [error, setError] = useState("");
  let [userError, setUserError] = useState("");
  let [onlineError, setOnlineError] = useState("");
  let [search, setSearch] = useState("");
  let [searchUser, setSearchUser] = useState("");
  let [users, setUsers] = useState([]);
  let [onlineUsers, setOnlineUsers] = useState([]);

  let { friends, setFriends } = useContext(AppContext);

  async function getFriends() {
    const response = await fetch("https://chatter-backend-production-1d5f.up.railway.app/friends",
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    const { success, data, message } = await response.json();

    if (!success) {
      console.log(message);
      setError(message);
      return;
    }

    setFriends(data);
    setError("");
  }

  async function getUsers() {
    const response = await fetch("https://chatter-backend-production-1d5f.up.railway.app/friends/users",
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    const { success, data, message } = await response.json();

    if (!success) {
      console.log(message);
      setUserError(message);
      return;
    }

    setUsers(data);
    setUserError("");
  }

  async function getOnlineUsers() {
    const response = await fetch("https://chatter-backend-production-1d5f.up.railway.app/friends/online",
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    const { success, data, message } = await response.json();

    if (!success) {
      console.log(message);
      setOnlineError(message);
      return;
    }

    setOnlineUsers(data);
    setOnlineError("");
  }

  useEffect(() => {
    getFriends();
    getOnlineUsers();
    getUsers();
  }, []);

  async function searchFriend() {
    const response = await fetch(`https://chatter-backend-production-1d5f.up.railway.app/friends?search=${search}`,
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    const { success, data, message } = await response.json();
    setSearch("");

    if (!success) {
      console.log(message);
      setError(message);
      return;
    }

    setFriends(data);
    setError("");
  }

  async function searchUsers() {
    const response = await fetch(`https://chatter-backend-production-1d5f.up.railway.app/friends/users?search=${searchUser}`,
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    const { success, data, message } = await response.json();
    setSearchUser("");

    if (!success) {
      console.log(message);
      setUserError(message);
      return;
    }

    setUsers(data);
    setUserError("");
  }

  return (
    <div className="flex h-screen bg-(--color-bg) text-(--color-text) basis-4/5 box-border">
      <div className="flex flex-col basis-1/3">
        <div className="basis-1/9 grow-0 shrink-0 border-dotted border-[gray] border-r-1 flex items-center border-b-1 w-full flex gap-5 px-5">
          <input
            className="border-dotted border-[gray] outline-none rounded-[10px] w-9/10 p-1 px-2 border-1 text-(--color-text) "
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search your friends"
          />
          <button onClick={searchFriend} className="text-[gray]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search-icon lucide-search"><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></svg>
          </button>
        </div>
        <div className="flex grow-0 text-[gray] h-min w-full flex-col border-dotted border-r-1">
          <div className="font-semibold text-(--color-text) w-full border-dotted border-[gray] box-border border-b-1 flex items-center justify-between p-2 px-4">
            <button onClick={getFriends} className="hover:cursor-pointer hover:text-(--color-accent-hover)">All Friends</button>
          </div>
          <div className="flex flex-col h-[500px] overflow-y-auto">
            {
              error &&
              <div className="flex justify-center w-full text-[18px] py-4 font-semibold">{error}</div>
            }
            {
              !error &&
              friends?.map(friend => (
                <Friendbox id={friend.id} username={friend.username} />
              )
              )
            }
          </div>
        </div>
        <div>
        </div>
      </div>
      <div className="flex basis-2/3">
        <div className="flex flex-col basis-1/2">
          <div className="basis-1/9 grow-0 shrink-0 border-dotted border-[gray] border-r-1 flex items-center border-b-1 w-full flex gap-5 px-5">
            <input
              className="border-dotted border-[gray] outline-none rounded-[10px] w-9/10 p-1 px-2 border-1 text-(--color-text) "
              type="text"
              value={searchUser}
              onChange={e => setSearchUser(e.target.value)}
              placeholder="Search users"
            />
            <button onClick={searchUsers} className="text-[gray]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search-icon lucide-search"><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></svg>
            </button>
          </div>
          <div className="flex grow-0 text-[gray] h-min w-full flex-col border-dotted border-r-1">
            <div className="font-semibold text-(--color-text) w-full border-dotted border-[gray] box-border border-b-1 flex items-center justify-between p-2 px-4">
              <button onClick={getUsers} className="hover:cursor-pointer hover:text-(--color-accent-hover)">Find New Friends</button>
            </div>
            <div className="flex flex-col h-[500px] overflow-y-auto">
              {
                userError &&
                <div className="flex justify-center w-full text-[18px] py-4 font-semibold">{userError}</div>
              }
              {
                !userError &&
                users?.map(user => (
                  <Userbox id={user.id} username={user.username} />
                )
                )
              }
            </div>
          </div>
          <div>
          </div>
        </div>
        <div className="flex flex-col basis-1/2">
          <div className="basis-1/9 grow-0 shrink-0 border-dotted border-[gray] border-r-1 flex items-center border-b-1 w-full flex gap-5 px-5">
            <h1 className="text-(--color-text) text-[26px] font-semibold ">Online Friends</h1>
          </div>
          <div className="flex flex-1 h-[500px] flex-col ">
            {
              onlineError &&
              <div className="flex justify-center w-full text-(--color-text) text-[18px] py-4 font-semibold">{onlineError}</div>
            }
            {
              !onlineError &&
              onlineUsers.map(user => (
                <div className="flex w-full box-border border-b-1 border-dotted py-4 border-[gray]">
                  <div className="flex basis-1/5 grow-0 justify-center p-2 box-border">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="fill-(--color-text)" width="36" viewBox="0 0 640 640"><path d="M320 312C386.3 312 440 258.3 440 192C440 125.7 386.3 72 320 72C253.7 72 200 125.7 200 192C200 258.3 253.7 312 320 312zM290.3 368C191.8 368 112 447.8 112 546.3C112 562.7 125.3 576 141.7 576L498.3 576C514.7 576 528 562.7 528 546.3C528 447.8 448.2 368 349.7 368L290.3 368z" /></svg>
                  </div>
                  <div className="flex flex-col w-full px-3">
                    <div className="font-semibold text-[18px] text-(--color-text)">
                      {user.username}
                    </div>
                    <div className="text-[gray] ">
                      • Online
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div >
  )
}

export default Friend
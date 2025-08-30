import { useContext, useEffect, useState } from "react";
import "../App.css";
import Chat from "./Chat";
import ChatBox from "./ChatBox";
import { AppContext } from "../AppContext";

function Conversations() {

  let [error, setError] = useState("");
  let [search, setSearch] = useState("");
  let [selected, setSelected] = useState("");
  let [selectedUser, setSelectedUser] = useState(null);

  let { chats, setChats } = useContext(AppContext);

  async function getChats() {
    const response = await fetch("https://chatter-backend-production-1d5f.up.railway.app/chats",
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

    setChats(data);
    setError("");
  }

  useEffect(() => {
    getChats();
  }, [setChats]);

  function handleChatClick(id, user) {
    return () => {
      setSelected(id);
      setSelectedUser(user);
    }
  }

  async function searchChat() {
    const response = await fetch(`https://chatter-backend-production-1d5f.up.railway.app/chats?search=${search}`,
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

    setChats(data);
    setError("");
  }

  async function newChat() {
    const response = await fetch(`https://chatter-backend-production-1d5f.up.railway.app/chats/new`,
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

    setChats(data);
    setError("");
  }

  return (
    <div className="flex flex-col bg-(--color-bg) text-(--color-text) h-screen basis-4/5 box-border">
      <div className="basis-1/9 grow-0 shrink-0 border-dotted border-[gray] flex items-center border-b-1 w-full gap-5 px-5">
        <input
          className="border-dotted border-[gray] outline-none rounded-[10px] w-4/5 p-1 px-2 border-1 text-(--color-text)"
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Type to search"
        />
        <button onClick={searchChat} className="text-[gray]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search-icon lucide-search"><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></svg>
        </button>
      </div>
      <div className="flex text-[gray] w-full basis-8/9 box-border">
        <div className="flex basis-1/3 flex-col border-dotted border-r-1">
          <div className="font-semibold text-(--color-text) w-full border-dotted border-[gray] box-border border-b-1 flex items-center justify-between p-2 px-4">
            <button onClick={getChats} className="hover:cursor-pointer hover:text-(--color-accent-hover)">All Conversations</button>
            <button onClick={newChat} className="p-1 px-4 box-border bg-(--color-button) hover:cursor-pointer hover:text-(--color-accent-hover) text-[12px] ">NEW MESSAGE</button>
          </div>
          <div className="flex flex-col h-[500px] overflow-y-auto">
            {
              error &&
              <div className="flex justify-center w-full text-[18px] py-4 font-semibold">{error}</div>
            }
            {
              !error &&
              chats?.map(chat => (
                <ChatBox
                  key={chat.id}
                  id={chat.id ? chat.id : null}
                  recipient={chat.recipient}
                  setSelected={handleChatClick}
                  title={chat.recipient.username}
                  message={chat.messages ? chat.messages[chat.messages.length - 1] : null}
                  unread={chat.unread}
                />  
              )
              )
            }
          </div>
        </div>
        <Chat id={selected} recipient={selectedUser} />
      </div>
      <div>
      </div>
    </div>
  )
}

export default Conversations
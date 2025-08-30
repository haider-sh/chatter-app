import "../App.css";
import { useContext, useEffect, useState } from "react";
import ChatBox from "./ChatBox";
import { AppContext } from "../AppContext";
import GroupChat from "./GroupChat";
import socket from "../socket";

function Groups() {
  let [error, setError] = useState("");
  let [search, setSearch] = useState("");
  let [selected, setSelected] = useState("");
  let [groupName, setGroupName] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  let { groups, setGroups } = useContext(AppContext);

  async function getGroups() {
    const response = await fetch("https://chatter-backend-production-1d5f.up.railway.app/groups",
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

    setGroups(data);
    setError("");
  }

  useEffect(() => {
    function handleNewGroup({ id, name }) {
      setGroups(groups => (
        [
          { id, name },
          ...groups
        ]
      ));
    }

    socket.on("new group", handleNewGroup);

    getGroups();

    return () => socket.off("new group", handleNewGroup);
  }, []);

  function handleGroupClick(id) {
    return () => {
      setSelected(id);
    }
  }

  async function searchGroup() {
    const response = await fetch(`https://chatter-backend-production-1d5f.up.railway.app/groups?search=${search}`,
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

    setGroups(data);
    setError("");
  }

  async function handlePopupSubmit() {
    if (!groupName) return;
    socket.emit("create group", { name: groupName })
    setShowPopup(false);
    setGroupName("");
  }

  function handlePopupClose() {
    setGroupName("");
    setShowPopup(false);
  }

  return (
    <div className="flex flex-col bg-(--color-bg) text-(--color-text) h-screen basis-4/5 box-border">
      <div className="basis-1/9 grow-0 shrink-0 border-dotted border-[gray] flex items-center border-b-1 w-full flex gap-5 px-5">
        <input
          className="border-dotted border-[gray] outline-none rounded-[10px] w-4/5 p-1 px-2 border-1 text-(--color-text) "
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Type to search"
        />
        <button onClick={searchGroup} className="text-(--color-text)">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search-icon lucide-search"><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></svg>
        </button>
      </div>
      <div className="flex flex-1 text-[gray] w-full basis-8/9 box-border">
        <div className="flex grow-0 h-min basis-1/3 flex-col border-dotted border-r-1">
          <div className="font-semibold text-(--color-text) w-full border-dotted border-[gray] box-border border-b-1 flex items-center justify-between p-2 px-4">
            <button onClick={getGroups} className="hover:cursor-pointer hover:text-(--color-accent-hover)">All Groups</button>
            <button onClick={() => setShowPopup(true)} className="bg-(--color-button) p-1 px-4 box-border text-(--color-text) hover:cursor-pointer hover:text-(--color-accent-hover) text-[12px] ">NEW GROUP</button>
          </div>
          {showPopup && (
            <div className="fixed w-[360px] h-[220px] bg-(--color-button) text-(--color-text) rounded-[20px] p-2 shadow-xl shadow-[0 2px 10px rgba(0, 0, 0, 0.2)] box-border m-auto inset-0 flex items-center justify-center">
              <div className="flex items-center justify-evenly flex-col gap-4 h-full w-full">
                <h2 className="text-[22px] font-semibold ">Create Group</h2>
                <div className="flex gap-2 justify-evenly w-full items-center ">
                  <label className="font-medium" htmlFor="group">Group Name:</label>
                  <input
                    className="border-b-1 border-(--color-text-secondary) border-dotted p-1 outline-none"
                    type="text"
                    name="group"
                    value={groupName}
                    onChange={e => setGroupName(e.target.value)}
                  />
                </div>
                <div className="flex gap-10 ">
                  <button onClick={handlePopupClose} className="bg-(--color-bg-secondary) font-medium p-1 w-20 border-dotted border-[gray] rounded-full border-1 cursor-pointer">Close</button>
                  <button onClick={handlePopupSubmit} className="bg-(--color-bg-secondary) font-medium p-1 w-20 border-dotted border-[gray] rounded-full border-1 cursor-pointer">Create</button>
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col h-[80vh] overflow-y-auto">
            {
              error &&
              <div className="flex justify-center w-full text-[18px] py-4 font-semibold">{error}</div>
            }
            {
              !error &&
              groups?.map(group => (
                <ChatBox
                  key={group.id}
                  id={group.id ? group.id : null}
                  recipient={group.recipient}
                  setSelected={handleGroupClick}
                  title={group.name}
                  message={group.messages ? group.messages[group.messages.length - 1]: null}
                  unread={group.unread}
                />
              )
              )
            }
          </div>
        </div>
        <GroupChat id={selected} setSelected={setSelected} />
      </div>
      <div>
      </div>
    </div>
  )
}

export default Groups;
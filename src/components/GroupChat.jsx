import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react"
import { format } from "date-fns";
import { AppContext } from "../AppContext";
import socket from "../socket";
import MemberPopup from "./MemberPopup";
import EmojiPicker from "emoji-picker-react";

function GroupChat({ id, setSelected }) {
  let [message, setMessage] = useState("");
  let [text, setText] = useState("");
  let [showPopup, setShowPopup] = useState(false);
  let [confirmPopup, setConfirmPopup] = useState(false);
  let [searchUser, setSearchUser] = useState("");
  let [searchedUsers, setSearchedUsers] = useState([]);
  let [searchMessage, setSearchMessage] = useState("");
  let [imageSelected, setImageSelected] = useState(false);
  let [imageUrl, setImageUrl] = useState("");
  let [image, setImage] = useState(null);
  let [emojiTab, setEmojiTab] = useState(false);

  let divRef = useRef(null);
  let newChatId = useRef(null);
  let textRef = useRef(null);
  let fileRef = useRef(null);

  let { user, groups, setGroups, messages, setMessages } = useContext(AppContext);

  function incrementUnreadCount(id, message, date) {
    setGroups(groups => groups.map(group => {
      if (group.id === id) {
        const newMessages = [...group.messages, { content: message, created_at: date }];
        return {
          ...group,
          messages: newMessages,
          unread: newMessages.length - group.messages.length + (group.unread ?? 0)
        }
      }
      return group;
    }));
  }

  function markAsRead(id) {
    setGroups(groups => groups.map(group => {
      if (group.id === id) {
        return { ...group, unread: 0 };
      }
      return group;
    }));
  }

  useLayoutEffect(() => {
    divRef.current?.scrollIntoView();
  }, [messages]);

  useEffect(() => {

    function handleNewMember({ id, name }) {
      setMessages(messages => (
        {
          ...messages,
          users: [
            ...messages.users,
            { user: { id, username: name } }
          ]
        }
      ));
    }
    socket.on("new member", handleNewMember);

    function handleNewMessage({ id, content, from, date, is_media }) {
      console.log("group text recieved from", id, "in", newChatId.current);
      if (newChatId.current === id) {
        setMessages(prev => ({
          ...prev,
          messages: [
            ...(prev.messages || []),
            {
              user: { username: from.username },
              user_id: from.id,
              created_at: date,
              content,
              is_media
            }
          ]
        }));
        setMessage("");

        setGroups(groups => groups.map(group => {
          if (group.id === id) {
            return { ...group, content: is_media ? "📷 Photo": content, created_at: date };
          }
          return group;
        }));
      }
      else incrementUnreadCount(id, is_media ? "📷 Photo" : content, date);
    }
    socket.on("group message", handleNewMessage);

    async function getMessages() {
      if (id === "") {
        setMessage("Select a group to start chattering.");
        setMessages([]);
        return;
      }

      const response = await fetch(`https://chatter-backend-production-1d5f.up.railway.app/groups/${id}`,
        {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      const { success, data, message } = await response.json();
      if (!success) {
        console.log(message);
        setMessage(message);
        return;
      }

      setMessages(data);
      setMessage("");
    }
    getMessages();
    newChatId.current = id ? id : newChatId.current;

    let currGroup = groups.find(group => group.id === id);
    if (currGroup && currGroup.unread) {
      markAsRead(id);
    }

    setImageSelected(false);
    return () => {
      socket.off("group message", handleNewMessage);
      socket.off("new member", handleNewMember);
    }
  }, [id]);

  function sendMessage() {
    if (!text && !imageSelected) return;
    if (imageSelected) {
      socket.emit("group image message", {
        groupId: id,
        image,
      });
      setImageSelected(false);
    }
    else {
      socket.emit("group message", {
        groupId: id,
        content: text,
      });
      setText("");
    }
  }

  async function searchUsers() {
    const response = await fetch(`https://chatter-backend-production-1d5f.up.railway.app/groups/${id}?search=${searchUser}`,
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    const { success, data, message } = await response.json();
    if (!success) {
      console.log(message);
      setSearchMessage(message);
      return;
    }

    setSearchedUsers(data);
    setSearchMessage("");
  }

  function handleTextChange(e) {
    setText(e.target.value);
    textRef.current = e.target.value;
  }

  async function leaveGroup() {
    const response = await fetch(`https://chatter-backend-production-1d5f.up.railway.app/groups/${id}/exit`,
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    const { success, data, message } = await response.json();
    if (!success) {
      console.log(message);
      return;
    }

    const newGroups = [...groups];
    const currChat = newGroups.find(chat => chat.id === id);
    console.log(currChat, newGroups.indexOf(currChat));
    newGroups.splice(newGroups.indexOf(currChat), 1);
    console.log("New chats:", newGroups);

    setConfirmPopup(false);
    setMessages("");
    setSelected("");
    setGroups(newGroups);
  }

  function handleFileClick() {
    fileRef.current?.click();
  }

  function handleEmojiClick(emojiData) {
    setText(text + emojiData.emoji);
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setImage(file);
    setImageSelected(true);
    setImageUrl(url);
  }

  return (
    <div className="flex flex-col h-full basis-2/3 box-border">
      <div className="flex w-full items-center justify-between border-b-1 box-border border-dotted border-[(--color-border)] p-2 px-4 text-(--color-text) font-semibold">
        {
          id ? messages.name : "Group"
        }
        <div className="flex items-center box-border gap-5">
          {
            messages.users?.map((user, inx) => {
              if (inx > 7) return null;
              return (<div className="rounded-full bg-(--color-button) text-[--color-text] p-2 px-4 ">
                {user.user.username.substr(0, 1)}
              </div>);
            })
          }
          {
            id &&
            <button onClick={() => setShowPopup(true)} className="cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-plus-icon lucide-circle-plus"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>
            </button>
          }
          {
            id &&
            <button onClick={() => setConfirmPopup(true)} className="cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out-icon lucide-log-out"><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /></svg>
            </button>
          }
          {
            confirmPopup &&
            <div className="fixed w-[420px] h-min bg-(--color-button) rounded-[20px] p-2 shadow-xl shadow-[0 2px 10px rgba(0, 0, 0, 0.2)] box-border m-auto inset-0 flex flex-col gap-5 text-[18px] items-center justify-center">
              Are you sure you want to exit this group?
              <div className="flex justify-center gap-10 text-[16px] w-full">
                <button onClick={() => setConfirmPopup(false)} className="bg-(--color-bg-secondary) font-medium p-1 w-20 border-dotted border-[gray] rounded-full border-1 cursor-pointer">No</button>
                <button onClick={leaveGroup} className="bg-(--color-bg-secondary) font-medium p-1 w-20 border-dotted border-[gray] rounded-full border-1 cursor-pointer">Yes</button>
              </div>
            </div>}
        </div>
      </div>
      {
        showPopup &&
        <MemberPopup
          id={id}
          searchUser={searchUser}
          setShowPopup={setShowPopup}
          setSearchUser={setSearchUser}
          searchUsers={searchUsers}
          searchedUsers={searchedUsers}
          setSearchedUsers={setSearchedUsers}
          searchMessage={searchMessage}
        />
      }
      <div className="flex flex-col h-[71vh] w-full box-border overflow-y-auto bg-(--color-bg-secondary)">
        {
          message &&
          <div className="flex w-full text-[gray] justify-center box-border p-4 font-semibold text-[20px]">{message}</div>
        }
        {
          !message &&
          messages.messages?.map(message => (
            <div className={`flex w-full box-border ${message.user_id === user.id ? "justify-end" : ""}`}>
              <div className="flex p-3 flex-col gap-2 grow-0">
                <div className="flex min-w-min gap-4 justify-between">
                  <div>
                    {message.user.username}
                  </div>
                  <div>
                    {format(message.created_at, "eee p")}
                  </div>
                </div>
                <div className={`${message.is_media ? "" : "bg-(--color-accent)"} break-all max-w-[360px] justify-center items-center rounded-[10px] p-3 text-(--color-text) font-medium text-[16px]`}>
                  {
                    message.is_media ?
                      <img src={message.content} alt="" />
                      :
                      message.content
                  }
                </div>
              </div>
            </div>
          ))
        }
        <div ref={divRef}></div>
      </div>
      <div className="absolute right-3 bottom-20">
        <EmojiPicker open={emojiTab} onEmojiClick={handleEmojiClick} height="320px" />
      </div>
      {
                imageSelected &&
                <div className="flex absolute bottom-0 right-40 w-[320px] py-2 justify-self-center ">
                    <img src={imageUrl} alt="Selected Image" />
                </div>
            }
      {
        id !== "" &&
        <div className="flex flex-1 w-full border-1 border-[gray] border-dotted items-center justify-evenly">
          <div className="basis-4/5">
            {
              !imageSelected &&
              <input
                className="w-full outline-none py-3 text-(--color-text)"
                type="text"
                value={text}
                onChange={handleTextChange}
                placeholder="Type a message..."
              />
            }
          </div>
          <button onClick={sendMessage} className="cursor-pointer hover:text-(--color-accent-hover)">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send-horizontal-icon lucide-send-horizontal"><path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" /><path d="M6 12h16" /></svg>
          </button>
          <input type="file" ref={fileRef} accept=".png, .jpg, .gif, .svg, .jpeg, .webp" onChange={handleFileChange} className="hidden" />
          <button onClick={handleFileClick} className="cursor-pointer hover:text-(--color-accent-hover)">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image-icon lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
          </button>
          <button onClick={() => setEmojiTab(!emojiTab)} className="cursor-pointer hover:text-(--color-accent-hover)">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-smile-plus-icon lucide-smile-plus"><path d="M22 11v1a10 10 0 1 1-9-10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" x2="9.01" y1="9" y2="9" /><line x1="15" x2="15.01" y1="9" y2="9" /><path d="M16 5h6" /><path d="M19 2v6" /></svg>
          </button>
        </div>
      }
    </div>
  )
}

export default GroupChat
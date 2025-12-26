import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react"
import { format } from "date-fns";
import { AppContext } from "../AppContext";
import socket from "../socket";
import EmojiPicker from "emoji-picker-react";

function Chat({ id, recipient }) {
    let [message, setMessage] = useState("");
    let [text, setText] = useState("");
    let [emojiTab, setEmojiTab] = useState(false);
    let [imageSelected, setImageSelected] = useState(false);
    let [imageUrl, setImageUrl] = useState("");
    let [image, setImage] = useState(null);
    let [chatId, setChatId] = useState(id);

    let divRef = useRef(null);
    let newChatId = useRef(null);
    let textRef = useRef(null);
    let fileRef = useRef(null);
    let imageRef = useRef(null);

    let { user, chats, setChats, messages, setMessages } = useContext(AppContext);

    function incrementUnreadCount(id, message, date) {
        console.log(id);
        setChats(chats => chats.map(chat => {
            console.log(chats); 
            if (chat.id === id) {
                const newMessages = [...chat.messages, { content: message, created_at: date }];
                return {
                    ...chat,
                    messages: newMessages,
                    unread: newMessages.length - chat.messages.length + (chat.unread ?? 0)
                }
            }
            return chat;
        }));
    }

    function markAsRead(id) {
        setChats(chats => chats.map(chat => {
            if (chat.id === id) {
                return { ...chat, unread: 0 };
            }
            return chat;
        }));
    }

    function handleEmojiClick(emojiData) {
        setText(text + emojiData.emoji);
    }

    useLayoutEffect(() => {
        divRef.current?.scrollIntoView();
    }, [messages]);

    useEffect(() => {
        function handleNewMessage({ id, content, from, date, is_media }) {
            console.log("text recieved from", id, "in", newChatId.current);
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

                setChats(chats => chats.map(chat => {
                    if (chat.id === id) {
                        console.log("updating..");
                        return { ...chat, content: is_media ? "📷 Photo" : content, created_at: date };
                    }
                    return chat;
                }));
            }
            else incrementUnreadCount(id, is_media ? "📷 Photo" : content, date);
        }
        socket.on("private message", handleNewMessage);

        function handleNewRoom({ id }) {
            setChatId(id);
            newChatId.current = id;
            console.log("new room created.");
            if (textRef.current) {
                socket.emit("private message", {
                    chatId: id,
                    content: textRef.current,
                    to: recipient.id
                });
                setText("");
                textRef.current = "";
                return;
            }
            if (imageRef.current) {
                socket.emit("image message", {
                    chatId: id,
                    image: imageRef.current,
                    to: recipient.id
                });
                setImage("");
                setImageSelected(false);
                imageRef.current = "";
                return;
            }
        }
        socket.on("new room", handleNewRoom);

        async function getMessages() {
            if (id === "") {
                setMessage("Select a chat to start chattering.");
                return;
            }
            if (!id) {
                setMessage("This is the beginning of the conversation between you and " + recipient.username);
                setMessages([]);
                return;
            }
            const response = await fetch(`https://chatter-backend-production-1d5f.up.railway.app/chats/${id}`,
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
        setChatId(id);
        setImageSelected(false);
        newChatId.current = id ? id : newChatId.current;

        let currChat = chats.find(chat => chat.id === id);
        if (currChat && currChat.unread) {
            markAsRead(id);
        }
        return () => {
            socket.off("private message", handleNewMessage);
            socket.off("new room", handleNewRoom);
        }
    }, [id, recipient?.username]);

    function sendMessage() {
        if (!imageSelected && !text) return;
        if (chatId === null) {
            socket.emit("join new room", { to: recipient?.id });
        } else {
            if (imageSelected) {
                socket.emit("image message", {
                    chatId: chatId,
                    image,
                });
                setImageSelected(false);
                setImage(null);
            }
            else {
                socket.emit("private message", {
                    chatId: chatId,
                    content: text,
                });
                setText("");
            }
        }
    }

    function handleFileClick() {
        fileRef.current?.click();
    }

    function handleFileChange(e) {
        const file = e.target.files[0];
        const url = URL.createObjectURL(file);
        setImage(file);
        imageRef.current = file;
        setImageSelected(true);
        setImageUrl(url);
    }

    function handleTextChange(e) {
        setText(e.target.value);
        textRef.current = e.target.value;
    }

    return (
        <div className="flex flex-1 flex-col basis-2/3 box-border">
            <div className="flex w-full border-b-1 border-dotted border-[(--color-border)] p-2 px-4 text-(--color-text) font-semibold">
                {recipient ? recipient.username : "Chat"}
            </div>
            <div className="flex h-[74vh] flex-col w-full box-border overflow-y-scroll bg-(--color-bg-secondary)">
                {
                    message &&
                    <div className="flex w-full text-[gray] justify-center box-border p-4 font-semibold text-[20px]">{message}
                    </div>
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
                                <div className={`${message.is_media ? "" : "bg-(--color-accent)"} break-all max-w-[360px] justify-center items-center rounded-[10px] p-3 text-(--color-text-secondary) font-medium text-[16px]`}>
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
            <div className="absolute right-3 ">
                <EmojiPicker open={emojiTab} onEmojiClick={handleEmojiClick} height="320px" />
            </div>
            {
                imageSelected &&
                <div className="flex absolute bottom-0 right-50 w-[320px] py-2 justify-self-center ">
                    <img src={imageUrl} alt="Selected Image" />
                </div>
            }
            {
                id !== "" &&
                <div className="flex w-full flex-1 border-1 border-[gray] border-dotted items-center justify-evenly">
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

export default Chat

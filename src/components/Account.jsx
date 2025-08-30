import { useContext, useState } from "react";
import "../App.css";
import { AppContext } from "../AppContext";

function Account() {
    let { user, setUser, saveUser } = useContext(AppContext);
    let [username, setUsername] = useState(user.username);
    let [currPassword, setCurrPassword] = useState("");
    let [newPassword, setNewPassword] = useState("");
    let [confirmPassword, setConfirmPassword] = useState("");
    let [changePassword, setChangePassword] = useState(false);
    let [error, setError] = useState("");

    function handleBtnClick() {
        setChangePassword(!changePassword);
        setError("");
        setCurrPassword("");
        setNewPassword("");
        setConfirmPassword("");
    }

    async function saveChanges() {
        if (changePassword && !(currPassword && newPassword && confirmPassword)) {
            setError("One or more fields are empty");
            return;
        }
        const response = await fetch(`https://chatter-backend-production-1d5f.up.railway.app/updateInfo`,
            {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({ username, currPassword, newPassword, confirmPassword })
            }
        );

        const { success, user, message } = await response.json();

        if (success) {
            setUser(user);
            saveUser(user);            
        }

        console.log(message);
        setError(message);
    }

    return (
        <div className="flex flex-col w-full bg-(--color-bg) box-border p-5 gap-10 ">
            <div className="flex flex-col w-full gap-5 ">
                <h1 className="text-(--color-text) font-bold text-[30px]">Personal Information</h1>
                <div className="text-(--color-text) text-[18px] font-medium ">
                    Manage your username and password here.
                </div>
            </div>
            <div className="flex flex-col gap-8">
                <div className="flex flex-col w-[320px] bg-(--color-bg-secondary) p-2 rounded-[20px] shadow-[0 2px 10px rgba(0, 0, 0, 0.2)] shadow-md ">
                    <div className="flex w-full justify-between items-center p-2 ">
                        <div className="font-bold text-[20px] text-(--color-text) ">Username</div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user-round-icon lucide-circle-user-round"><path d="M18 20a6 6 0 0 0-12 0" /><circle cx="12" cy="10" r="4" /><circle cx="12" cy="12" r="10" /></svg>
                    </div>
                    <div className="flex w-full gap-4 justify-between p-2">
                        <input
                            className="text-[16px] text-(--color-text) outline-none border-b-1 border-dotted border-[gray]"
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>
                </div>
                <button onClick={handleBtnClick} className="rounded-[15px] w-[180px] p-2 text-(--color-text) text-[18px] bg-(--color-bg-secondary) shadow-[0 2px 10px rgba(0, 0, 0, 0.2)] shadow-sm cursor-pointer hover:text-(--color-accent-hover)">
                    {!changePassword ? "Change Password" : "Collapse"}
                </button>
                {
                    changePassword &&
                    <div className="flex gap-10 items-center">
                        <div className="flex flex-col w-[280px] bg-(--color-bg-secondary) text-(--color-text) p-2 rounded-[20px] shadow-[0 2px 10px rgba(0, 0, 0, 0.2)] shadow-md ">
                            <div className="flex w-full justify-between items-center p-2">
                                <div className="font-medium text-[20px] ">Current Password</div>
                            </div>
                            <div className="flex w-full p-2">
                                <input
                                    className="text-[16px] outline-none border-b-1 border-dotted border-[gray]"
                                    type="text"
                                    value={currPassword}
                                    onChange={e => setCurrPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col w-[280px]  text-(--color-text) text-[18px] bg-(--color-bg-secondary) p-2 rounded-[20px] shadow-[0 2px 10px rgba(0, 0, 0, 0.2)] shadow-md ">
                            <div className="flex w-full justify-between items-center p-2 ">
                                <div className="font-medium text-[20px] ">New Password</div>
                            </div>
                            <div className="flex w-full p-2">
                                <input
                                    className="text-[16px] outline-none border-b-1 border-dotted border-[gray]"
                                    type="text"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col w-[280px] text-(--color-text) text-[18px] bg-(--color-bg-secondary) p-2 rounded-[20px] shadow-[0 2px 10px white] shadow-md ">
                            <div className="flex w-full justify-between items-center p-2">
                                <div className="font-medium text-[20px] ">Confirm New Password</div>
                            </div>
                            <div className="flex w-full p-2">
                                <input
                                    className="text-[16px] outline-none border-b-1 border-dotted border-[gray]"
                                    type="text"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                }
                <button onClick={saveChanges} className="rounded-[15px] w-[80px] p-1 text-(--color-text) text-[18px] bg-(--color-bg-secondary) shadow-[0 2px 10px rgba(0, 0, 0, 0.2)] shadow-sm cursor-pointer hover:text-(--color-accent-hover)">
                    Save
                </button>
                {
                    error &&
                    <div className="flex w-full text-(--color-text-secondary) px-2">
                        {error}
                    </div>
                }
            </div>
        </div>
    )
}

export default Account;
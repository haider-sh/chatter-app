import socket from "../socket";

function MemberPopup({ id, searchUser, setShowPopup, setSearchUser, searchUsers, searchedUsers, setSearchedUsers, searchMessage}) {

    function addMember(userId, name) {
        return (e) => {
            if (e.target.clicked) return;

            socket.emit("add member", { id, userId, name });
            e.target.clicked = true;
        }
    }

    function handlePopupClose() {
        setShowPopup(false);
        setSearchedUsers([]);
        setSearchUser("");
    }

    return (
        <div className="fixed w-[420px] h-min bg-(--color-button) rounded-[20px] p-2 shadow-xl shadow-[0 2px 10px rgba(0, 0, 0, 0.2)] box-border m-auto inset-0 flex items-center justify-center">
            <div className="flex items-center text-(--color-text) justify-evenly flex-col gap-4 h-full w-full">
                <h2 className="text-[22px] font-semibold ">Add Member</h2>
                <div className="flex gap-2 text-[18px] justify-evenly w-full items-center ">
                    <label className="font-medium" htmlFor="username">Search Name:</label>
                    <input
                        className="border-b-1 border-dotted border-(--color-text-secondary) p-1 outline-none"
                        type="text"
                        name="username"
                        value={searchUser}
                        onChange={e => setSearchUser(e.target.value)}
                    />
                </div>
                <div className="flex gap-10 text-[16px] ">
                    <button onClick={handlePopupClose} className="bg-(--color-bg-secondary) font-medium p-1 w-20 border-dotted border-[gray] rounded-full border-1 cursor-pointer">Close</button>
                    <button onClick={searchUsers} className="bg-(--color-bg-secondary) font-medium p-1 w-20 border-dotted border-[gray] rounded-full border-1 cursor-pointer">Search</button>
                </div>
                <div className="flex bg-(--color-bg-secondary) rounded-[20px] overflow-y-auto flex-col w-8/10 h-min max-h-[180px]">
                    {
                        searchMessage &&
                        <div className="flex justify-center text-[18px]">{searchMessage}</div>
                    }
                    {
                        searchedUsers.map(user => (
                            <div className="flex p-2 px-5 items-center justify-between gap-5 border-b-1 border-(--color-border) border-dotted">
                                {user.username}
                                <button className="cursor-pointer" onClick={addMember(user.id, user.username)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="fill-(--color-text) " width="28" viewBox="0 0 640 640"><path d="M136 192C136 125.7 189.7 72 256 72C322.3 72 376 125.7 376 192C376 258.3 322.3 312 256 312C189.7 312 136 258.3 136 192zM48 546.3C48 447.8 127.8 368 226.3 368L285.7 368C384.2 368 464 447.8 464 546.3C464 562.7 450.7 576 434.3 576L77.7 576C61.3 576 48 562.7 48 546.3zM544 160C557.3 160 568 170.7 568 184L568 232L616 232C629.3 232 640 242.7 640 256C640 269.3 629.3 280 616 280L568 280L568 328C568 341.3 557.3 352 544 352C530.7 352 520 341.3 520 328L520 280L472 280C458.7 280 448 269.3 448 256C448 242.7 458.7 232 472 232L520 232L520 184C520 170.7 530.7 160 544 160z" /></svg>
                                </button>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default MemberPopup;
import { useState } from "react"

function Userbox({ id, username }) {

    let [buttonClicked, setButtonClicked] = useState(null);

    async function handleAddFriend() {
        if (buttonClicked) return;
        const response = await fetch(`https://chatter-backend-z5x0.onrender.com/friends/${id}/add`,
            {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                method: "POST"
            }
        );

        const { success, data, message } = await response.json();

        if (!success) {
            console.log(message);
            return;
        }

        setButtonClicked(true);
    }

    return (
        <div className="flex w-full box-border border-b-1 text-(--color-text) hover:text-(--color-accent-hover) border-dotted py-4 border-[gray]">
            <div className="flex basis-1/5 grow-0 justify-center p-2 box-border">
                <svg xmlns="http://www.w3.org/2000/svg" className="fill-(--color-text) " width="36" viewBox="0 0 640 640"><path d="M320 312C386.3 312 440 258.3 440 192C440 125.7 386.3 72 320 72C253.7 72 200 125.7 200 192C200 258.3 253.7 312 320 312zM290.3 368C191.8 368 112 447.8 112 546.3C112 562.7 125.3 576 141.7 576L498.3 576C514.7 576 528 562.7 528 546.3C528 447.8 448.2 368 349.7 368L290.3 368z" /></svg>
            </div>
            <div className="flex w-full items-center justify-between px-5">
                <div className="font-semibold text-[18px]">
                    {username}
                </div>
                <button onClick={handleAddFriend} className="cursor-pointer hover:text-(--color-accent-hover)">
                    {
                        !buttonClicked ?
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-plus-icon lucide-user-round-plus"><path d="M2 21a8 8 0 0 1 13.292-6"/><circle cx="10" cy="8" r="5"/><path d="M19 16v6"/><path d="M22 19h-6"/></svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-round-check-icon lucide-user-round-check"><path d="M2 21a8 8 0 0 1 13.292-6"/><circle cx="10" cy="8" r="5"/><path d="m16 19 2 2 4-4"/></svg>
                    }
                </button>
            </div>
        </div>
    )
}

export default Userbox;
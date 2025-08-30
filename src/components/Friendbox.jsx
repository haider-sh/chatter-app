import { useState } from "react"

function Friendbox({ id, username }) {

    let [buttonClicked, setButtonClicked] = useState(null);

    async function handleUnfriend() {
        if (buttonClicked) return;
        const response = await fetch(`https://chatter-backend-production-1d5f.up.railway.app/friends/${id}/unfriend`,
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
                <button onClick={handleUnfriend} className="cursor-pointer hover:text-[#adadad]">
                    {
                        !buttonClicked ?
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-icon lucide-heart"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" /></svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-crack-icon lucide-heart-crack"><path d="M12.409 5.824c-.702.792-1.15 1.496-1.415 2.166l2.153 2.156a.5.5 0 0 1 0 .707l-2.293 2.293a.5.5 0 0 0 0 .707L12 15" /><path d="M13.508 20.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 9.591-3.677.6.6 0 0 0 .818.001A5.5 5.5 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5z" /></svg>
                    }
                </button>
            </div>
        </div>
    )
}

export default Friendbox;
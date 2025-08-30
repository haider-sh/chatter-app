import { useContext } from "react";
import "../App.css";
import { Link } from "react-router-dom";
import { AppContext } from "../AppContext";

function Sidebar({ theme, setTheme }) {

    let { logUserOut, user } = useContext(AppContext);
    console.log(user);
    return (
        <div className="bg-(--side-bar-bg) h-full flex flex-col box-border border-r-1 border-dotted basis-1/5 py-2 gap-5">
            <div className="flex flex-col gap-5">
                <div className="gap-10 text-(--side-bar-color) text-[30px] border-b-1 border-dotted w-full flex justify-center py-4">
                    Chatter
                    <img className="w-[50px] " src="/chat-icon.png" alt="" />
                </div>
                <div className="flex w-full gap-5 text-(--side-bar-color) border-dotted border-b-1 pb-4 text-[20px] items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user-round-icon lucide-circle-user-round"><path d="M18 20a6 6 0 0 0-12 0" /><circle cx="12" cy="10" r="4" /><circle cx="12" cy="12" r="10" /></svg>
                    {user?.username}
                </div>
            </div>
            <div className="flex flex-col justify-evenly h-full">
                <div className="flex flex-col gap-5">
                    <div className="text-(--side-bar-color) text-[16px] justify-start pl-5 w-full font-semibold">MENU</div>
                    <Link className="text-(--side-bar-color) justify-start pl-5 flex gap-5 w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-messages-square-icon lucide-messages-square"><path d="M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /><path d="M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1" /></svg>
                        Conversations
                    </Link>
                    <Link to="/groups" className="text-(--side-bar-color) justify-start pl-5 flex gap-5 w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users-icon lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><path d="M16 3.128a4 4 0 0 1 0 7.744" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><circle cx="9" cy="7" r="4" /></svg>
                        Groups
                    </Link>
                    <Link to="/friends" className="text-(--side-bar-color) justify-start pl-5 flex gap-5 w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-icon lucide-heart"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" /></svg>
                        Friends
                    </Link>
                </div>
                <div className="flex flex-col gap-5">
                    <div className="text-(--side-bar-color) text-[16px] justify-start pl-5 w-full font-semibold">SETTINGS</div>
                    <Link to="/account" className="text-(--side-bar-color) justify-start pl-5 flex gap-5 w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        Account
                    </Link>
                    <button onClick={setTheme} className="text-(--side-bar-color) justify-start pl-5 flex gap-5 hover:text-[#adadad] cursor-pointer w-full">
                        {
                            theme ? 
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun-medium-icon lucide-sun-medium"><circle cx="12" cy="12" r="4"/><path d="M12 3v1"/><path d="M12 20v1"/><path d="M3 12h1"/><path d="M20 12h1"/><path d="m18.364 5.636-.707.707"/><path d="m6.343 17.657-.707.707"/><path d="m5.636 5.636.707.707"/><path d="m17.657 17.657.707.707"/></svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon-star-icon lucide-moon-star"><path d="M18 5h4" /><path d="M20 3v4" /><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" /></svg>}
                        {theme ? "Light" : "Dark"} Mode
                    </button>
                    <button onClick={logUserOut} className="text-(--side-bar-color) justify-start pl-5 flex cursor-pointer hover:text-[#adadad] gap-5 w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out-icon lucide-log-out"><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /></svg>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;

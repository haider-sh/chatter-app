import routes from './routes.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppContext } from "./AppContext.jsx";
import { useState } from 'react';
import socket from './socket.js';

const router = createBrowserRouter(routes);

function AppProvider() {

    let [loggedIn, setLoggedIn] = useState(Boolean(isLoggedIn()));
    let [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
    let [chats, setChats] = useState([]);
    let [groups, setGroups] = useState([]);
    let [friends, setFriends] = useState([]);
    let [messages, setMessages] = useState([]);

    function saveJwtToken(token) {
        localStorage.setItem("token", token);
    }

    function saveUser(user) {
        localStorage.setItem("user", JSON.stringify(user));
    }

    function isLoggedIn() {
        return localStorage.getItem("token");
    }

    function logUserOut() {
        setLoggedIn(false);
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("sessionID");
        socket.disconnect();
    }

    return (
        <AppContext.Provider value={{ chats, setChats, groups, setGroups, friends, setFriends, messages, setMessages, saveUser, user, setUser, saveJwtToken, loggedIn, setLoggedIn, logUserOut }}>
            <RouterProvider router={router} />
        </AppContext.Provider>
    );
}
    
export default AppProvider;
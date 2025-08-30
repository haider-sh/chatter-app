import App from "./App.jsx";
import Conversations from "./components/Conversations.jsx";
import Group from "./components/Group.jsx";
import Friend from "./components/Friend.jsx"
import LoginForm from "./components/LoginForm.jsx";
import SignupForm from "./components/SignupForm.jsx";
import PrivateRoutes from "./PrivateRoutes.jsx";
import Account from "./components/Account.jsx";

const routes = [
    {
        element: <PrivateRoutes />,
        children: [
            {
                path: "/",
                element: <App />,
                children: [
                    {
                        index: true,
                        element: <Conversations />
                    },
                    {
                        path: "/groups",
                        element: <Group />
                    },
                    {
                        path: "/friends",
                        element: <Friend />
                    },
                    {
                        path: "/account",
                        element: <Account />
                    }
                ]
            },
        ]
    },
    {
        path: "/login",
        element: <LoginForm />
    },
    {
        path: "/signup",
        element: <SignupForm />
    }
];

export default routes;
import { createBrowserRouter } from "react-router";
import Home from "../Pages/Home";
import App from "../Pages/App";
import NotFound from "../Pages/NotFound";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import UserDashboardLayout from "../Pages/Dashboard/UserDashboardLayout";
import Profile from "../Pages/Dashboard/Profile";
import AddPost from "../Pages/Dashboard/AddPost";
import MyPost from "../Pages/Dashboard/Mypost";
import Membership from "../Pages/Membership";
import PostDetails from "../Pages/PostDetails";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                index: true,
                element: <Home/>
            },
            {
                path: "login",
                element: <Login/>
            },
            {
                path: "signup",
                element: <Register/>
            },
            {
                path:"membership",
                element: <Membership/>
            },
            {
                path:"post/:id",
                element: <PostDetails/>
            }
        ]
    },
    {
        path: "*",
        element: <NotFound/>
    },
    {
        path: "/user-dashboard",
        element: <UserDashboardLayout/>,
        children:[
            {
                index: true,
                Component: Profile
            },
            {
                path: "add-post",
                element: <AddPost/>
            },
            {
                path: "profile",
                element: <Profile/>
            },
            {
                path: "myposts",
                element: <MyPost/>
            }
            
        ]
    }
],)
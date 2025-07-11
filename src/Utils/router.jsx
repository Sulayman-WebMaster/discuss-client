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
import Success from "../Pages/Success";
import Admin from "../Provider/Admin";
import AdminDashboard from "../Pages/Admin/AdminDashboard";
import AdminHome from "../Pages/Admin/AdminHome";
import Unauthorized from "../Pages/Unauthorized";
import UserOnly from "../Pages/Dashboard/UserOnly";
import ManageUser from "../Pages/Admin/ManageUser";
import AdminProfile from "../Pages/Admin/AdminProfile";
import AnnouncementForm from "../Pages/Admin/Annoucement";
import Reported from "../Pages/Admin/Reported";
import PrivateRoute from "../Provider/PrivateRoute";


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
                element: <PrivateRoute><Membership/></PrivateRoute>
            },
            {
                path:"post/:id",
                element: <PostDetails/>
            },
            {
                path: "success",
                element: <Success/>
            },
            {
                path: "unauthorized",
                element: <Unauthorized/>
            }
           
        ]
    },
    {
        path: "*",
        element: <NotFound/>
    },
    {
        path: "/user-dashboard",
        element: <PrivateRoute><UserOnly><UserDashboardLayout/></UserOnly></PrivateRoute>,
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
    },
    {
        path: "/admin-dashboard",
        element: <PrivateRoute><Admin><AdminDashboard/></Admin></PrivateRoute>,
        children:[
            {
                index: true,
                element: <AdminHome/>
            },
            {
                path: "manage-users",
                element: <ManageUser/>
            },
            {
                path: "admin-profile",
                element: <AdminProfile/>
            },
            {
                path: "announcements",
                element: <AnnouncementForm/>
            },
            {
                path:"reported",
                element:<Reported/>
            }
          
            
        ]
    }

],)
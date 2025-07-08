import { createBrowserRouter } from "react-router";
import Home from "../Pages/Home";
import App from "../Pages/App";
import NotFound from "../Pages/NotFound";
import Login from "../Pages/Login";
import Register from "../Pages/Register";


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
            }
        ]
    },
    {
        path: "*",
        element: <NotFound/>
    }
])
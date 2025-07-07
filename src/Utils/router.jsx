import { createBrowserRouter } from "react-router";
import Home from "../Pages/Home";
import App from "../Pages/App";
import NotFound from "../Pages/NotFound";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                index: true,
                element: <Home/>
            }
        ]
    },
    {
        path: "*",
        element: <NotFound/>
    }
])
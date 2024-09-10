import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Browse from "./Browse"
import Login from "./Login"
import View from "./View"


const Body = () => {

  const appRouter = createBrowserRouter([
    {    
        path: "/",
        element: <Login />
    },
    {    
      path: "/browse",
      element: <Browse />
    },
    {    
      path: "/view",
      element: <View />
    },
    
    ])
    
    return (
       <RouterProvider router={appRouter} />
    )
}
export default Body
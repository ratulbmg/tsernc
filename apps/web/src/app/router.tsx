import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { Home, Unauthorised } from "../pages";
import Layout from "./Layout";
import ProtectedRoute from "./protectedRoute";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="*" element={<Unauthorised/>}/>
            <Route path="/" element={<Layout/>}>
                <Route path="" element={<Home/>}/>
                <Route path="dashboard" element={<ProtectedRoute/>}>
                </Route>
            </Route>
        </>
    )
)

export default router
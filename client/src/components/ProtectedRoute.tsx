import { Navigate, Outlet } from "react-router-dom";
import { useActiveUser } from "@/lib/state";

const ProtectedRoute = () => {
    const activeUser = useActiveUser((s) => s.activeUser);
    const loading = useActiveUser((s) => s.isLoading);

    if (loading) return <div>Loading...</div>;

    if (!activeUser) {
        return <Navigate to='/login' replace />
    }

    return <Outlet />
};

export default ProtectedRoute;
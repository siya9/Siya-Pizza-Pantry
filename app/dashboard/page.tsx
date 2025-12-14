import HomePage from "@/components/home/HomePage";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  );
}

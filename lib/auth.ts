// Hard-coded authentication credentials
// In a real app, this would be stored securely on a backend

export const HARDCODED_USERS = [
  {
    email: "admin@pizzapantry.com",
    password: "admin123",
    name: "Admin User",
    id: "1",
  },
  {
    email: "staff@pizzapantry.com",
    password: "staff123",
    name: "Staff User",
    id: "2",
  },
];

export interface User {
  email: string;
  name: string;
  id: string;
}

export function authenticate(email: string, password: string): User | null {
  const user = HARDCODED_USERS.find(
    (u) => u.email === email && u.password === password
  );
  if (user) {
    return {
      email: user.email,
      name: user.name,
      id: user.id,
    };
  }
  return null;
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("current-user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null): void {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem("current-user", JSON.stringify(user));
  } else {
    localStorage.removeItem("current-user");
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}


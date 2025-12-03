export type User = {
  id: number;
  name: string;
};

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch("https://example.com/api/users");
  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }
  return res.json();
}

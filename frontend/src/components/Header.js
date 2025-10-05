export default function Header({ user }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: 16,
        borderBottom: "1px solid #eee",
      }}
    >
      <div>👋 {user.displayName}</div>
      <button onClick={() => signOut(auth)}>Sign out</button>
    </div>
  );
}

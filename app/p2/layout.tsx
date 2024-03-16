import "./Layout.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="app">
      {children}
      <nav className="nav">nav</nav>
    </main>
  );
}

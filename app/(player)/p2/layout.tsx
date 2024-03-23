import "./Layout.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="player-page-layout">
      {children}
    </main>
  );
}

import "./styles.css";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <section className="rCode-layout">{children}</section>;
}

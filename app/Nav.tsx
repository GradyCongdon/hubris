"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClaim } from "./useClaim";

const buildActiveClass = (fullPath: string) => (partialPath: string) => {
  const isHome = partialPath === "/";
  if (isHome && fullPath == partialPath) return "active-link";
  if (!isHome && fullPath.startsWith(partialPath)) return "active-link";
  return "";
};
export const Nav = ({
  rCode: _rCode,
  characterShort: _characterShort,
}: {
  rCode: string;
  characterShort: string;
}) => {
  const pathname = usePathname();
  const activeClass = buildActiveClass(pathname);
  const { rCode, characterShort, claim, isCurrentClaim } = useClaim(
    _rCode,
    _characterShort
  );

  return (
    <>
      <Link className={activeClass("/")} href="/">
        Home
      </Link>
      <Link className={activeClass("/search")} href="/search">
        Search
      </Link>
      {rCode ? (
        <Link
          className={activeClass(`/player/${rCode}`)}
          href={`/player/${rCode}/${characterShort}`}
        >
          Me
        </Link>
      ) : null}
      {pathname.startsWith("/player") && !isCurrentClaim ? (
        <button className="claim" onClick={claim}>
          Claim
        </button>
      ) : (
        <div style={{ minWidth: "80px" }}></div>
      )}
    </>
  );
};

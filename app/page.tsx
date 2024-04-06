import { SearchInputRouter } from "./SearchInput";

export default function Home() {
  return (
    <main className="min-h-screen p-3 lg:p-24 text-lg lg:text-xl mt-16">
      <h2 className="text-2xl mb-1">Search</h2>
      <SearchInputRouter />
      <p className="pl-2 italic text-sm my-4">or</p>
      <p>
        navigate to
        <kbd
          className="text-xs md:text-md lg:text-lg px-1 ml-2"
          // style={{ background: "var(--bg-contrast)" }}
        >
          /player/&lt;r-code&gt;/&lt;character-short-code&gt;
        </kbd>
      </p>
      <p className="text-sm italic">
        your r-code and character short can be found in the url of your{" "}
        <a href="http://ratingupdate.info" className="underline">
          ratingupdate.info
        </a>
        &nbsp;page
      </p>
      <p className="mt-6 mb-1">examples:</p>
      <ul>
        <li>
          <kbd>
            <a
              className="text-sm lg:text-lg underline"
              href="/player/2EC3DC4435865B9/SO"
            >
              UMISHO - /player/2EC3DC4435865B9/SO
            </a>
          </kbd>
        </li>
        <li>
          <kbd>
            <a
              className="underline text-sm lg:text-lg"
              href="/player/2EC3DCA33129F30/KY"
            >
              me - /player/2EC3DCA33129F30/KY
            </a>
          </kbd>
        </li>
      </ul>
    </main>
  );
}

export async function generateMetadata() {
  return {
    title: `Hubris Rating`,
    description: `Watch number go ±`,
  };
}

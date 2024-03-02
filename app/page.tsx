export default function Home() {
  return (
    <main className="min-h-screen p-3 lg:p-24 text-lg lg:text-xl">
      <br />
      <p>
        navigate to
        <br />
        <br />
        <kbd className="text-xs md:text-md lg:text-lg">
          /rating/&lt;name&gt;/&lt;r-code&gt;/&lt;character-short-code&gt;
        </kbd>
      </p>
      <br />
      <p className="text-md">
        your r-code and character short can be found in the url of your{" "}
        <a href="http://ratingupdate.info" className="underline">
          ratingupdate.info
        </a>
        &nbsp;page
      </p>
      <br />
      <p>examples:</p>
      <ul>
        <li>
          <kbd>
            <a
              className="text-sm lg:text-lg underline"
              href="/rating/UMISHO/2EC3DC4435865B9/SO"
            >
              /rating/UMISHO/2EC3DC4435865B9/SO
            </a>
          </kbd>
        </li>
        <li>
          <kbd>
            <a
              className="underline text-sm lg:text-lg"
              href="/rating/heckscape/2EC3DCA33129F30/KY"
            >
              /rating/heckscape/2EC3DCA33129F30/KY
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

import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen p-24 text-xl">
      <br />
      <p>
        navigate to
        <br />
        <br />
        <kbd>
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
      example:{" "}
      <kbd>
        <a className="underline" href="/rating/UMISHO/2EC3DC4435865B9/SO">
          /rating/UMISHO/2EC3DC4435865B9/SO
        </a>
      </kbd>
    </main>
  );
}

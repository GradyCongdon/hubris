import { useState } from "react";

type Props = {
  theme: string | null;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
};

const SIZE = 24;
const OFFSET = 8;

const Sun = () => (
  <svg
    version="1.1"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    width={SIZE}
    height={SIZE}
    style={{
      fill: "currentColor",
      transform: "scale(1.4)",
      position: "relative",
      top: "3px",
      left: "2px",
    }}
    id="sun"
  >
    <g
      className="st0"
      id="grid_system"
      style={{ display: "none" }}
      transform="translate(0,-4)"
    />
    <g
      id="_icons"
      transform="matrix(0.97966102,0,0,0.97966102,-1.620339,-1.8237288)"
    >
      <path
        id="path4707"
        d="m 6.3,4.9 c -0.4,-0.4 -1,-0.4 -1.4,0 -0.4,0.4 -0.4,1 0,1.4 L 6.3,7.7 C 6.5,8 6.8,8.1 7.1,8.1 7.4,8.1 7.6,8 7.8,7.8 8.2,7.4 8.2,6.8 7.8,6.4 L 6.3,4.9 Z M 2,12 c 0,0.6 0.4,1 1,1 l 2,0 C 5.6,13 6,12.6 6,12 6,11.4 5.6,11 5,11 l -2,0 c -0.6,0 -1,0.4 -1,1 z m 2.9,7.1 c 0.2,0.2 0.5,0.3 0.7,0.3 0.2,0 0.5,-0.1 0.7,-0.3 l 1.4,-1.4 c 0.4,-0.4 0.4,-1 0,-1.4 -0.4,-0.4 -1,-0.4 -1.4,0 l -1.4,1.4 c -0.4,0.3 -0.4,1 0,1.4 z M 11,19 l 0,2 c 0,0.6 0.4,1 1,1 0.6,0 1,-0.4 1,-1 l 0,-2 c 0,-0.6 -0.4,-1 -1,-1 -0.6,0 -1,0.4 -1,1 z m 6.7,-2.8 c -0.4,-0.4 -1,-0.4 -1.4,0 -0.4,0.4 -0.4,1 0,1.4 l 1.4,1.4 c 0.2,0.2 0.5,0.3 0.7,0.3 0.2,0 0.5,-0.1 0.7,-0.3 0.4,-0.4 0.4,-1 0,-1.4 L 17.7,16.2 Z M 21,11 19,11 c -0.6,0 -1,0.4 -1,1 0,0.6 0.4,1 1,1 l 2,0 c 0.6,0 1,-0.4 1,-1 0,-0.6 -0.4,-1 -1,-1 z M 19.1,4.9 c -0.4,-0.4 -1,-0.4 -1.4,0 l -1.4,1.4 c -0.4,0.4 -0.4,1 0,1.4 0.2,0.2 0.5,0.3 0.7,0.3 0.2,0 0.5,-0.1 0.7,-0.3 l 1.4,-1.4 c 0.4,-0.3 0.4,-1 0,-1.4 z M 13,5 13,3 C 13,2.4 12.6,2 12,2 11.4,2 11,2.4 11,3 l 0,2 c 0,0.6 0.4,1 1,1 0.6,0 1,-0.4 1,-1 z m -6,7 c 0,2.8 2.2,5 5,5 2.8,0 5,-2.2 5,-5 C 17,9.2 14.8,7 12,7 9.2,7 7,9.2 7,12 Z m 5,-3 c 1.7,0 3,1.3 3,3 0,1.7 -1.3,3 -3,3 -1.7,0 -3,-1.3 -3,-3 0,-1.7 1.3,-3 3,-3 z"
      />
    </g>
  </svg>
);

const Moon = () => (
  <svg
    version="1.1"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      fill: "currentColor",
      strokeWidth: 0,
    }}
    id="moon"
    width={SIZE}
    height={SIZE}
  >
    <path d="m 20.946619,20.29958 c -4.71269,4.71656 -12.3860296,4.71656 -17.1026896,0 -4.71655997,-4.71675 -4.71655997,-12.39 0,-17.10468 1.24812,-1.24604 2.76969,-2.19689 4.51965,-2.81693 0.55125,-0.19295 1.16156,-0.0531 1.57089,0.3583 0.4134896,0.4134 0.5532396,1.02361 0.3583996,1.5709 -1.1850896,3.34258 -0.3779596,6.9607 2.10241,9.44116 2.47649,2.47828 6.0946,3.28353 9.44106,2.1024 0.54729,-0.19484 1.15949,-0.055 1.5709,0.3584 0.41348,0.40933 0.55125,1.02163 0.35632,1.5709 -0.61617,1.74986 -1.56891,3.27143 -2.81694,4.51955 z M 5.9817694,5.33274 c -3.53752,3.53752 -3.53752,9.29347 0,12.829 3.7796,3.78159 10.2167296,3.44095 13.5120696,-0.77179 -3.39777,0.2126 -6.74423,-1.01379 -9.2364,-3.50407 C 7.7652694,11.39569 6.5408694,8.04914 6.7533694,4.65147 c -0.27156,0.21279 -0.52952,0.43919 -0.7716,0.68127 z" />
  </svg>
);

export const ThemeSwitcher = ({ theme, setTheme }: Props) => {
  const isLight = theme === "light" || theme === null;
  const onClick = () => {
    if (isLight) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };
  if (isLight) {
    return (
      <button
        className="theme-switch"
        onClick={onClick}
        style={{
          position: "absolute",
          top: OFFSET - 2,
          right: OFFSET,
          zIndex: 100,
          color: "var(--color)",
        }}
      >
        {/* <Image
          src={moon}
          alt="moon"
          className="theme-icon"
          priority
          width={SIZE}
          height={SIZE}
          onLoad={() => {
            setHasLoaded(true);
          }}
        /> */}

        <Sun />
      </button>
    );
  }
  return (
    <button
      className="theme-switch"
      onClick={onClick}
      style={{
        position: "absolute",
        top: OFFSET,
        right: OFFSET,
        zIndex: 100,
        color: "var(--color)",
        // filter: hasLoaded
        //   ? "invert(93%) sepia(36%) saturate(2308%) hue-rotate(21deg) brightness(105%) contrast(108%)"
        //   : "",
      }}
    >
      {/* <Image
        src={sun}
        alt="sun"
        className="theme-icon"
        width={SIZE}
        height={SIZE}
        onLoad={() => {
          setHasLoaded(true);
        }}
      /> */}
      <Moon />
    </button>
  );
};

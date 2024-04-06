"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useSearchInput = (
  defaultValue: string,
  callback: (name: string) => void
) => {
  const [name, setName] = useState<string>(defaultValue);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const onSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    callback(name);
  };
  const onEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };
  return { onChange, onSubmit, onEnter, name };
};
export const SearchInput = ({
  defaultValue,
  callback,
}: {
  defaultValue: string;
  callback: (name: string) => void;
}) => {
  const { onChange, onSubmit, onEnter, name } = useSearchInput(
    defaultValue,
    callback
  );
  return (
    <form onSubmit={onSubmit} onKeyDown={onEnter} className="flex">
      <input
        type="text"
        placeholder="player name"
        onChange={onChange}
        className="p-2 rounded border input text-lg"
        value={name}
      />
      <button type="submit" className="ml-2 p-2 rounded-full button">
        Search
      </button>
    </form>
  );
};

export const SearchInputRouter = () => {
  const router = useRouter();
  const callback = (name: string) => {
    router.push(`/search/${name}`);
  };
  return <SearchInput defaultValue={""} callback={callback} />;
};

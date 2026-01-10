import { useState, useMemo, useEffect, ChangeEvent } from "react";

interface SelectProps {
  id: string;
  options: string[];
  value: string;
  width?: string;
  onChange: (value: string) => void;
  onInput?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const Select: React.FC<SelectProps> = ({ id, options, value, width, onChange, onInput }) => {
  const [search, setSearch] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (
        !target.closest(`#Toggle-${id}`) &&
        !target.closest(`#Select-${id}`)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [id]);

  const opt = useMemo(() => {
    // Manage search and options
    const filteredOptions = options.filter(
      (o) => o?.toLowerCase().includes(search?.toLowerCase())
    );

    return filteredOptions.length > 0
      ? filteredOptions.map((o, i) => (
          <div
            key={i}
            className="px-3 py-1 cursor-pointer bg-white text-black hover:bg-neutral-300"
            onClick={() => {
              onChange(o);
              setOpen(false);
            }}
          >
            {o}
          </div>
        ))
      : [
          <div
            key={"not-found"}
            className="px-3 py-1 cursor-pointer bg-white text-black hover:bg-neutral-300"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
          >
            No Matches Found
          </div>,
        ];
  }, [options, search, onChange]);

  useEffect(() => {
    setSearch(value);
  }, [value]);

  return (
    <div
      id={`Select-${id}`}
      className={`${width} relative flex flex-col items-center justify-center`}
    >
      <div className="flex w-full items-center justify-between divide-x divide-neutral-200 gap-1 border border-neutral-400 bg-white text-black rounded-md overflow-hidden">
        <input
          className="flex-auto outline-none px-2"
          placeholder="Procurar..."
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); if(onInput) onInput(e)}}
          onFocus={() => setOpen(true)}
        />
        <span
          className="relative p-4 cursor-pointer"
          onClick={() => setOpen((p) => !p)}
          id={`Toggle-${id}`}
        >
          <span
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-[6px] border-l-transparent border-r-transparent border-b-0 border-t-neutral-900 transition-[transform] ${
              open ? "rotate-180" : "rotate-0"
            }`}
          ></span>
        </span>
      </div>
      <div
        id="options"
        className={`absolute top-10 z-10 border-neutral-400 w-full rounded-md overflow-auto transition-all text-black bg-white ${
          open ? "max-h-40 border bg-white shadow-lg" : "max-h-0 border-0"
        }`}
      >
        {opt}
      </div>
    </div>
  );
};

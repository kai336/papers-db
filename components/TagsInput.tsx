import React, { useState } from "react";
<<<<<<< HEAD
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

export default function TagsInput({ label, values, setValues }) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const value = input.trim();
    if (value && !values.includes(value)) {
      setValues([...values, value]);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "," ) {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
      {values.map((v, i) => (
        <Chip
          key={v}
          label={v}
          onDelete={() => setValues(values.filter((_, idx) => idx !== i))}
        />
      ))}
      <TextField
        value={input}
        size="small"
        label={label}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleAdd}
        style={{ minWidth: 120 }}
      />
    </Stack>
  );
}
=======

interface Props {
  label?: string;
  values: string[];
  setValues: (vals: string[]) => void;
  className?: string;
}

export default function TagsInput({ label, values, setValues, className }: Props) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const value = input.trim();
    if (value && !values.includes(value)) {
      setValues([...values, value]);
    }
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (idx: number) => {
    setValues(values.filter((_, i) => i !== idx));
  };

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((v, idx) => (
          <span
            key={v}
            className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded"
          >
            {v}
            <button
              type="button"
              onClick={() => removeTag(idx)}
              className="ml-1 text-xs text-blue-600 hover:text-blue-800"
            >
              &times;
            </button>
          </span>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        className="border rounded p-2 w-full"
        placeholder="入力後 Enter"
      />
    </div>
  );
}

>>>>>>> c43bf2b82103390033a258ad1eeea85bbf3896ce

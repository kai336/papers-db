import React, { useState } from "react";
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

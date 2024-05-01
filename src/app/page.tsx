"use client";

import React, { useState } from "react";
import Wheel from "@uiw/react-color-wheel";
import { hsvaToHex } from "@uiw/color-convert";
import { ColorResult } from "@uiw/color-convert";
import toast, { Toaster } from "react-hot-toast";
const count_led_per_strip = 10;
const count_rows = 3;
const count_columns = 2;
const initialHsva = { h: 214, s: 43, v: 90, a: 1 };
const initialHex = hsvaToHex(initialHsva);
const led_size = 66;
const ledButtonStyle = {
  width: led_size,
  height: led_size,
  borderRadius: "10%",
  margin: 5,
};
const initialLedColors: { [key: string]: string } = {};
for (let i = 0; i < count_rows; i++) {
  for (let j = 0; j < count_columns * count_led_per_strip; j++) {
    const key = `${i},${j}`;
    initialLedColors[key] = initialHex;
  }
}

export default function Home() {
  const [hsva, setHsva] = useState(initialHsva);
  const [ledColors, setLedColors] = useState(initialLedColors);

  async function setColorOnStrip(r: number, c: number, hex: string) {
    const body = [`r,${r}`, `c,${c}`, `color,${hex}`].join("\n");
    const headers = {
      "Content-type": "text/csv; charset=UTF-8",
    };

    let response;
    try {
      response = await fetch("http://localhost/color", {
        method: "POST",
        body,
        headers,
      });
    } catch (error) {}

    if (response === undefined || !response.ok) {
      toast.error("Failed to apply colour.");
      return;
    }

    const key = `${r},${c}`;
    const newLedColors = { ...ledColors, [key]: hex };
    setLedColors(newLedColors);
  }

  function handleLedClick(r: number, c: number) {
    const hex = hsvaToHex(hsva);

    // setColorOnStrip(r, c, hex);
  }

  function createStrip(
    id1: number,
    id2: number,
    count: number = count_led_per_strip,
  ) {
    const ledStrip: React.JSX.Element[] = [];

    for (let i = 0; i < count; i++) {
      const r = id1;
      const c = id2 * count + i;
      const key = `${r},${c}`;
      const background = initialHex;
      const style = {
        ...ledButtonStyle,
        background: ledColors[key],
      };

      ledStrip.push(
        <button
          aria-label="LED"
          key={key}
          style={style}
          onClick={() => handleLedClick(r, c)}
        >
          {r} {c} {background}
          <span className="sr-only">
            LED {r},{c}
          </span>
        </button>,
      );
    }

    return ledStrip;
  }

  function createColumns(
    id: number,
    n_columns: number = count_columns,
    n_led_per_strip: number = count_led_per_strip,
  ) {
    const ledColumns: React.JSX.Element[] = [];
    const style = {
      margin: 10,
      border: "solid 2px coral",
      display: "inline-block",
    };

    for (let i = 0; i < n_columns; i++) {
      ledColumns.push(
        <span style={style} key={i}>
          {createStrip(id, i, n_led_per_strip)}
        </span>,
      );
    }

    return ledColumns;
  }

  function createRows(
    n_rows: number = count_rows,
    n_led_per_strip: number = count_led_per_strip,
  ) {
    const ledRows: React.JSX.Element[] = [];

    for (let i = 0; i < n_rows; i++) {
      ledRows.push(
        <div key={i}>{createColumns(i, count_columns, n_led_per_strip)}</div>,
      );
    }

    return ledRows;
  }

  function handleWheelClick(color: ColorResult) {
    const newColor = { ...hsva, ...color.hsva };
    setHsva(newColor);
  }

  const leds: React.JSX.Element[] = createRows(count_rows, count_led_per_strip);

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div>
          <Wheel color={hsva} onChange={handleWheelClick} />
        </div>
        <div>{leds}</div>
      </main>
      <Toaster />
    </>
  );
}

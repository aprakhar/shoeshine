"use client";

import React, { useState } from "react";
import Wheel from "@uiw/react-color-wheel";
import { hsvaToHex } from "@uiw/color-convert";
import { ColorResult } from "@uiw/color-convert";

const count_led_per_strip = 10;
const count_rows = 3;
const count_columns = 2;
const initialHsva = { h: 214, s: 43, v: 90, a: 1 };
const led_size = 66;
const ledButtonStyle = {
  width: led_size,
  height: led_size,
  borderRadius: "10%",
  margin: 5,
};

export default function Home() {
  const [hsva, setHsva] = useState(initialHsva);

  function handleLedClick(r: number, c: number) {
    console.log(r, c);
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
      const background = hsvaToHex(initialHsva);
      const style = {
        ...ledButtonStyle,
        background: background,
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
    console.log("🚀 ~ handleWheelClick ~ newColor:", newColor);
    setHsva(newColor);
  }

  const leds: React.JSX.Element = <div>{createRows(count_led_per_strip)}</div>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <Wheel color={hsva} onChange={handleWheelClick} />
      </div>
      <div>{createRows(count_rows, count_led_per_strip)}</div>
    </main>
  );
}

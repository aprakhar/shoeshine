"use client";

import React, { useState } from "react";
import Wheel from "@uiw/react-color-wheel";
import { hsvaToHex } from "@uiw/color-convert";

const count_led_per_strip = 10;
const count_rows = 3;
const count_columns = 2;

export default function Home() {
  const [hsva, setHsva] = useState({ h: 214, s: 43, v: 90, a: 1 });

  function createStrip(count: number = count_led_per_strip) {
    const ledStrip: React.JSX.Element[] = [];
    const led_size = 44;

    for (let i = 0; i < count_led_per_strip; i++) {
      ledStrip.push(
        <button
          aria-label="LED"
          key={i}
          style={{
            width: led_size,
            height: led_size,
            background: hsvaToHex(hsva),
            borderRadius: "10%",
            margin: 5,
          }}
        >
          LED
        </button>,
      );
    }

    return ledStrip;
  }

  function createColumns(count: number = count_led_per_strip) {
    const ledColumns: React.JSX.Element[] = [];

    for (let i = 0; i < count_columns; i++) {
      ledColumns.push(
        <span
          style={{
            margin: 10,
            border: "solid 2px coral",
            display: "inline-block",
          }}
        >
          {createStrip(count_led_per_strip)}
        </span>,
      );
    }

    return ledColumns;
  }

  function createRows(count: number = count_led_per_strip) {
    const ledRows: React.JSX.Element[] = [];

    for (let i = 0; i < count_rows; i++) {
      ledRows.push(<div>{createColumns(count_led_per_strip)}</div>);
    }

    return ledRows;
  }

  const leds: React.JSX.Element = <div>{createRows(count_led_per_strip)}</div>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <Wheel
          color={hsva}
          onChange={(color) => setHsva({ ...hsva, ...color.hsva })}
        />
      </div>
      <div>{createRows()}</div>
    </main>
  );
}

import React from "react";
import { CircleNotch } from "phosphor-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center overflow-hidden">
      <CircleNotch weight="bold" className="w-5 h-5 animate-spin" />
    </div>
  );
}

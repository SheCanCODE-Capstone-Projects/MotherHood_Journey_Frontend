"use client";

import { useState } from "react";

export function SkipLink() {
  const [visible, setVisible] = useState(false);

  return (
    <a
      href="#main-content"
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      className="skip-link"
      style={{
        position: "absolute",
        left: 12,
        top: 12,
        zIndex: 9999,
        padding: "8px 12px",
        background: "white",
        color: "#0F766E",
        borderRadius: 8,
        boxShadow: "0 4px 12px rgba(2,6,23,0.08)",
        transform: visible ? "translateY(0)" : "translateY(-140%)",
        transition: "transform 120ms ease",
        textDecoration: "none",
        fontSize: 13,
        fontWeight: 600,
      }}
    >
      Skip to main content
    </a>
  );
}

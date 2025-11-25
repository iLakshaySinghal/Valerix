import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-[rgba(8,16,24,0.8)] backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-[rgba(255,106,0,0.07)] ${className}`}>
      {children}
    </div>
  );
}

export const CardHeader = ({ title }) => (
  <h3 className="text-xl font-semibold mb-2 text-[var(--accent)]">{title}</h3>
);

export const CardContent = ({ children }) => <div>{children}</div>;

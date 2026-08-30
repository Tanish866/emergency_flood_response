import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-base-300 bg-base-100 p-4 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
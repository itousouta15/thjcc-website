import type { ReactNode } from "react";
import "@/styles/page-transitions.css";

export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-transition">{children}</div>;
}

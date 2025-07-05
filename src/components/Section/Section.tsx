import style from "./Section.module.css";
import type React from "react";
interface SectionProps {
  children: React.ReactNode;
}

export default function Section({ children }: SectionProps) {
  return <section className={style.section}>{children}</section>;
}

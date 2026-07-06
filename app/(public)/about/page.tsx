"use client";
import dynamic from "next/dynamic";
const Aboutpage = dynamic(() => import("@/src/views/About/Aboutpage"), { ssr: false });
export default function Page() { return <Aboutpage />; }

"use client";
import dynamic from "next/dynamic";
const SliderManagement = dynamic(() => import("@/src/admin/SliderManagement"), { ssr: false });
export default function Page() { return <SliderManagement />; }

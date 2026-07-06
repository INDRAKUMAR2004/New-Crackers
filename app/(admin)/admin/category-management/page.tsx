"use client";
import dynamic from "next/dynamic";
const CategoryManagement = dynamic(() => import("@/src/admin/CategoryManagement"), { ssr: false });
export default function Page() { return <CategoryManagement />; }

"use client";
import dynamic from "next/dynamic";
const InventoryManagement = dynamic(() => import("@/src/admin/InventoryManagement"), { ssr: false });
export default function Page() { return <InventoryManagement />; }

"use client";
import dynamic from "next/dynamic";
const AddProduct = dynamic(() => import("@/src/admin/AddProduct"), { ssr: false });
export default function Page() { return <AddProduct />; }

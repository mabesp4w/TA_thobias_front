/** @format */

"use client";
import { Suspense } from "react";
import Content from "./Content";

const LokasiPenjualanPage = () => {
  return (
    <section className="flex flex-col h-full">
      <Suspense fallback={<div>Loading...</div>}>
        <Content />
      </Suspense>
    </section>
  );
};

export default LokasiPenjualanPage;

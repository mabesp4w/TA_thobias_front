/** @format */

"use client";
import { useEffect, useState } from "react";
import { useWelcomeContext } from "@/context/WelcomeContext";
import { BiMap } from "react-icons/bi";
// import UMKMLocationMap from "@/components/map/UMKMLocationMap";

const PemetaanUMKMPage = () => {
  const { setWelcome } = useWelcomeContext();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setWelcome("Pemetaan UMKM");
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    await Promise.all([]);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pemetaan UMKM</h1>
        <div className="badge badge-info gap-2">
          <BiMap className="h-4 w-4" />0 UMKM
        </div>
      </div>

      {/* Map */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Peta Sebaran UMKM</h2>
          <div className="h-[600px] w-full rounded-lg overflow-hidden">
            {/* <UMKMLocationMap showControl={false} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PemetaanUMKMPage;

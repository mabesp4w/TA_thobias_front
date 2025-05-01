/** @format */

"use client";
import { useEffect, useState } from "react";
import { useWelcomeContext } from "@/context/WelcomeContext";
import useLokasiUMKM from "@/stores/crud/LokasiUMKM";
import useProvinsi from "@/stores/crud/Provinsi";
import useKabupaten from "@/stores/crud/Kabupaten";
import MapboxMap from "@/components/map/MapboxMap";
import { BiMap, BiFilter } from "react-icons/bi";

const PemetaanUMKMPage = () => {
  const { setWelcome } = useWelcomeContext();
  const { setLokasiUMKM, dtLokasiUMKM } = useLokasiUMKM();
  const { setProvinsi, dtProvinsi } = useProvinsi();
  const { setKabupaten, dtKabupaten } = useKabupaten();

  const [isLoading, setIsLoading] = useState(true);
  const [selectedProvinsi, setSelectedProvinsi] = useState("");
  const [selectedKabupaten, setSelectedKabupaten] = useState("");
  const [markers, setMarkers] = useState<any[]>([]);

  useEffect(() => {
    setWelcome("Pemetaan UMKM");
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    await Promise.all([
      setLokasiUMKM({ page: 1, limit: 1000 }),
      setProvinsi({ page: 1, limit: 100 }),
      setKabupaten({ page: 1, limit: 1000 }),
    ]);
    setIsLoading(false);
  };

  useEffect(() => {
    if (dtLokasiUMKM?.data) {
      // Filter data based on selected province/district
      let filteredData = dtLokasiUMKM.data;

      if (selectedProvinsi) {
        filteredData = filteredData.filter(
          (item) => item.kecamatan?.kabupaten?.provinsi_id === selectedProvinsi
        );
      }

      if (selectedKabupaten) {
        filteredData = filteredData.filter(
          (item) => item.kecamatan?.kabupaten_id === selectedKabupaten
        );
      }

      // Convert to map markers
      const mapMarkers = filteredData.map((item) => ({
        id: item.id,
        latitude: item.latitude,
        longitude: item.longitude,
        title: item.pengguna?.profil_umkm?.nm_bisnis || "UMKM",
        description: item.alamat_lengkap,
      }));

      setMarkers(mapMarkers);
    }
  }, [dtLokasiUMKM, selectedProvinsi, selectedKabupaten]);

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
          <BiMap className="h-4 w-4" />
          {markers.length} UMKM
        </div>
      </div>

      {/* Filters */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <div className="flex items-center gap-2 mb-4">
            <BiFilter className="h-5 w-5" />
            <h2 className="card-title">Filter Wilayah</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Provinsi</span>
              </label>
              <select
                className="select select-bordered"
                value={selectedProvinsi}
                onChange={(e) => {
                  setSelectedProvinsi(e.target.value);
                  setSelectedKabupaten("");
                }}
              >
                <option value="">Semua Provinsi</option>
                {dtProvinsi?.data?.map((prov: any) => (
                  <option key={prov.id} value={prov.id}>
                    {prov.nm_provinsi}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Kabupaten/Kota</span>
              </label>
              <select
                className="select select-bordered"
                value={selectedKabupaten}
                onChange={(e) => setSelectedKabupaten(e.target.value)}
                disabled={!selectedProvinsi}
              >
                <option value="">Semua Kabupaten/Kota</option>
                {dtKabupaten?.data
                  ?.filter((kab: any) => kab.provinsi_id === selectedProvinsi)
                  ?.map((kab: any) => (
                    <option key={kab.id} value={kab.id}>
                      {kab.nm_kabupaten}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Peta Sebaran UMKM</h2>
          <div className="h-[600px] w-full rounded-lg overflow-hidden">
            <MapboxMap markers={markers} zoom={selectedProvinsi ? 10 : 5} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PemetaanUMKMPage;

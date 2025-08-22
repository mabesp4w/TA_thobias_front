/** @format */
import Image from "next/image";
import moment from "moment";
import Link from "next/link";
import { BASE_URL } from "./baseURL";
import showRupiah from "./rupiah";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Tambahkan import ini
import { useState } from "react"; // Tambahkan import ini untuk state toggle

const getYouTubeVideoId = (url: string) => {
  const regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const getProperty = (obj: any, prop: any, index: number, setIndexBox: any) => {
  const parts = prop.split(".");
  if (parts.length > 0) {
    const first = parts[0];
    const rest = parts.slice(1);
    // Jika properti pertama adalah array
    if (Array.isArray(obj[first])) {
      // Untuk kasus categories.category_nm atau array lainnya
      if (obj[first].length > 0 && rest.length > 0) {
        // Ambil semua nilai dari array untuk properti yang diminta
        const values = obj[first]
          .map((item) => {
            let value = item;
            // Lanjutkan dengan properti selanjutnya
            for (const part of rest) {
              if (value && typeof value === "object") {
                value = value[part];
              } else {
                return null;
              }
            }
            return value;
          })
          .filter((val) => val !== null && val !== undefined);
        // Tampilkan semua nilai yang ditemukan, dipisahkan oleh koma
        if (values.length > 0) {
          return <p className="capitalize">{values.join(", ")}</p>;
        }
      }
      // Jika array kosong
      return "";
    }
    // Proses untuk properti bukan array (seperti kode asli)
    let current = first;
    let currentObj = obj[current];
    let i = 1;
    while (currentObj && i < parts.length) {
      current = parts[i];
      currentObj = currentObj[current];
      i++;
    }
    // Date processing
    const dateProps = ["announcement_date", "news_date", "tgl_bergabung"];
    if (dateProps.includes(prop)) {
      return moment(currentObj).format("DD/MM/YYYY");
    }
    // Image processing
    const fileProps = ["gambar_utama", "file_book"];
    if (fileProps.includes(prop)) {
      const extension = currentObj?.split(".")?.pop();
      const file_nm = currentObj?.split("/")?.pop();
      return (
        currentObj &&
        (["png", "jpg", "jpeg"].includes(extension) ? (
          <Image
            src={`${BASE_URL}/${currentObj}`}
            loading="lazy"
            width={70}
            height={70}
            alt=""
            className="cursor-pointer"
            onClick={(e: any) => {
              e.stopPropagation();
              setIndexBox?.(index);
            }}
          />
        ) : ["epub"].includes(extension) ? (
          <Link
            href={`/admin/books/views?file_nm=${file_nm}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-700"
          >
            Baca Buku
          </Link>
        ) : (
          <a
            href={`${currentObj}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-700"
          >
            Lihat File
          </a>
        ))
      );
    }
    // YouTube URL processing
    const YoutubUrl = ["youtube_url"];
    if (YoutubUrl.includes(prop)) {
      return (
        <a href={currentObj} target="_blank" rel="noopener noreferrer">
          <Image
            src={`https://img.youtube.com/vi/${getYouTubeVideoId(
              currentObj
            )}/0.jpg`}
            loading="lazy"
            width={70}
            height={70}
            alt=""
            className="cursor-pointer"
          />
        </a>
      );
    }
    // boolean value
    const booleanProps = ["aktif"];
    if (booleanProps.includes(prop)) {
      return currentObj ? "Ya" : "Tidak";
    }
    // rupiah
    const rupiahProps = ["harga", "biaya_upah", "biaya_produksi"];
    if (rupiahProps.includes(prop)) {
      return showRupiah(currentObj);
    }
    // Password toggle visibility
    const passwordProps = ["show_password"];
    if (passwordProps.includes(prop)) {
      const PasswordToggle = () => {
        const [visible, setVisible] = useState(false);
        return (
          <div className="flex items-center gap-2">
            <span>{visible ? currentObj : "******"}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setVisible(!visible);
              }}
              className="focus:outline-none"
            >
              {visible ? (
                <AiFillEyeInvisible
                  size={20}
                  className="text-gray-500 hover:text-gray-700"
                />
              ) : (
                <AiFillEye
                  size={20}
                  className="text-gray-500 hover:text-gray-700"
                />
              )}
            </button>
          </div>
        );
      };
      return <PasswordToggle />;
    }
    // Default case
    return <p className="capitalize">{currentObj || ""}</p>;
  }
  throw new Error("parts is not valid array");
};
export default getProperty;

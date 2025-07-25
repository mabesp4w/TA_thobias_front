/** @format */
// components/input/CameraCapture.tsx
"use client";
import { FC, useEffect, useState, useRef } from "react";
import Resizer from "react-image-file-resizer";

type Props = {
  onCapture: (file: File) => void;
  onCancel: () => void;
};

const CameraCapture: FC<Props> = ({ onCapture, onCancel }) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );
  const [showSwitchButton, setShowSwitchButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cleanup camera stream on component unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const resizeFile = (file: File) =>
    new Promise<void>((resolve) => {
      if (file) {
        const splitType = file?.type?.split("/") || [];
        const type = splitType[0];
        if (type !== "image") {
          onCapture(file);
          resolve();
          return;
        }
        Resizer.imageFileResizer(
          file,
          500,
          500,
          splitType[1],
          100,
          0,
          (uri) => {
            onCapture(uri as File);
            resolve();
          },
          "file"
        );
      }
    });

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setCameraError(null);
      setIsVideoReady(false);
      console.log("🎥 Starting camera...");

      // Stop any previous stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }

      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported in this browser");
      }

      // Simplified approach - start with basic constraints first
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
        },
        audio: false,
      };

      try {
        console.log("📋 Trying constraints:", constraints);
        const mediaStream = await navigator.mediaDevices.getUserMedia(
          constraints
        );

        // Get video track capabilities after successful stream
        const videoTrack = mediaStream.getVideoTracks()[0];
        console.log("📋 Video track settings:", videoTrack.getSettings());

        if (videoTrack.getCapabilities) {
          const capabilities = videoTrack.getCapabilities();
          console.log("📋 Camera capabilities:", capabilities);

          // Check if device supports camera switching
          if (
            capabilities.facingMode &&
            Array.isArray(capabilities.facingMode) &&
            capabilities.facingMode.length > 1
          ) {
            setShowSwitchButton(true);
          } else {
            setShowSwitchButton(false);
          }
        }

        console.log("✅ Camera stream obtained");
        setStream(mediaStream);
        setIsCameraActive(true);

        // Setup video element
        if (videoRef.current) {
          const video = videoRef.current;
          video.srcObject = mediaStream;

          // Single event handler approach
          const handleVideoReady = () => {
            console.log(
              "📹 Video ready - dimensions:",
              video.videoWidth,
              "x",
              video.videoHeight
            );
            if (video.videoWidth > 0 && video.videoHeight > 0) {
              setIsVideoReady(true);
              setIsLoading(false);

              // Ensure video is playing
              if (video.paused) {
                video.play().catch((e) => {
                  console.warn("Auto-play blocked:", e);
                  setCameraError("Tap video untuk memulai");
                  setIsLoading(false);
                });
              }
            }
          };

          // Use loadedmetadata as primary event
          video.onloadedmetadata = handleVideoReady;

          // Fallback timeout
          setTimeout(() => {
            if (!isVideoReady && video.videoWidth > 0) {
              console.log("📹 Fallback setup triggered");
              handleVideoReady();
            } else if (!isVideoReady) {
              console.log("❌ Video still not ready after timeout");
              setCameraError("Video gagal dimuat, coba lagi");
              setIsLoading(false);
            }
          }, 3000);
        }
      } catch (error: any) {
        console.error("❌ getUserMedia error with constraints:", error);

        // Fallback: try with simpler constraints
        console.log("🔄 Trying fallback constraints...");
        const fallbackConstraints: MediaStreamConstraints = {
          video: true,
          audio: false,
        };

        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia(
            fallbackConstraints
          );
          console.log("✅ Fallback camera stream obtained");

          setStream(mediaStream);
          setIsCameraActive(true);
          setShowSwitchButton(false); // Disable switch for fallback mode

          if (videoRef.current) {
            const video = videoRef.current;
            video.srcObject = mediaStream;

            video.onloadedmetadata = () => {
              console.log("📹 Fallback video ready");
              setIsVideoReady(true);
              setIsLoading(false);

              if (video.paused) {
                video.play().catch((e) => {
                  console.warn("Auto-play blocked:", e);
                  setCameraError("Tap video untuk memulai");
                  setIsLoading(false);
                });
              }
            };

            // Fallback timeout
            setTimeout(() => {
              if (!isVideoReady) {
                setCameraError("Video gagal dimuat, coba lagi");
                setIsLoading(false);
              }
            }, 3000);
          }
        } catch (fallbackError: any) {
          console.error("❌ Fallback getUserMedia error:", fallbackError);
          throw fallbackError;
        }
      }
    } catch (error: any) {
      console.error("❌ Camera setup error:", error);

      // Provide specific error messages
      let errorMessage = "Gagal mengakses kamera";

      if (
        error.name === "NotFoundError" ||
        error.name === "DevicesNotFoundError"
      ) {
        errorMessage = "Kamera tidak ditemukan";
      } else if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        errorMessage =
          "Akses kamera ditolak. Mohon izinkan akses kamera di browser";
      } else if (
        error.name === "NotReadableError" ||
        error.name === "TrackStartError"
      ) {
        errorMessage = "Kamera sedang digunakan aplikasi lain";
      } else if (error.name === "OverconstrainedError") {
        errorMessage = "Kamera tidak mendukung pengaturan yang diminta";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setCameraError(errorMessage);
      setIsCameraActive(false);
      setIsVideoReady(false);
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    console.log("🛑 Stopping camera...");
    if (stream) {
      stream.getTracks().forEach((track) => {
        console.log("🔌 Stopping track:", track.label);
        track.stop();
      });
      setStream(null);
    }
    setIsCameraActive(false);
    setIsVideoReady(false);
    setCameraError(null);
    setShowSwitchButton(false);
    setIsLoading(false);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
  };

  const switchCamera = async () => {
    console.log("🔄 Switching camera...");
    const newMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newMode);

    if (isCameraActive) {
      stopCamera();
      // Small delay before restarting
      setTimeout(() => {
        startCamera();
      }, 500);
    }
  };

  const capturePhoto = () => {
    console.log("📸 Attempting to capture photo...");

    if (!videoRef.current || !canvasRef.current) {
      console.error("❌ Video or canvas ref not available");
      setCameraError("Video atau canvas tidak tersedia");
      return;
    }

    const video = videoRef.current;

    // For iOS, ensure video is playing
    if (video.paused) {
      setCameraError("Video belum aktif, tap video terlebih dahulu");
      return;
    }

    try {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Cannot get canvas context");
      }

      // Check video dimensions
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      if (videoWidth === 0 || videoHeight === 0) {
        throw new Error("Video belum siap, coba lagi");
      }

      // Set canvas dimensions to match video
      canvas.width = videoWidth;
      canvas.height = videoHeight;

      console.log("🎨 Drawing to canvas:", {
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        videoWidth,
        videoHeight,
      });

      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            console.log("✅ Photo captured successfully, size:", blob.size);
            // Create a File object from blob
            const file = new File([blob], `camera-${Date.now()}.jpg`, {
              type: "image/jpeg",
            });

            // Process the captured file
            resizeFile(file);

            // Stop camera after capture
            stopCamera();
          } else {
            console.error("❌ Failed to create blob from canvas");
            setCameraError("Gagal mengambil foto");
          }
        },
        "image/jpeg",
        0.9
      );
    } catch (error: any) {
      console.error("❌ Capture error:", error);
      setCameraError(error.message || "Error mengambil foto");
    }
  };

  // Handle video click for iOS/mobile play issues
  const handleVideoClick = async () => {
    console.log("👆 Video clicked");
    if (videoRef.current && videoRef.current.paused) {
      try {
        await videoRef.current.play();
        console.log("✅ Video resumed");
        setCameraError(null);
      } catch (e) {
        console.error("❌ Play failed:", e);
        setCameraError("Tidak dapat memutar video");
      }
    }
  };

  return (
    <div className="space-y-3">
      {cameraError && (
        <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700">
          <p className="text-sm">{cameraError}</p>
          {!isCameraActive && (
            <button
              type="button"
              className="mt-2 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
              onClick={startCamera}
            >
              Coba Lagi
            </button>
          )}
        </div>
      )}

      {!isCameraActive && !isLoading ? (
        <div className="flex gap-2">
          <button
            type="button"
            className="btn btn-primary flex-1"
            onClick={startCamera}
          >
            📷 Aktifkan Kamera
          </button>
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Batal
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay={true}
              playsInline={true}
              muted={true}
              controls={false}
              className="w-full h-64 object-cover cursor-pointer"
              onClick={handleVideoClick}
              style={{
                maxHeight: "400px",
                minHeight: "240px",
                width: "100%",
                backgroundColor: "#000",
                display: "block",
              }}
            />

            {/* Loading overlay */}
            {(isLoading || (isCameraActive && !isVideoReady)) &&
              !cameraError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                  <div className="text-white text-center">
                    <div className="loading loading-spinner loading-lg mb-2"></div>
                    <div className="text-sm">Memuat kamera...</div>

                    {/* Debug info (remove in production) */}
                    {process.env.NODE_ENV === "development" && (
                      <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs p-2 rounded max-w-xs">
                        <div>Loading: {isLoading ? "✅" : "❌"}</div>
                        <div>Camera Active: {isCameraActive ? "✅" : "❌"}</div>
                        <div>Video Ready: {isVideoReady ? "✅" : "❌"}</div>
                        <div>Stream: {stream ? "Active" : "None"}</div>
                        <div>
                          Video State: {videoRef.current?.readyState || "N/A"}
                        </div>
                        <div>
                          Video Size: {videoRef.current?.videoWidth || 0}x
                          {videoRef.current?.videoHeight || 0}
                        </div>
                        <div>
                          Client Size: {videoRef.current?.clientWidth || 0}x
                          {videoRef.current?.clientHeight || 0}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* Tap to play overlay for mobile */}
            {isCameraActive &&
              isVideoReady &&
              cameraError?.includes("Tap video") && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 pointer-events-none">
                  <div className="text-white text-center bg-black bg-opacity-75 p-4 rounded-lg">
                    <div className="text-4xl mb-2">▶️</div>
                    <div className="text-sm">Tap untuk mulai</div>
                  </div>
                </div>
              )}
          </div>

          {/* Control buttons */}
          {isCameraActive && (
            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-success flex-1"
                onClick={capturePhoto}
                disabled={!isVideoReady}
              >
                📸 Ambil Foto
              </button>
              {showSwitchButton && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={switchCamera}
                  title="Ganti Kamera"
                  disabled={isLoading}
                >
                  🔄
                </button>
              )}
              <button
                type="button"
                className="btn btn-ghost"
                onClick={onCancel}
                disabled={isLoading}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-error"
                onClick={stopCamera}
                disabled={isLoading}
              >
                ❌ Stop
              </button>
            </div>
          )}
        </div>
      )}

      {/* Hidden canvas for capturing photos */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default CameraCapture;

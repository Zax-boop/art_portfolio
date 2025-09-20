"use client";
import Image from "next/image";
import Link from "next/link";
import Header from "./components/general/header";
import supabase from "../../utils/general/supabaseclient";
import { useState, useEffect, useRef } from "react";
import AddArt from "./components/art/addArt";
import { PlusIcon } from "lucide-react"
import { useMediaQuery } from "react-responsive";


export default function HomePage() {
  type Art = {
    id: string
    created_at: string | null
    name: string | null
    description: string | null
    image: string | undefined
    created: string | null
  }
  const [isClient, setIsClient] = useState(false);
  const isMobileQuery = useMediaQuery({ query: '(max-width: 650px)' });

  const isMobile = isClient && isMobileQuery;

  useEffect(() => {
    setIsClient(true);
  }, []); 
  const [art, setArt] = useState<Art[]>([])
  const [showAddArtModal, setShowAddArtModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (activeIndex === null) return;
      if (e.key === "ArrowLeft" && activeIndex > 0) setActiveIndex(activeIndex - 1);
      if (e.key === "ArrowRight" && activeIndex < art.length - 1) setActiveIndex(activeIndex + 1);
      if (e.key === "Escape") setActiveIndex(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, art.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || activeIndex === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50 && activeIndex < art.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else if (diff < -50 && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
    touchStartX.current = null;
  };

  const handleChange = (newIndex: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setActiveIndex(newIndex);
      setIsAnimating(false);
    }, 200);
  };

  const fetchArt = async () => {
    const { data, error } = await supabase
      .from("artwork")
      .select("*")
      .order("created", { ascending: false })
    if (!error && data) setArt(data)
  }

  useEffect(() => {
    fetchArt()
    setLoading(false)
  }, [])

  return (
    <div className="bg-white flex flex-col w-full items-center pb-20 min-h-[100vh]">
      <div className="xs:w-3/5 md:w-1/5">
        <Header />
      </div>
      <div className="w-11/12">
        {!isMobile && <div className="w-full flex justify-end">
          <button
            onClick={() => setShowAddArtModal(true)}
            className="flex items-center gap-2 pl-3 mr-2 py-2 bg-white border border-black text-black rounded-full hover:bg-black hover:text-white transition duration-300 cursor-pointer"
          >
            Add Art
            <PlusIcon className="w-5 h-5 mr-2" />
          </button>
        </div>}

        {showAddArtModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-11/12 max-w-[40rem] relative">
              <button
                onClick={() => setShowAddArtModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
              <AddArt
                onUpload={() => {
                  fetchArt()
                  setShowAddArtModal(false)
                }}
              />
            </div>
          </div>
        )}
        {art.length > 0 ? (
          <div className="xs:mt-2 md:mt-6 w-full">
            <div
              className={
                art.length <= 2
                  ? "xs:flex xs:flex-row xs:gap-2 xs:justify-start sm:grid sm:grid-cols-4 sm:gap-4"
                  : "xs:columns-2 sm:columns-4 xs:gap-2 sm:gap-4"
              }
            >
              {art
                .sort((a, b) => {
                  const dateA = a.created ? new Date(a.created).getTime() : 0;
                  const dateB = b.created ? new Date(b.created).getTime() : 0;
                  return dateB - dateA;
                })
                .map((piece, index) => (
                  <div
                    key={piece.id}
                    className={
                      art.length <= 2
                        ? "xs:w-1/2 sm:w-auto flex flex-col items-center mb-4 cursor-pointer opacity-0 animate-fadeIn transition-transform duration-500 ease-out transform hover:scale-105"
                        : "break-inside-avoid flex flex-col items-center mb-4 cursor-pointer opacity-0 animate-fadeIn transition-transform duration-500 ease-out transform hover:scale-105"
                    }
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => setActiveIndex(index)}
                  >
                    <img
                      src={piece.image}
                      alt={piece.description || "Art"}
                      className="w-full h-auto object-cover rounded-xl shadow-md transition-shadow duration-500 opacity-"
                    />
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <p>Loading art...</p>
        )}
        {activeIndex !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200 bg-opacity-90 p-4"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Close button */}
            <button
              onClick={() => setActiveIndex(null)}
              className="absolute top-4 right-4 text-black text-3xl md:text-4xl z-50 cursor-pointer transition-transform duration-200 ease-out hover:scale-110 hover:text-red-600"
            >
              ✕
            </button>
            {activeIndex > 0 && (
              <button
                onClick={() => handleChange(activeIndex - 1)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-3xl md:text-4xl z-50 px-2 py-1 rounded-full text-black transition-transform duration-200 ease-out hover:scale-110"
              >
                ‹
              </button>
            )}
            {activeIndex < art.length - 1 && (
              <button
                onClick={() => handleChange(activeIndex + 1)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-3xl md:text-4xl z-50 px-2 py-1 rounded-full text-black transition-transform duration-200 ease-out hover:scale-110"
              >
                ›
              </button>
            )}
            <img
              src={art[activeIndex].image}
              alt={art[activeIndex].description || "Full screen art"}
              className={`max-h-[48rem] max-w-[70rem] object-contain rounded-lg shadow-lg transition-opacity duration-200 ${isAnimating ? "opacity-0" : "opacity-100"
                }`}
            />
          </div>
        )}
      </div>
    </div>
  )
}

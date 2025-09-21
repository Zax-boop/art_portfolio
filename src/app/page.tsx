"use client";
import supabase from "../../utils/general/supabaseclient";
import { useState, useEffect, useRef } from "react";
import AddArt from "./components/art/addArt";
import { PlusIcon } from "lucide-react";
import { User } from "@supabase/supabase-js";

export default function HomePage() {
  type Art = {
    id: string;
    created_at: string | null;
    image: string | undefined;
    type: "drawing" | "painting" | "other";
  };

  const [activeTab, setActiveTab] = useState<"drawing" | "painting" | "other">("drawing");
  const [art, setArt] = useState<Art[]>([]);
  const [showAddArtModal, setShowAddArtModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [firstOpen, setFirstOpen] = useState(true);
  const touchStartX = useRef<number | null>(null);

  const tabs = ["drawing", "painting", "other"] as const;
  const tabRefs = useRef<Record<typeof tabs[number], HTMLButtonElement | null>>({
    drawing: null,
    painting: null,
    other: null,
  });
  const [highlightStyle, setHighlightStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };
    getSession();
  }, []);

  const fetchArt = async () => {
    const { data, error } = await supabase.from("artwork").select("*");
    if (!error && data) setArt(data);
  };

  useEffect(() => {
    fetchArt();
  }, []);

  const filteredArt = art.filter((piece) => {
    if (activeTab === "other") return piece.type !== "drawing" && piece.type !== "painting";
    return piece.type === activeTab;
  });

  useEffect(() => {
    const el = tabRefs.current[activeTab];
    if (el) {
      setHighlightStyle({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [activeTab]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (activeIndex === null) return;
      if (e.key === "ArrowLeft" && activeIndex > 0) setActiveIndex(activeIndex - 1);
      if (e.key === "ArrowRight" && activeIndex < filteredArt.length - 1) setActiveIndex(activeIndex + 1);
      if (e.key === "Escape") setActiveIndex(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, filteredArt.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || activeIndex === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50 && activeIndex < filteredArt.length - 1) setActiveIndex(activeIndex + 1);
    else if (diff < -50 && activeIndex > 0) setActiveIndex(activeIndex - 1);
    touchStartX.current = null;
  };

  const handleChange = (newIndex: number) => {
    if (newIndex === activeIndex) return;
    setDirection(newIndex > activeIndex! ? "right" : "left");
    setIsAnimating(true);
    setTimeout(() => {
      setActiveIndex(newIndex);
      setIsAnimating(false);
    }, 200);
  };

  return (
    <div className="bg-white flex flex-col w-full items-center pb-20 min-h-[100vh]">
      <div className="w-11/12">
        {user && (
          <div className="w-full flex justify-end mb-2 md:mb-0">
            <button
              onClick={() => setShowAddArtModal(true)}
              className="flex items-center gap-2 pl-3 mr-2 py-2 bg-white border border-black text-black rounded-full hover:bg-black hover:text-white transition duration-300 cursor-pointer"
            >
              Add Art
              <PlusIcon className="w-5 h-5 mr-2" />
            </button>
          </div>
        )}
        {showAddArtModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-11/12 max-w-[40rem] relative">
              <button onClick={() => setShowAddArtModal(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
                ✕
              </button>
              <AddArt
                onUpload={() => {
                  fetchArt();
                  setShowAddArtModal(false);
                }}
              />
            </div>
          </div>
        )}
        <div className="flex flex-row w-full justify-center">
          <div className="relative flex justify-center w-[20rem] md:w-[22.5rem] gap-4 mb-6 bg-gray-100 px-2 py-1 rounded-full border border-gray-800">
            <span
              className="absolute top-0 bottom-0 bg-black rounded-full transition-all duration-300"
              style={{
                left: highlightStyle.left,
                width: highlightStyle.width,
              }}
            />
            {tabs.map((tab) => (
              <button
                key={tab}
                ref={(el) => {
                  tabRefs.current[tab] = el;
                }}
                onClick={() => setActiveTab(tab)}
                className={`relative z-0 px-6 py-2 text-sm md:text-lg font-medium transition-colors duration-300 ${activeTab === tab ? "text-white" : "text-black hover:text-gray-500"}`}
              >
                {tab[0].toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {filteredArt.length > 0 ? (
          <div className="xs:mt-2 md:mt-6 w-full">
            <div
              className={
                filteredArt.length <= 2
                  ? "xs:flex xs:flex-row xs:gap-2 xs:justify-start sm:grid sm:grid-cols-4 sm:gap-4"
                  : "xs:columns-2 sm:columns-3 xs:gap-2 sm:gap-4"
              }
            >
              {filteredArt.map((piece, index) => (
                <div
                  key={piece.id}
                  className={
                    filteredArt.length <= 2
                      ? "xs:w-1/2 sm:w-auto flex flex-col items-center mb-4 cursor-pointer opacity-0 animate-fadeIn transition-transform duration-500 ease-out transform hover:scale-105"
                      : "break-inside-avoid flex flex-col items-center mb-4 cursor-pointer opacity-0 animate-fadeIn transition-transform duration-500 ease-out transform hover:scale-105"
                  }
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => (setActiveIndex(index), setFirstOpen(true))}
                >
                  <img src={piece.image} alt="Art" className="w-full h-auto object-cover rounded-xl shadow-md transition-shadow duration-500" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-700">Loading...</p>
        )}
        {activeIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200 bg-opacity-90 p-4" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <button
              onClick={() => (setActiveIndex(null), setFirstOpen(true))}
              className="absolute top-4 right-4 text-black text-3xl md:text-4xl z-50 cursor-pointer transition-transform duration-200 ease-out hover:scale-110 hover:text-red-600"
            >
              ✕
            </button>
            {activeIndex > 0 && (
              <button
                onClick={() => handleChange(activeIndex - 1)}
                className="hidden md:block absolute left-4 top-1/2 transform -translate-y-1/2 text-3xl md:text-4xl z-50 px-2 py-1 rounded-full text-black transition-transform duration-200 ease-out hover:scale-110"
              >
                ‹
              </button>
            )}
            {activeIndex < filteredArt.length - 1 && (
              <button
                onClick={() => handleChange(activeIndex + 1)}
                className="hidden md:block absolute right-4 top-1/2 transform -translate-y-1/2 text-3xl md:text-4xl z-50 px-2 py-1 rounded-full text-black transition-transform duration-200 ease-out hover:scale-110"
              >
                ›
              </button>
            )}
            <img
              src={filteredArt[activeIndex].image}
              alt="Full screen art"
              className={`max-h-[30rem] md:max-h-[48rem] md:max-w-[70rem] object-contain rounded-lg shadow-lg transition-transform duration-200 ease-out ${firstOpen ? "opacity-0 animate-fadeIn" : ""} ${
                isAnimating ? (direction === "left" ? "-translate-x-20 opacity-0" : "translate-x-20 opacity-0") : "translate-x-0 opacity-100"
              }`}
              onAnimationEnd={() => setFirstOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

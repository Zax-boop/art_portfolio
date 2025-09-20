"use client";
import React, { useEffect, useRef, useState } from "react";

export default function About() {
  const textRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  const [textVisible, setTextVisible] = useState(false);
  const [imgVisible, setImgVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === textRef.current && entry.isIntersecting) {
            setTextVisible(true);
          }
          if (entry.target === imgRef.current && entry.isIntersecting) {
            setImgVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (textRef.current) observer.observe(textRef.current);
    if (imgRef.current) observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-white overflow-clip flex flex-col w-full items-center text-black pb-20">
      <div className="flex flex-col lg:flex-row w-11/12 md:mt-20 mb-20 gap-10 items-center lg:items-start">
        <div
          ref={textRef}
          className={`flex flex-col lg:w-2/3 transition-opacity duration-1000 ease-out ${
            textVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-lg leading-8 lg:text-xl">
            I am a passionate artist with a love for creating unique and thought-provoking pieces. My
            work explores the intersection of technology and art, often incorporating digital elements
            into traditional mediums. I believe that art has the power to inspire change and challenge
            perceptions, and I strive to create pieces that do just that. When I'm not creating art, I
            enjoy exploring new technologies and finding ways to integrate them into my work. Feel
            free to reach out if you'd like to collaborate or learn more about my art!
          </p>
        </div>
        <div
          ref={imgRef}
          className={`flex flex-col lg:w-1/3 transition-opacity duration-1000 ease-out pb-5 md:pb-0 ${
            imgVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src="/tmp_profile_photo.jpeg"
            alt="About Me"
            className="w-full h-auto object-cover rounded-xl shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}

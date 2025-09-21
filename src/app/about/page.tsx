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
      <div className="flex flex-col w-11/12 md:mt-20 mb-8 md:mb-20 gap-8 md:gap-10 items-start text-gray-800">
        <div className="w-full flex justify-center">
          <img src="/about_photo.png" alt="About Imagination Art" className={`w-full rounded-lg shadow-lg transition-opacity duration-1000 animate-fadeIn`} />
        </div>
        <h1 className="mb-6 text-4xl font-bold text-center">About Imagination Art</h1>
        <section className="space-y-4">
          <p>
            <span className="font-semibold">Dear Parents,</span>
          </p>
          <p>
            Welcome to <span className="font-semibold">Imagination Art</span>. We offer a serene space where both
            children and adults can unleash their creativity without any distractions. It is a classical-style,
            private art class, founded in <strong>January 2015</strong> in Fremont.
          </p>
        </section>

        <section className="mt-2 md:mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">Meet the Teacher</h2>
          <p>
            My name is <strong>Anubhuti</strong>, and I am a very passionate artist with a strong interior
            design background. I have been teaching, designing, and developing art lessons as a professional
            artist for more than 10 years for all age groups in different schools, institutes, and local art
            galleries, and I work as a commission artist as well.
          </p>
          <p>
            The freedom of expression that a blank canvas gives to an artist got me into the profession. My
            paintings and artworks are mainly based on my self-imagination and experiences. I work in different
            mediums like oil, acrylic, pencil, charcoal, mixed media, clay, and many more.
          </p>
        </section>

        <section className="mt-2 md:mt-10 space-y-2">
          <h2 className="text-2xl font-semibold">Qualifications</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Degree in Interior Design from the University of Bangalore, India
            </li>
            <li>
              Special courses in graphite drawing, oil painting, acrylic painting, charcoal drawing,
              watercolor painting, and mixed media art from UC Berkeley, CA, USA
            </li>
          </ul>
        </section>

        <section className="mt-2 md:mt-10 space-y-4">
          <h2 className="text-2xl font-semibold">Weekly Art Classes</h2>
          <p>
            All students learn drawing, sketching, watercolor, acrylic painting, charcoal, oil pastel, clay,
            craft, and more (different subjects are taught each week based on different techniques).
          </p>
          <p>
            <strong>Class Duration:</strong> 90 minutes
            <br />
            <strong>First Class:</strong> Free trial
            <br />
            <strong>Fee:</strong> $15/class
            <br />
            <strong>Material Fee:</strong> Basic materials will be provided. Special projects (acrylic on
            canvas, clay, or mixed media) will include the basic material fee in that month's fee.
          </p>
        </section>

        <section className="mt-2 md:mt-10 space-y-2">
          <h2 className="text-2xl font-semibold">Contact Information</h2>
          <p>
            Email:{" "}
            <a
              href="mailto:imagination.arts.class@gmail.com"
              className="text-blue-600 underline hover:text-blue-800"
              target="_blank"
            >
              imagination.arts.class@gmail.com
            </a>
            <br />
            Phone:{" "}
            510-378-1238
          </p>
        </section>
      </div>
    </div>
  );
}

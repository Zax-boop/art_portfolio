"use client";

import React, { useState } from "react";
import Header from "../components/general/header";


export default function Contact() {
    const [name, setName] = useState("");
    const [nameFocus, setNameFocus] = useState(false);
    const [email, setEmail] = useState("");
    const [emailFocus, setEmailFocus] = useState(false);
    const [message, setMessage] = useState("");
    const [messageFocus, setMessageFocus] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const mailtoLink = `mailto:rohan.arya01@gmail.com?subject=Message from ${name}&body=${encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\n${message}`
        )}`;
        const newWindow = window.open(mailtoLink, "_blank");
        if (newWindow) newWindow.focus();
    };

    return (
        <div className="bg-white min-h-screen flex flex-col w-full items-center">
            <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-8 text-black animate-fadeIn mt-8 md:mt-20">
                Contact
            </h1>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col w-11/12 max-w-lg gap-6"
            >
                <div
                    className="relative group opacity-0 translate-y-4 animate-fadeInUp"
                    style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
                >
                    <input
                        type="text"
                        className="w-full p-2 bg-transparent outline-none text-black border-b-[1px] border-black/[0.6] focus:border-white"
                        placeholder="Your Name"
                        value={name}
                        onFocus={() => setNameFocus(true)}
                        onBlur={() => setNameFocus(false)}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <span
                        className={`absolute -bottom-0.5 left-0 h-[2px] bg-black transition-all duration-300 ${nameFocus || name ? "w-full" : "w-0"
                            }`}
                    />
                </div>
                <div
                    className="relative group opacity-0 translate-y-4 animate-fadeInUp"
                    style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
                >
                    <input
                        type="text"
                        className="w-full p-2 bg-transparent outline-none text-black border-b-[1px] border-black/[0.6] focus:border-white"
                        placeholder="Your Email"
                        value={email}
                        onFocus={() => setEmailFocus(true)}
                        onBlur={() => setEmailFocus(false)}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <span
                        className={`absolute -bottom-0.5 left-0 h-[2px] bg-black transition-all duration-300 ${emailFocus || email ? "w-full" : "w-0"
                            }`}
                    />
                </div>
                <div
                    className="relative group opacity-0 translate-y-4 animate-fadeInUp"
                    style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
                >
                    <textarea
                        placeholder="Your Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onFocus={() => setMessageFocus(true)}
                        onBlur={() => setMessageFocus(false)}
                        required
                        rows={6}
                        className="w-full p-2 bg-transparent outline-none text-black border-b-[1px] border-black/[0.6] focus:border-white"
                    />
                    <span
                        className={`absolute -bottom-0.5 left-0 h-[2px] bg-black transition-all duration-300 ${messageFocus || message ? "w-full" : "w-0"
                            }`}
                    />
                </div>
                <button
                    type="submit"
                    className="self-start bg-black text-white px-6 py-3 rounded hover:bg-gray-900 transition-colors duration-300 opacity-0 animate-fadeInUp"
                    style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}
                >
                    Send
                </button>
            </form>
        </div>
    );
}

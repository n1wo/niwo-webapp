"use client";
import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/Input";

export default function Contact() {
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // stop normal submit
    setShowPopup(true); // show thank-you message

    // Optionally: send data to backend here
    // await fetch("/api/contact", { method: "POST", body: new FormData(e.currentTarget) });

    e.currentTarget.reset(); // clear form
    setTimeout(() => setShowPopup(false), 4000); // hide popup after 4 seconds
  };


  return (
    <>
      <div className="grid lg:grid-cols-2 grid-cols-1 min-h-[80vh] ">
        {/* Coontainer Image */}
        <div className="relative min-h-[300px] h-full">
          <Image
            className="center"
            src="/assets/graphics/pexels-gustavo-peres.jpg"
            alt="Site Image"
            fill
            style={{
              objectFit: "cover",
            }}
          />
        </div>
        {/* Coontainer Form */}
        <div className="mx-9 mt-28 mb-28">
          <div className="flex flex-col text-content-1 semi-bold text-4xl">
            <div className="flex flex-row">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 my-auto mr-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
              <h1>Let&apos;s Talk</h1>
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="text-conten-1 mx-auto mt-10"
            action="/send-data-here"
            method="post"
          >
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              {/* First Name*/}
              <div>
                <label className="block leading-6" htmlFor="first-name">
                  First Name
                </label>
                <div className="mt-2.5">
                  <Input
                    className="block w-full"
                    placeholder="Your First Name"
                    type="text"
                    id="first-name"
                    name="first-name"
                    required
                  />
                </div>
              </div>
              {/* Last Name*/}
              <div>
                <label className="block leading-6" htmlFor="last-name">
                  Last Name
                </label>
                <div className="mt-2.5">
                  <Input
                    className="block w-full"
                    placeholder="Your Last Name"
                    type="text"
                    id="last-name"
                    name="last-name"
                    required
                  />
                </div>
              </div>
              {/* Company */}
              <div className="sm:col-span-2">
                <label className="block leading-6" htmlFor="company">
                  Company
                </label>
                <div className="mt-2.5">
                  <Input
                    className="block w-full"
                    placeholder="Company name"
                    type="text"
                    id="company"
                    name="company"
                    required
                  />
                </div>
              </div>
              {/* Email */}
              <div className="sm:col-span-2">
                <label className="block leading-6" htmlFor="email">
                  Email
                </label>
                <div className="mt-2.5">
                  <Input
                    className="block w-full"
                    placeholder="you@company.com"
                    type="email"
                    id="email"
                    name="email"
                    required
                  />
                </div>
              </div>
              {/* Phone number */}
              <div className="sm:col-span-2">
                <label className="block leading-6" htmlFor="email">
                  Phone number
                </label>
                <div className="mt-2.5">
                  <Input
                    type="tel"
                    name="phone-number"
                    placeholder="+49 (555) 555-5555"
                    id="phone-number"
                    className="block w-full"
                    required
                  />
                </div>
              </div>
              {/* Massage */}
              <div className="sm:col-span-2">
                <label className="block leading-6" htmlFor="email">
                  Massage
                </label>
                <div className="mt-2.5">
                  <textarea
                    name="message"
                    placeholder="Type your message here"
                    id="message"
                    rows={4}
                    className="block w-full rounded-md border-0 px-3.5 py-2 bg-bkg-1 shadow-sm ring-1 ring-inset ring-borderc1 placeholder:text-content1 placeholder:opacity-60 focus:outline-none focus:ring-1 focus:ring-accent1 sm:text-sm sm:leading-6"
                  ></textarea>
                </div>
              </div>
              <button
                className="bg-btn-1 w-full border-1 border-borderc1 h-full sm:col-span-2 rounded-md py-2 font-bold text-white hover:bg-gray-800 cursor-pointer"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Popup Message */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-bkg1 text-content1 p-8 rounded-xl shadow-xl text-center max-w-sm">
            <h2 className="text-xl font-semibold mb-2">Thank you!</h2>
            <p>We’ll get back to you as soon as possible.</p>
          </div>
        </div>
      )}
    </>
  );
}

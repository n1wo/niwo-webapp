import Image from "next/image";

export default function Contact() {
  return (
    <>
      <div className="grid grid-cols-2 ">
        {/* Coontainer left */}
        <div className="relative">
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
        {/* Coontainer right */}
        <div className="mx-28 mt-24 mb-28">
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
            className="text-conten-1 mx-auto mt-10"
            action="/send-data-here"
            method="post"
          >
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              {/* Fist Name*/}
              <div>
                <label className="block leading-6" htmlFor="first-name">
                  First Name
                </label>
                <div className="mt-2.5">
                  <input
                    className="block w-full rounded-md border-0 px-3.5 py-2 bg-bkg-2 shadow-sm ring-1 ring-inset ring-borderc-1 focus:ring-1 focus:ring-none focus:ring-inset sm:text-sm sm:leading-6"
                    placeholder="Your First Name"
                    type="text"
                    id="first-name"
                    name="first-name"
                    required
                  />
                </div>
              </div>
              {/* Fist Name*/}
              <div>
                <label className="block leading-6" htmlFor="last-name">
                  Last Name
                </label>
                <div className="mt-2.5">
                  <input
                    className="block w-full rounded-md border-0 px-3.5 py-2 bg-bkg-2 shadow-sm ring-1 ring-inset ring-borderc-1 focus:ring-1 focus:ring-none focus:ring-inset sm:text-sm sm:leading-6"
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
                  <input
                    className="block w-full rounded-md border-0 px-3.5 py-2 bg-bkg-2 shadow-sm ring-1 ring-inset ring-borderc-1 focus:ring-1 focus:ring-none focus:ring-inset sm:text-sm sm:leading-6"
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
                  <input
                    className="block w-full rounded-md border-0 px-3.5 py-2 bg-bkg-2 shadow-sm ring-1 ring-inset ring-borderc-1 focus:ring-1 focus:ring-none focus:ring-inset sm:text-sm sm:leading-6"
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
                  <input
                    type="tel"
                    name="phone-number"
                    placeholder="+49 (555) 555-5555"
                    id="phone-number"
                    className="block w-full rounded-md border-0 px-3.5 py-2 bg-bkg-2 shadow-sm ring-1 ring-inset ring-borderc-1 focus:ring-1 focus:ring-none focus:ring-inset sm:text-sm sm:leading-6"
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
                    className="block w-full rounded-md border-0 px-3.5 py-2 bg-bkg-2 shadow-sm ring-1 ring-inset ring-borderc-1 placeholder:text-gray-400 focus:ring-2 focus:ring-inset   sm:text-sm sm:leading-6"
                  ></textarea>
                </div>
              </div>
              <button
                className="bg-btn-1 w-full h-full sm:col-span-2 rounded-md py-2 font-bold text-white hover:bg-gray-800"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

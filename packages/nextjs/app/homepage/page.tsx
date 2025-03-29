import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative w-full h-screen">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/background.png" // Ensure you place the image in the public folder
          alt="Hero Image"
          layout="fill"
          objectFit="cover"
          className="brightness-50"
        />
      </div>

      {/* Navbar */}
      {/* <nav
            className="absolute top-0 left-0 w-full p-4 bg-gradient-to-r from-green-500 to-blue-500 shadow-lg flex items-center justify-center px-6">
        <div className="text-black font-bold text-xl flex items-center gap-2">
          <Image
            src="/kiwiLogo.svg" // Ensure you place the image in the public folder
            alt="Kiwi Logo"
            width={40}
            height={40}
          />
          <span className="text-black">CARBONKIWI</span>
        </div>
      </nav> */}

      {/* Hero Content */}
      <div className="relative flex h-full items-center justify-between px-28">
        {/* Left Text */}
        <div className="max-w-lg text-left">
          <h1 className="drop-shadow-lg text-5xl font-bold bg-gradient-to-r from-green-300 to-blue-300 text-transparent bg-clip-text">
            CARBONKIWI
          </h1>
          <p className="drop-shadow-lg mt-2 text-3xl bg-gradient-to-r from-green-300 to-blue-300 text-transparent bg-clip-text">
            The New Zealand <br /> Emissions Trading <br /> Scheme, now on
            <span className="font-bold"> Web 3</span>
          </p>
        </div>

        {/* Right Buttons */}
        <div className="flex flex-col gap-4">
          <Link href="/login">
            <button className="bg-gradient-to-r from-blue-300 to-green-300 text-black px-6 py-2 rounded-lg shadow-lg hover:scale-105 transition">
              Participant Login
            </button>
          </Link>
          <Link href="/blockexplorer">
            <button className="bg-gradient-to-r from-green-300 to-blue-300 text-black px-6 py-2 rounded-lg shadow-lg hover:scale-105 transition">
              Observer Access
            </button>
          </Link>
        </div>
      </div>
      {/* New Text Section */}
      <div className="absolute bottom-10 w-full text-center px-6">
        <p className=" text-white text-lg bg-gradient-to-r from-green-300 to-blue-300 text-transparent bg-clip-text">
          CARBONKIWI is Web3 implementation to the New Zealand Emissions Trading Scheme (NZ ETS). <br /> It is
          necessary for meeting NZ's domestic and international climate change targets, including the 2050 target
          set by the Climate Change Response Act 2002.
        </p>
      </div>
    </div>
  );
}

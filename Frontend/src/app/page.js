import Link from "next/link";

export default function Home() {
  return (
    <div className="p-10 ">
      <div>
        <img
          src="https://www.chess.com/bundles/web/images/index-page/index-illustration.9d2cb1c3@2x.png"
          className="ml-20 h-120"
        />
        <div className="flex flex-col absolute bottom-0 left-0 p-4 ml-25 mb-20 gap-6">
          <Link href="/Duels">
            <button className="text-white p-2 text-4xl relative text-white hover:text-green-800 transition-colors duration-300
                               after:content-[''] after:absolute after:left-0 after:bottom-0
                               after:w-0 hover:after:w-full after:h-[2px]
                               after:bg-green-800 after:transition-all after:duration-300"
            >
              Duels
            </button>
          </Link>
          <Link href="/Havoc">
            <button className="text-white p-2 text-4xl relative text-white hover:text-green-800 transition-colors duration-300
                               after:content-[''] after:absolute after:left-0 after:bottom-0
                               after:w-0 hover:after:w-full after:h-[2px]
                               after:bg-green-800 after:transition-all after:duration-300"
            >
              Havoc
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

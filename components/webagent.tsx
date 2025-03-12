import Link from "next/link";
import { GoArrowUpRight } from "react-icons/go";
import Image from "next/image";

interface WebAgentProps {
  webAgentUrl: string;
}

const WebAgent = ({ webAgentUrl }: WebAgentProps) => {
  return (
    <div className="relative bg-[#8cc9fe] w-full h-full group dark:bg-[#0f1217]">
      <div className="absolute -top-40 right-40 bg-[#ffbfd1] w-[185%] h-full rounded-full dark:hidden" />

      <div className="absolute top-1/2 -translate-y-1/2 left-24 md:left-32 transform -rotate-[30deg] rounded-2xl w-[80%]">
        <Image
          priority
          alt="Web Agent Interface Preview"
          className="w-full h-full object-contain rounded-2xl"
          height={800}
          loading="eager"
          quality={75}
          src={webAgentUrl}
          width={1000}
        />
      </div>
      <button className="absolute bg-white dark:bg-[#0f1217] bottom-2 left-2 transition-all w-10 h-10 md:w-[2.75rem] md:h-[2.75rem] duration-500 ease-in-out group-hover:w-40 p-2 rounded-full hover:bg-default-100 border-2 border-transparent dark:border-[#1e293b]">
        <div className="flex justify-center items-center">
          <Link color="foreground" href="https://www.claude.ai/">
            <span className="text-sm md:text-medium text-nowrap hidden group-hover:block invisible group-hover:visible mr-1 animate-fade">
              Claude Agent
            </span>
          </Link>
          <GoArrowUpRight />
        </div>
      </button>
    </div>
  );
};

export default WebAgent;

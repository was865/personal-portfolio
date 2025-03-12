import Link from "next/link";
import { GoArrowUpRight } from "react-icons/go";
import Image from "next/image";
import { useLocale } from "next-intl";
interface PaperProps {
  paperUrl: string;
}

const Paper = ({ paperUrl }: PaperProps) => {
  const activeLocale = useLocale()

  return (
    <div className="relative bg-[#63ccae] w-full h-full group dark:text-white dark:bg-[#0f1217]">
      <div className="absolute -top-40 left-40 bg-[#ffdf9a] w-[135%] h-full rounded-full dark:hidden" />
      <div className="absolute top-16 md:top-1/2 -translate-y-1/2 left-12 md:left-16 rounded-2xl -rotate-[30deg] w-full">
        <Image
          alt="Paper"
          className="h-full w-full rounded-2xl object-contain"
          height={1280}
          quality={75}
          src={paperUrl}
          width={1577}
        />
      </div>
      <button className="absolute bg-white dark:bg-[#0f1217] bottom-2 left-2 transition-all w-10 h-10 md:w-[2.75rem] md:h-[2.75rem] duration-500 ease-in-out group-hover:w-40 p-2 rounded-full hover:bg-default-100 border-2 border-transparent dark:border-[#1e293b]">
        <div className="flex justify-center items-center">
          <Link
            color="foreground"
            href={`/${activeLocale}/blog`}
            className="text-black dark:text-white flex items-center"
            prefetch={true}
          >
            <span className="text-sm md:text-medium text-nowrap hidden group-hover:block invisible group-hover:visible mr-1 animate-fade">
              MY-BLOG
            </span>
            <GoArrowUpRight />
          </Link>
        </div>
      </button>
    </div>
  );
};

export default Paper;

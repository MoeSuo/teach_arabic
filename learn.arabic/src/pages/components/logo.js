import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/">
      <Image
        className="h-8 w-auto" 
        src="/vercel.svg"
        alt="Your Company"
        width={100}
        height={100}
      />
    </Link>
  );
};

export default Logo;

import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/">
      <Image
        className="h-10 w-auto" 
        src="/opiarabia1.png"
        alt="Oppi Arabia"
        width={200}
        height={200}
      />
       {/* <h1 className="text-white font-bold text-3xl">TALKFINN</h1> */}
    </Link>
  );
};

export default Logo;

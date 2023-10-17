import Head from "next/head";
import Form from "@/components/form/form";
// import LayoutLeftImage from "@/components/layoutLeftImage";
import Button from "@/components/button/button";
import Link from "next/link";
import Image from "next/image";
import logo from "/public/images/logo-box.png";

//backend
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react"; // will get the input fields data
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//backend

export default function Login() {
  //backend
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/user/profile");
    }
  }, [session, router]);
    //backend
  const doSubmit = async (formValue) => {
    //backend
    signIn("credentials", { ...formValue, redirect: false }).then(
      (callback) => {
        if (callback?.error) {
          toast.error(callback.error);
        }
        if (callback?.ok && !callback?.error) {
          toast.success("Logged in successfully!");
        }
      }
    );
    //backend
  };
  const title = "Sign in to PlantApp";
  const linkText = "Forgot your password?";
  const textAccount = "Have you not an account";
  const signupLink = "Sign up";

  return (    <>
   {/* <LayoutLeftImage> */}
      <Head>
        <title>Login</title>
      </Head>
      <div className="card relative px-10 py-16 shadow-xl min-w-[70%]">
        <Image
          src={logo}
          alt="logo image"
          priority
          className="mb-14 mx-auto"
          width={150}
        />
        <div className="form ">
          <p className="text-xl mb-6">{title}</p>
          <div className="flex flex-col w-full component-preview items-center gap-4 font-roboto">
            <Form
              onSubmit={doSubmit}
              fields={[
                {
                  type: "email",
                  placeholder: "Email",
                  name: "email",
                  label: "E-mail address",
                  required: true,
                },
                {
                  type: "password",
                  placeholder: "Password",
                  name: "password",
                  label: "Password",
                  required: true,
                },
              ]}
            >
              <div className="w-full flex text-xs justify-end">
                <Link
                  href="/user/resetPassword"
                  className="link text-[#5850EC]"
                >
                  {linkText}
                </Link>
              </div>
              <div className="w-full">
                <Button type={'submit'}>SIGN IN</Button>
              </div>
            </Form>
          {/* sign in using github */}
          <button
            onClick={() => signIn("github")}
            type="submit"
            className="w-full 
            text-white bg-[#B58D63] hover:bg-[#CCA070] focus:ring-4 focus:ring-stone-200 font-medium rounded text-sm px-4 py-3 mr-2 mb-2"
          >
            SIGN IN USING GITHUB ACCOUNT
          </button>
          {/* sign in using github */}

          {/* sign in using GOOGLE */}
          <button
            onClick={() => signIn("google")}
            type="submit"
            className="w-full 
            text-white bg-[#B58D63] hover:bg-[#CCA070] focus:ring-4 focus:ring-stone-200 font-medium rounded text-sm px-4 py-3 mr-2 mb-2"
          >
            SIGN IN USING GOOGLE ACCOUNT
          </button>
          {/* sign in using GOOGLE */}
            <div className="w-full ">
              <span className="flex flex-row justify-normal text-xs gap-2">
                <p>{textAccount}</p>{" "}
                <Link href="/user/signup" className="link text-[#5850EC]">
                  {signupLink}
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
      

      
     {/* </LayoutLeftImage> */}

    </>
  );
}

// Login.getLayout = function getLayout(page) {
//   return (
//     <Layout>
//       <Head>
//         <title>Login</title>
//       </Head>
//       <LayoutLeftImage>{page}</LayoutLeftImage>
//     </Layout>
//   );
// };

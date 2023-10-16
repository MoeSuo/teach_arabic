import Button from "@/components/button/button";
import Form from "@/components/form/form";
import LayoutLeftImage from "@/components/layoutLeftImage";
import Head from "next/head";
import Image from "next/image";
import logo from "/public/images/logo-box.png";
import axios from "axios";
import { toast } from "react-toastify";

export default function ResetPassword(){
  
  
  const doSubmit = async (formValue) => {
    //backend
    axios
      .post('/api/resetPassword', formValue)
      .then((data) => {
        console.log('User sent email', data);
        toast.success('Email has been sent!');
    
      })
      .catch(() => {
        console.log('An error occurred!');
        toast.error('An error occurred!');
      });
      //backend
  };
  
    const title= 'Reset Password';
    return(
        <LayoutLeftImage>
            <Head><title>Reset Password</title></Head>
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
              ]}
            >
              <div className="w-full">
                <Button type={'submit'}>SEND</Button>      
              </div>
            </Form>
          </div>
        </div>
      </div>

        </LayoutLeftImage>
    )
}
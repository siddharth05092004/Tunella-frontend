import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {toast,Toaster} from "react-hot-toast";

function TestCredentials() {

    async function copy_email(){
        navigator.clipboard.writeText("tunellatest@gmail.com")
        toast.success("Copied E-mail")
    }

    async function copy_password(){
        navigator.clipboard.writeText("tunellatest123")
        toast.success("Copied Password")
    }

    async function copy_both(){
        navigator.clipboard.writeText("E-mail: tunellatest@gmail.com \nPassword: tunellatest123")
        toast.success("Copied Both")
    }

  return (
    <>
      <div className="poppins-regular bg-primary text-gray-200 h-screen">
        <Navbar />
        <Toaster position="bottom-right"/>
        <div className="m-8 max-w-lg grid grid-cols-1 grid-items-center place-items-center ">
          <div className="text-2xl md:text-4xl max-w-5xl text-secondary">
            <p>
              If you are not a registered tester, you can use the following
              credentials to test the app for both spotify and youtube, click to copy:
            </p>
          </div>
          <div className="mt-4 underline md:mt-8 text-2xl md:text-4xl grid grid-cols-1 justify-center max-w-sm text-tertiary">
            <span className="flex hover:cursor-pointer hover:text-gray-200 transition-all duration-100" onClick={copy_email}>E-mail: tunellatest@gmail.com <img src="/assets/icons/copy.svg" className="invert w-8"/></span>
            <span className="flex  hover:cursor-pointer hover:text-gray-200 transition-all duration-100" onClick={copy_password}>Password: tunellatest123<img src="/assets/icons/copy.svg" className="invert w-8"/></span>
            <span className="flex  hover:cursor-pointer hover:text-gray-200 transition-all duration-100" onClick={copy_both}>Copy both<img src="/assets/icons/copy.svg" className="invert w-8"/></span>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default TestCredentials;

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

  return (
    <>
      <div className="bg-indigo-600 text-gray-200 h-screen">
        <Navbar />
        <Toaster position="bottom-right"/>
        <div className="m-8 max-w-lg grid grid-cols-1 grid-items-center place-items-center">
          <div className="text-2xl md:text-5xl w-full max-w-sm text-green-400">
            <span>
              If you are not a registered tester, you can use the following
              credentials to test the app for both spotify and youtube:
            </span>
          </div>
          <div className="mt-4 text-2xl grid grid-cols-1 justify-center max-w-sm">
            <span className="flex hover:cursor-pointer hover:text-gray-100 transition-all duration-100" onClick={copy_email}>E-mail: tunellatest@gmail.com <img src="/assets/icons/copy.svg" className="invert w-8"/></span>
            <span className="flex  hover:cursor-pointer hover:text-gray-100 transition-all duration-100" onClick={copy_password}>Password: tunellatest123<img src="/assets/icons/copy.svg" className="invert w-8"/></span>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default TestCredentials;

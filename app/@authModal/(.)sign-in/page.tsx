import {SignIn} from "@/components/sign-in";
import {CloseSignModal} from "@/components/close-sign-modal";

const InterceptedSignInPage = () => {
  return (
    <div className="fixed inset-0 bg-stone-900/20 z-10">
      <div className="container flex items-center h-full max-w-lg mx-auto">
        <div className="relative bg-white w-full h-fit py-20 px-2 rounded-lg">
          <div className="absolute top-4 right-4">
            <CloseSignModal />
          </div>

          <SignIn />
        </div>
      </div>
    </div>
  )
}

export default InterceptedSignInPage;

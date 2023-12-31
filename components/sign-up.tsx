import {Icons} from '@/components/icons';
import Link from "next/link";
import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";
import {UserAuthForm} from "@/components/forms/user-auth-form";

export const SignUp = () => {

  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.brain className="mx-auto h-6 w-6" />
        <h2 className="text-2xl font-semibold tracking-tight">Sign up</h2>
        <p className="text-sm max-w-xs mx-auto">By continuing, you are setting up a Smart Teams account</p>

        <UserAuthForm type={'Sign Up'} />

        <p className="px-8 text-center text-sm text-stone-600">
          Already have an account?
          <Link
            href='/sign-in'
            className={cn(buttonVariants({variant: 'link'}))}
          >Sign in</Link>
        </p>
      </div>
    </div>
  )
}

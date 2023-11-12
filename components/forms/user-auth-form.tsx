"use client"

import {signIn} from 'next-auth/react';
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {Icons} from '@/components/icons';
import {isAxiosError} from "@/lib/utils";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type: 'Sign In' | 'Sign Up';
}

export const UserAuthForm = ({type}: UserAuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const loginWithGoogle = async () => {
    setIsLoading(true)
    try {
      await signIn('google');
    } catch (error) {
      console.log(error)
      if (isAxiosError(error)) {
        toast.error(`Something went wrong: ${error?.response?.data}`);
      } else {
        toast.error('Something went wrong.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  const loginWithGoAway = async () => {
    setIsWaiting(true);
  }

  return (
    <div className="flex justify-center flex-col gap-2">
      <Button
        size='sm'
        className="w-full"
        disabled={isLoading}
        onClick={loginWithGoogle}
      >
        {isLoading
          ? <Icons.spinner className="animate-spin w-4 h-4 mr-2"/>
          : <Icons.google className="w-4 h-4 mr-2"/>}
        {type} with Google
      </Button>
      <Button
        size='sm'
        className="w-full"
        disabled={isWaiting}
        onClick={loginWithGoAway}
      >
        {isWaiting
          ? <Icons.spinner className="animate-spin w-4 h-4 mr-2"/>
          : <Icons.pomoiqaLogo className="w-4 h-4 mr-2"/>}
        {type} with Vkontakte
      </Button>
    </div>
  )
}

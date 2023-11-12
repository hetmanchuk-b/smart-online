"use client"

import * as z from "zod";
import {UsernameValidator} from "@/lib/validators/username";
import {useModal} from "@/hooks/use-modal-store";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import axios from "axios";
import {useRouter} from "next/navigation";
import {Button, buttonVariants} from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {Icons} from "@/components/icons";
import {isAxiosError} from "@/lib/utils";

interface EditUsernameFormProps {
  currentUsername: string;
}

type formData = z.infer<typeof UsernameValidator>

export const EditUsernameForm = ({currentUsername}: EditUsernameFormProps) => {
  const {onClose} = useModal();
  const router = useRouter();

  const form = useForm<formData>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      name: currentUsername || ''
    }
  });

  const {isSubmitting, isValid} = form.formState;

  const onSubmit = async (values: formData) => {
    try {
      const response = await axios.patch('/api/username', values);
      form.reset();
      toast.success('Your username has been updated.');
      router.refresh();
      onClose();
    } catch (error) {
      console.log("[EDIT USERNAME CLIENT_ERROR]", error);
      if (isAxiosError(error)) {
        toast.error(`Your username was not updated: ${error?.response?.data}`);
      } else {
        toast.error(`Your username was not updated.`);
      }
    }
  }

  return (
    <div className="max-w-5xl w-full px-4 mx-auto flex flex-col md:items-center md:justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 mt-8 w-full"
        >
          <FormField
            name={'name'}
            control={form.control}
            render={({field}) => (
              <FormItem>
                <FormLabel>New username</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder={'Minimum 3 characters'}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center pb-4">
            <Button
              className="gap-x-2 flex-1"
              disabled={!isValid || isSubmitting}
              type={'submit'}
            >
              Save
              {isSubmitting && <Icons.spinner className="animate-spin w-6 h-6" />}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

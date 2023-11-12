"use client"

import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {toast} from "sonner";

import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Button, buttonVariants} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useRouter} from "next/navigation";
import {useModal} from "@/hooks/use-modal-store";
import {Icons} from '@/components/icons';

const formSchema = z.object({
  inviteLink: z.string().min(5, {
    message: 'Link is required'
  }),
});

export const JoinRoomForm = () => {
  const {onClose} = useModal();

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inviteLink: '',
    }
  });

  const {isSubmitting, isValid} = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      router.push(`/invite-smart/${values.inviteLink}`);
      // toast.success('Successfully joined!');
      form.reset();
      onClose();
    } catch (error) {
      console.log("[Joining room_ERROR]", error);
      toast.error('Something went wrong');
    }
  }

  return (
    <div className="max-w-5xl mx-auto w-full flex md:items-center md:justify-center px-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 mt-8 pb-4 w-full"
        >
          <FormField
            name={'inviteLink'}
            control={form.control}
            render={({field}) => (
              <FormItem>
                <FormLabel>
                  Paste room ID:
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder={'1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-x-2">
            <Button
              onClick={() => onClose()}
              variant={'ghost'}
            >
              Cancel
            </Button>
            <Button
              className="gap-x-2 flex-1"
              disabled={!isValid || isSubmitting}
              type="submit"
            >
              Continue
              {isSubmitting && <Icons.spinner className="animate-spin w-6 h-6" />}
            </Button>

          </div>
        </form>
      </Form>

    </div>
  )
}

"use client"

import * as z from "zod";
import {TeamValidator} from "@/lib/validators/room";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "sonner";
import axios from "axios";
import {useRouter} from "next/navigation";
import {useModal} from "@/hooks/use-modal-store";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {isAxiosError} from "@/lib/utils";

interface EditTeamFormProps {
  teamId: string;
  name: string;
  score: number;
}

type formData = z.infer<typeof TeamValidator>

export const EditTeamForm = ({teamId, name, score}: EditTeamFormProps) => {
  const {onClose} = useModal();
  const router = useRouter();

  const form = useForm<formData>({
    resolver: zodResolver(TeamValidator),
    defaultValues: {
      name: name || '',
      score: score || 0
    }
  });

  const {isSubmitting, isValid} = form.formState;

  const onSubmit = async (values: formData) => {
    try {
      const response = await axios.patch(`/api/teams/edit/${teamId}`, values);
      form.reset();
      onClose();
      router.refresh();
    } catch (error) {
      console.log("[EDIT TEAM CLIENT_ERROR]", error);
      if (isAxiosError(error)) {
        toast.error(`Something went wrong: ${error?.response?.data}`);
      } else {
        toast.error(`Something went wrong.`);
      }
    }
  }

  return (
    <div className="max-w-5xl w-full px-4 mx-auto flex flex-col md:items-center md:justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 mt-2 w-full"
        >
          <FormField
            name={'name'}
            control={form.control}
            render={({field}) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name={'score'}
            control={form.control}
            render={({field}) => (
              <FormItem>
                <FormLabel>Score</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    type={'number'}
                    min={0}
                    {...field}
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full mt-8">
            Save
          </Button>

        </form>
      </Form>
    </div>
  )
}

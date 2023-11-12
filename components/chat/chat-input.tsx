"use client"

import * as z from 'zod';
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Icons} from '@/components/icons';
import qs from "query-string";
import axios from "axios";
import {toast} from "sonner";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
}

const formSchema = z.object({
  content: z.string().min(1).max(300),
});

export const ChatInput = (
  {
    apiUrl,
    query,
  }: ChatInputProps
) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: ''
    }
  });

  const {isValid, isSubmitting} = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const {content} = values;
      if (content.trim().length === 0) {
        form.reset();
        return;
      }
      const url = qs.stringifyUrl({
        url: apiUrl,
        query
      });
      await axios.post(url, values);

      form.reset();
    } catch (error) {
      console.log("[SEND MESSAGE CLIENT_ERROR]", error);
      toast.error('Something went wrong.');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name={'content'}
          render={({field}) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center p-2">
                  <Input
                    disabled={isSubmitting}
                    placeholder={'Message'}
                    {...field}
                    className="px-4 py-6 rounded-none font-semibold text-md bg-stone-100 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <button
                    type={'submit'}
                    disabled={!isValid || isSubmitting}
                    className="disabled:bg-stone-200 disabled:cursor-not-allowed h-[48px] p-2 bg-stone-100 hover:bg-stone-200 transition focus-visible:ring-0 focus-visible:ring-offset-0"
                  >
                    {isSubmitting
                      ? <Icons.spinner className="w-5 h-5 animate-spin" />
                      : <Icons.send className="w-5 h-5" />}
                  </button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

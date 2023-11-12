"use client"

import {useState, useEffect} from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import {QuizValidator} from "@/lib/validators/quiz";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Icons} from '@/components/icons';
import axios from "axios";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {Quiz} from '@prisma/client';
import {useModal} from "@/hooks/use-modal-store";
import {isAxiosError} from "@/lib/utils";

type formData = z.infer<typeof QuizValidator>

interface QuizFormProps {
  initialData: Quiz | null;
}

export const QuizForm = ({initialData}: QuizFormProps) => {
  const [formType, setFormType] = useState<'create' | 'edit'>('create');
  const {onClose} = useModal();

  useEffect(() => {
    if (initialData !== null) {
      setFormType('edit')
    }
  }, [formType, initialData]);

  const router = useRouter();

  const form = useForm<formData>({
    resolver: zodResolver(QuizValidator),
    defaultValues: {
      title: initialData?.title || '',
      topic: initialData?.topic || '',
    }
  });

  const {isSubmitting, isValid} = form.formState;

  const onSubmit = async (values: formData) => {
    if (formType === 'create') {
      try {
        const response = await axios.post('/api/quiz', values);
        toast.success(`Quiz ${response?.data?.title} created.`);
        form.reset();
        router.push(`/new-quiz/${response?.data?.id}`);
      } catch (error) {
        console.log("[QUIZ POST CLIENT_ERROR]", error);
        if (isAxiosError(error)) {
          toast.error(`Something went wrong: ${error?.response?.data}`);
        } else {
          toast.error('Something went wrong.');
        }
      }
    } else if (formType === 'edit') {
      try {
        const response = await axios.patch(`/api/quiz/${initialData?.id}`, values);
        toast.success(`Quiz ${response?.data?.title} edited.`);
        onClose();
        router.refresh();
      } catch (error) {
        console.log("[QUIZ EDIT CLIENT_ERROR]", error);
        if (isAxiosError(error)) {
          toast.error(`Something went wrong: ${error?.response?.data}`);
        } else {
          toast.error(`Something went wrong.`);
        }
      }
    }
  }

  return (
    <div className="py-4 w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full grid grid-cols-2 gap-4 max-w-xl p-4 border border-stone-200 rounded-md shadow mx-auto"
        >
          <FormField
            name={'title'}
            control={form.control}
            render={({field}) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder={'This field is required'}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name={'topic'}
            control={form.control}
            render={({field}) => (
              <FormItem>
                <FormLabel>Topics</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder={'History, geography, biology etc.'}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type={'submit'}
            disabled={isSubmitting || !isValid}
            className="gap-x-2 col-span-full"
          >
            Save & Continue
            {isSubmitting
              ? <Icons.spinner className="w-5 h-5 animate-spin" />
              : <Icons.save className="w-5 h-5" />}
          </Button>
        </form>
      </Form>
    </div>
  )
}

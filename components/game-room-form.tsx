"use client"

import {useState, useEffect} from "react";
import {Room} from '@prisma/client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {Button, buttonVariants} from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import axios from "axios";
import {Switch} from "@/components/ui/switch";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {Icons} from '@/components/icons';
import {useModal} from "@/hooks/use-modal-store";
import {RoomValidator} from "@/lib/validators/room";

type formData = z.infer<typeof RoomValidator>

interface GameRoomFormProps {
  initialData: Room | null
}

export const GameRoomForm = ({initialData}: GameRoomFormProps) => {
  const [formType, setFormType] = useState<'create' | 'edit'>();
  const {onClose} = useModal();

  const router = useRouter();

  const form = useForm<formData>({
    resolver: zodResolver(RoomValidator),
    defaultValues: initialData || {
      title: '',
      isPrivate: false,
    }
  });


  useEffect(() => {
    if (!initialData) {
      setFormType('create');
    } else {
      setFormType('edit');
    }
  }, [form]);

  const {isSubmitting, isValid} = form.formState;

  const onSubmit = async (values: formData) => {
    if (formType === 'create') {
      try {
        const response = await axios.post('/api/room', values);
        form.reset();
        router.push(`/room/${response.data.id}`);
        toast.success('Room created!');
        onClose();
      } catch (error) {
        console.log("[Create room_ERROR]", error);
        toast.error(`Something went wrong: ${error?.response?.data}`);
      }
    } else {
      try {
        await axios.patch(`/api/room/${initialData?.id}`, values);
        router.refresh();
        toast.success('Room edited!');
        onClose();
      } catch (error) {
        console.log("[Edit room_ERROR]", error);
        toast.error(`Something went wrong: ${error?.response?.data}`);
      }
    }
  }


  return (
    <div className="max-w-5xl w-full p-4 mx-auto flex flex-col md:items-center md:justify-center">
      <h1 className="capitalize text-2xl font-medium">
        {formType} a room for Smart Teams
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 mt-8 w-full"
        >
          <FormField
            name={'title'}
            control={form.control}
            render={({field}) => (
              <FormItem>
                <FormLabel>
                  Room title
                </FormLabel>
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
            name={'isPrivate'}
            control={form.control}
            render={({field}) => (
              <FormItem
                className="space-y-0 py-4 border-t border-slate-200 flex w-full gap-3 justify-between items-center"
              >
                <div className="flex flex-col space-y-2">
                  <FormLabel className="text-slate-700 text-lg">

                    {field.value
                      ? (
                        <span>Public/<span className="underline underline-offset-4">Private</span> room</span>
                      )
                      : (
                        <span>
                          <span className="underline underline-offset-4">Public</span>/Private room
                        </span>
                      )}
                  </FormLabel>
                  <FormDescription className="text-small-medium">
                      <span className="text-slate-600 text-sm">
                        {field.value
                          ? 'Players will be able to join the room only via a link'
                          : 'Everyone will be able to join the room from lobby'}
                      </span>
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-x-2">
            {formType === 'create' && (
              <Button
                variant={'ghost'}
                onClick={onClose}
              >
                Cancel
              </Button>
            )}
            <Button
              className="gap-x-2 flex-1"
              disabled={!isValid || isSubmitting}
              type={'submit'}
            >
              {formType === 'create' ? 'Continue' : 'Save'}
              {isSubmitting && <Icons.spinner className="animate-spin w-6 h-6" />}
            </Button>
          </div>
        </form>

      </Form>
    </div>
  )
}

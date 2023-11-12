"use client"

import {useEffect, useState} from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import * as z from "zod";
import {QuestionValidator} from "@/lib/validators/quiz";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {QuestionType, AnswerType} from '@prisma/client';
import {Input} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {Icons} from '@/components/icons';
import {ActionTooltip} from "@/components/action-tooltip";
import {Textarea} from "@/components/ui/textarea";
import {toast} from "sonner";
import {QUIZ_MAX_QUESTION_VARIANTS} from "@/lib/const";
import {cn, isAxiosError} from "@/lib/utils";
import axios from "axios";
import qs from "query-string";
import {useRouter} from "next/navigation";
import {FileUpload} from "@/components/forms/file-upload";
import {Checkbox} from "@/components/ui/checkbox";


type formData = z.infer<typeof QuestionValidator>

interface QuestionFormProps {
  questionNumber: number;
  quizId: string;
}

export const QuestionForm = (
  {
    questionNumber,
    quizId,
  }: QuestionFormProps
) => {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [withImage, setWithImage] = useState(false);
  const form = useForm<formData>({
    resolver: zodResolver(QuestionValidator),
    defaultValues: {
      text: '',
      type: QuestionType.NORMAL,
      reward: 1,
      order: questionNumber,
      imageUrl: '',
      variants: [{
        text: '',
        type: AnswerType.RIGHT
      }]
    }
  });
  const watchVariants = form.watch('variants');
  useEffect(() => {
    if (form.getValues('variants').length > 1) {
      form.setValue('type', QuestionType.FAST)
    } else {
      form.setValue('type', QuestionType.NORMAL)
    }
  }, [form, watchVariants]);


  const {isSubmitting, isValid} = form.formState;

  const onSubmit = async (values: formData) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/quiz/${quizId}/questions`,
        query: {
          qn: questionNumber
        }
      });
      await axios.patch(url, values);

      router.refresh();
      toast.success(`Question for quiz is saved successfully.`);
      setIsSaved(true);
    } catch (error) {
      console.log("[QUESTION FORM CLIENT_ERROR]", error);
      if (isAxiosError(error)) {
        toast.error(`Something went wrong: ${error?.response?.data}`);
      } else {
        toast.error(`Something went wrong.`);
      }
      setIsSaved(false);
    }
  }

  const onAddOption = () => {
    if (isSaved || form.getValues('variants').length >= QUIZ_MAX_QUESTION_VARIANTS) return;
    form.setValue('variants', [...form.getValues('variants'), {
      text: '',
      type: AnswerType.WRONG
    }]);
  }

  const onRemoveOption = (id: number) => {
    const options = form.getValues('variants');
    if (isSaved || options.length <= 1) return;
    options.splice(id, 1);
    form.setValue('variants', options);
    if (options.length > 1) {
      form.setValue('type', QuestionType.FAST)
    } else {
      form.setValue('type', QuestionType.NORMAL)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full grid grid-cols-2 gap-2 content-start"
      >
        <FormField
          name={'text'}
          control={form.control}
          render={({field}) => (
            <FormItem className="col-span-full">
              <FormLabel>
                <div className="flex items-center justify-between">
                  Question #{questionNumber}
                  <div className="flex items-center gap-x-2">
                    <label htmlFor="with_image">
                      Add image
                    </label>
                    <Checkbox
                      disabled={isSubmitting || isSaved}
                      id='with_image'
                      checked={withImage}
                      onCheckedChange={() => setWithImage((val) => !val)}
                    />
                  </div>
                </div>
              </FormLabel>
              <FormControl>
                <Textarea
                  disabled={isSubmitting || isSaved}
                  className="min-h-[60px] max-h-[200px]"
                  placeholder={'Who is Vladimir Putin?'}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-y-2">
          <FormField
            name={'reward'}
            control={form.control}
            render={({field}) => (
              <FormItem>
                <FormLabel>Score</FormLabel>
                <Select
                  disabled={isSubmitting || isSaved}
                  onValueChange={(event) => field.onChange(+event)}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue defaultValue={1}/>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({length: 10}).map((_, i) => (
                      <SelectItem
                        key={i}
                        value={(i + 1).toString()}
                      >
                        {i + 1}
                      </SelectItem>
                    ))}

                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {withImage && (
            <FormField
              name={'imageUrl'}
              control={form.control}
              render={({field}) => (
                <FormItem>
                  <FormLabel>
                    Question image (Optional)
                  </FormLabel>
                  <FormControl>
                    <FileUpload
                      disabled={isSubmitting || isSaved}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        <div className="flex flex-col gap-y-2">
          {form.getValues('variants')?.map((variant, index, variants) => (
            <FormField
              key={index}
              name={`variants.${index}.text`}
              control={form.control}
              render={({field}) => (
                <FormItem>
                  <div className="inline-flex items-center justify-between w-full gap-x-2">
                    <FormLabel className="flex items-center gap-x-2">
                      {index === 0 ? 'Answer (Correct)' : 'Variant'}
                      {index === 0 && variants.length > 1 && (
                        <p className="text-xs text-stone-500">Variant #{index + 1}</p>
                      )}
                    </FormLabel>
                    {index === 0 && variants.length < QUIZ_MAX_QUESTION_VARIANTS && (
                      <ActionTooltip
                        label={'Add variant and make question optional'}
                        side={'left'}
                        align={'center'}
                      >
                        <Icons.add
                          onClick={onAddOption}
                          className="w-5 h-5 cursor-pointer ml-auto hover:text-sky-700 transition"
                        />
                      </ActionTooltip>
                    )}
                    {index > 0 && (
                      <div className="flex items-center gap-x-2">
                        <p className="text-xs text-stone-500">Variant #{index + 1}</p>
                        <ActionTooltip label={'Delete variant'} side={'left'} align={'center'}>
                          <Icons.close
                            onClick={() => onRemoveOption(index)}
                            className="w-5 h-5 cursor-pointer ml-auto hover:text-rose-600 transition"
                          />
                        </ActionTooltip>
                      </div>
                    )}
                  </div>
                  <FormControl>
                    <Input
                      disabled={isSubmitting || isSaved}
                      placeholder={index === 0 ? 'Huilo' : ''}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <div className="col-span-full flex justify-center">
          <Button
            variant={'secondary'}
            size={'sm'}
            type={'submit'}
            className={cn(
              'gap-x-2',
              isSaved && 'bg-green-200 disabled:text-stone-950 disabled:opacity-80'
            )}
            disabled={!isValid || isSubmitting || isSaved}
          >
            {!isSaved ? "Submit question" : "Questing saved"}
            {!isSaved
              ? <Icons.fileQuestion className='w-4 h-4' />
              : <Icons.check className='w-4 h-4' />}
            {isSubmitting
              ? <Icons.spinner className="w-4 h-4 animate-spin" />
              : <Icons.save className="w-4 h-4" />}
          </Button>
        </div>
        <Separator className="w-2/3 bg-stone-700 my-2 mx-auto col-span-full" />
      </form>
    </Form>
  )
}

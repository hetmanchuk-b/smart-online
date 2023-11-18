import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import Image from "next/image";

interface QuizSectionProps {}

export const QuizSection = ({}: QuizSectionProps) => {
  return (
    <div className="h-full p-1 bg-stone-200">
      <div className="h-full grid grid-cols-3 gap-1">
        <div className="col-start-1 col-end-3 p-2 bg-stone-100 rounded-md">
          <div className="flex flex-col gap-y-2 h-full">
            <p className="text-md font-semibold text-stone-700">
              Question to
              <span className="font-bold"> PLAYER </span>
              from
              <span className="font-bold"> Team Top</span>
            </p>
            <p className="text-xl font-bold text-stone-900">
              Who is Vladimir Putin?
            </p>
            <Image
              src="/images/wide-test.jpg"
              alt=""
              width={300}
              height={300}
              className="w-full mt-auto"
            />
          </div>
        </div>
        <div className="bg-stone-200 rounded-md">
          {false && (
            <div className="flex flex-col gap-y-1 h-full">
              <Button className="grow text-lg bg-stone-500 hover:bg-stone-600">
                Variant 1
              </Button>
              <Button className="grow text-lg bg-stone-500 hover:bg-stone-600">
                Variant 2
              </Button>
              <Button className="grow text-lg bg-stone-500 hover:bg-stone-600">
                Variant 3
              </Button>
            </div>
          )}
          {true && (
            <div className="flex flex-col gap-y-1 h-full">
              <Textarea
                placeholder={'Answer..'}
                className="bg-stone-100
                        text-xl
                        border-0
                        font-semibold
                        min-h-[140px]
                        resize-none
                        placeholder:text-stone-400
                        text-stone-900
                        focus-visible:ring-offset-1
                        focus-visible:ring-stone-600
                        flex-1"
              />
              <div className="flex gap-x-1 min-h-[70px]">
                <Button variant={'outline'} className="h-full bg-stone-100 uppercase border-0 hover:bg-stone-200">
                  Pass
                </Button>
                <Button className="flex-1 h-full uppercase">
                  Send
                </Button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

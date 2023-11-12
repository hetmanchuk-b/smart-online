"use client";

import Link from 'next/link';
import {ActionTooltip} from "@/components/action-tooltip";

export const SupportFlag = () => {
  return (
    <ActionTooltip label={'Help Provide Humanitarian Aid to Ukraine.'} side={'left'} align={'center'}>
      <Link
        href='https://opensource.fb.com/support-ukraine'
        target='_blank'
        className="text-xs text-stone-700 font-semibold hover:text-sky-800 flex items-center gap-2"
      >
        <span>Support Ukraine</span>
        <div className="w-[40px]">
          <div className="bg-[#015ab9] h-[14px]" />
          <div className="bg-[#fed600] h-[14px]" />
        </div>
      </Link>
    </ActionTooltip>
  )
}

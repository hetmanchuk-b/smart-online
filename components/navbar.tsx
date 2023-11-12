import Link from 'next/link';
import {Icons} from '@/components/icons';
import {SupportFlag} from "@/components/support-flag";
import {secondaryFont} from "@/lib/fonts";
import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {NavbarMenu} from "@/components/navbar-menu";
import {getAuthSession} from "@/lib/auth";
import {UserAccountNav} from "@/components/user-account-nav";
import {db} from "@/lib/db";

export const Navbar = async () => {
  const session = await getAuthSession();

  const user = await db.user.findUnique({
    where: {
      id: session?.user?.id
    }
  });

  return (
    <header className="w-full bg-primary-foreground fixed top-0 z-10 h-[60px] border-b-stone-200 border-b flex items-center px-2">
      <div className="flex gap-x-6">
        <Link
          href='/'
          className="flex items-center gap-2 text-slate-700 text-lg font-semibold hover:text-sky-800"
        >
          <Icons.brain className="w-8 h-8" />
          <span className={cn('block', secondaryFont.className)}>Smart Teams</span>
        </Link>

        <NavbarMenu />
      </div>

      <div className="ml-auto space-x-4 flex items-center">
        <SupportFlag />
        <Separator orientation={"vertical"} className="bg-foreground w-[1px] h-8" />
        {user ? (
          <UserAccountNav user={user} />
          ) : (
          <Link className={cn(buttonVariants({size: 'sm'}))} href={'/sign-in'}>
            Sign In
          </Link>
        )}

      </div>
    </header>
  )
}

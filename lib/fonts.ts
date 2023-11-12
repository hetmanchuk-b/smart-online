import { Montserrat, Lusitana } from 'next/font/google';

export const font = Montserrat({ subsets: ['latin', 'cyrillic'] });
export const secondaryFont = Lusitana({
  weight: ['400', '700'],
  subsets: ['latin'],
});

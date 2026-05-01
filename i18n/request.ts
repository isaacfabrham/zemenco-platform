import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import {readFileSync} from 'fs';
import {join} from 'path';

// Can be imported from a shared config
const locales = ['en', 'am', 'ti', 'ar'];

export default getRequestConfig(async ({locale}) => {
  const safeLocale = locale as string;
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(safeLocale)) notFound();

  const messages = JSON.parse(
    readFileSync(join(process.cwd(), 'messages', `${safeLocale}.json`), 'utf-8')
  );

  return {
    locale: safeLocale,
    messages
  };
});

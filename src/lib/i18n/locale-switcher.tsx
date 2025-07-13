"use client"
import acceptLanguage from '../../../messages/accept-language.json'
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { GlobeIcon } from 'lucide-react';

function setLocale(locale: string) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/;`;
  window.location.reload();
}

export function LocaleSwitcher() {
  const handleLocaleChange = (locale: string) => {
    setLocale(locale);
  }; 

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <GlobeIcon className="w-4 h-4" />
          </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(acceptLanguage).map(([key, value]) => (
          <DropdownMenuItem key={key} onClick={() => handleLocaleChange(key)}>
            {value}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
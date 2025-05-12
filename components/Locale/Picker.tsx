'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface LocaleItem {
  code: string;
  label: string;
}

interface LocalePickerProps {
  availableLocales?: LocaleItem[];
}

export default function LocalePicker({
  availableLocales = [],
}: LocalePickerProps) {
  // Initialize with empty string but we'll set it from cookie if available
  const [loc, setLoc] = useState('');
  const router = useRouter();

  // Initialize locale from cookie when component mounts
  useEffect(() => {
    // Get the current locale from cookie or use first available locale as default
    const getCookie = (name: string): string => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2)
        return parts.pop()?.split(';').shift() || '';
      return '';
    };

    const currentLocale = getCookie('NEXT_LOCALE');
    // Set default locale if none is found
    const defaultLocale =
      availableLocales.length > 0
        ? availableLocales[0].code
        : 'en-US';
    const localeToUse = currentLocale || defaultLocale;

    setLoc(localeToUse);

    // Set cookie if it doesn't exist
    if (!currentLocale && localeToUse) {
      document.cookie = `NEXT_LOCALE=${localeToUse};path=/`;
    }
  }, [availableLocales]);

  // If availableLocales is empty, provide default values
  const locales =
    availableLocales.length > 0
      ? availableLocales
      : [
          { code: 'en-US', label: '🇺🇸 English' },
          { code: 'nl-NL', label: '🇳🇱 Nederlands' },
        ];

  return (
    <select
      value={loc}
      onChange={(e) => {
        const next = e.target.value;
        document.cookie = `NEXT_LOCALE=${next};path=/`;
        setLoc(next); // Update the state when selection changes
        router.refresh();
      }}
      className="border p-2 rounded-lg"
    >
      {locales.map(({ code, label }) => (
        <option key={code} value={code}>
          {label}
        </option>
      ))}
    </select>
  );
}

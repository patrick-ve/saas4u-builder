import React from 'react';
import { builder } from '@builder.io/sdk';
import Link from 'next/link';
import { cookies } from 'next/headers';

// Replace with your Public API Key
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

interface PageProps {
  params: {
    page: string[];
  };
}

const ARTICLES_PER_PAGE = 30;

// Helper function to get localized value from field
const getLocalizedValue = (field: any, locale: string): string => {
  if (!field) return '';

  // If it's a simple string
  if (typeof field === 'string') return field;

  // If it's a localized object
  if (field['@type'] === '@builder.io/core:LocalizedValue') {
    // Try to get value for current locale
    if (field[locale]) return field[locale];
    // Fall back to Default
    if (field.Default) return field.Default;
  }

  // For other object structures
  return (Object.values(field)[0] as string) || '';
};

export default async function Blog(props: PageProps) {
  // Get the current locale from cookies
  const cookieStore = cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en-US';

  // Get the page number from the path or query parameter
  // In this example we are hardcoding it as 1
  const pageNumber = 1;
  const articles = await builder.getAll('blog-article', {
    // Include references, like the `author` ref
    options: { includeRefs: true },
    // For performance, don't pull the `blocks` (the full blog entry content)
    // when listing out all blog articles
    omit: 'data.blocks',
    limit: ARTICLES_PER_PAGE,
    offset: (pageNumber - 1) * ARTICLES_PER_PAGE,
  });

  console.dir(articles, { depth: null });

  return (
    <div>
      {articles.map((item) => {
        const handle = getLocalizedValue(item?.data?.handle, locale);
        const title = getLocalizedValue(item?.data?.title, locale);
        const image = getLocalizedValue(item?.data?.image, locale);
        const description = getLocalizedValue(
          item?.data?.description,
          locale
        );

        return (
          <Link
            href={`/blog/${handle || '#'}`}
            key={handle || item.id}
          >
            <div style={{ overflow: 'hidden', width: 300 }}>
              <div
                style={{ width: 300, height: 200, display: 'block' }}
              >
                <img src={image || ''} alt={title || ''} />
              </div>
              {title}
              {description}
            </div>
          </Link>
        );
      })}
      <div
        style={{
          padding: 20,
          width: 300,
          margin: 'auto',
          display: 'flex',
        }}
      >
        {pageNumber > 1 && (
          <a href={`/blog/page/${pageNumber - 1}`}>‹ Previous page</a>
        )}

        {articles.length > ARTICLES_PER_PAGE && (
          <a href={`/blog/page/${pageNumber + 1}`}>Next page ›</a>
        )}
      </div>
    </div>
  );
}

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

// Helper function to get value from potentially object or string field
const getFieldValue = (field: any): string => {
  if (!field) return '';

  // If it's a simple string
  if (typeof field === 'string') return field;

  // If it's an object with Default property
  if (field.Default) return field.Default;

  // If it's an object with another structure
  return (Object.values(field)[0] as string) || '';
};

export default async function Blog(props: PageProps) {
  const pageNumber = 1;
  const cookieStore = cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en-US';

  const articles = await builder.getAll('blog-article', {
    userAttributes: { locale },
    options: {
      includeRefs: true,
    },
    omit: 'data.blocks',
    limit: ARTICLES_PER_PAGE,
    offset: (pageNumber - 1) * ARTICLES_PER_PAGE,
  });

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          margin: '0 auto',
        }}
      >
        {articles.map((item) => {
          const handle = getFieldValue(item?.data?.handle);
          const title = getFieldValue(item?.data?.title);
          const image = getFieldValue(item?.data?.image);
          const description = getFieldValue(item?.data?.description);

          return (
            <Link
              href={`/blog/${handle || '#'}`}
              key={handle || item.id}
            >
              <div style={{ overflow: 'hidden' }}>
                <div style={{ height: 200, display: 'block' }}>
                  <img
                    src={image || ''}
                    alt={title || ''}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
                <h3 className="text-lg font-bold mt-2">{title}</h3>
                <p>{description}</p>
              </div>
            </Link>
          );
        })}
      </div>
      <div
        style={{
          padding: 20,
          width: '100%',
          maxWidth: '1200px',
          margin: 'auto',
          display: 'flex',
          justifyContent: 'center',
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

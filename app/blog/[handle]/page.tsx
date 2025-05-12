import { builder } from '@builder.io/sdk';
import { RenderBuilderContent } from '../../../components/builder';
import { cookies } from 'next/headers';

builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

interface PageProps {
  params: {
    handle: string;
  };
}

export default async function BlogArticle(props: PageProps) {
  const cookieStore = cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en-US';

  try {
    const content = await builder
      .get('blog-article', {
        userAttributes: { locale },
        options: {
          includeRefs: true,
        },
      })
      .toPromise();

    return (
      <div className="max-w-3xl mx-auto px-0 py-4">
        <RenderBuilderContent
          content={content}
          model="blog-article"
          options={{ enrich: true }}
        />
      </div>
    );
  } catch (error) {
    console.error('Error fetching blog article:', error);
    return <div>Error loading content</div>;
  }
}

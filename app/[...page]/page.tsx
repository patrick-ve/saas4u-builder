import { builder } from '@builder.io/sdk';
import { RenderBuilderContent } from '../../components/builder';
import { cookies } from 'next/headers';

builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

interface PageProps {
  params: {
    page: string[];
  };
}

// export const revalidate = 500;

export default async function Page(props: PageProps) {
  const builderModelName = 'page';
  const cookieStore = cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en-US';

  const content = await builder
    .get(builderModelName, {
      userAttributes: {
        locale,
        urlPath: '/' + (props?.params?.page?.join('/') || ''),
      },
    })
    .toPromise();

  console.log(content);

  return (
    <>
      {/* Render the Builder page */}
      <RenderBuilderContent
        content={content}
        model={builderModelName}
        options={{ enrich: true }}
      />
    </>
  );
}

# SaaS4U Builder Implementation

This project implements a solution for SaaS4U using the Builder.io visual development platform to solve several business challenges.

## Solution Overview

### 1. Deployment and Preview

- **Frontend Deployment**: The application is deployed on Vercel and accessible at https://saas4u-builder.vercel.app/
- **Preview URL Configuration**:
  - Production: https://saas4u-builder.vercel.app/
  - Development: http://localhost:3000/
  - This allows marketing and content teams to preview content changes without running the app locally

### 2. Reusable Blog Post Template

A reusable template called "BlogPostArticle" has been created inside the Builder.io visual editor. This template:

- Enables the content team to quickly create new blog posts
- Ensures consistent formatting across all content
- Supports localization
- Can be easily inserted into any page

### 3. Locale Implementation

- **LocalePicker Component**: Located at `components/Locale/Picker.tsx`, this custom component allows users to select their preferred locale
- **Middleware Integration**: A middleware at `middleware.ts` detects and sets the user's locale based on:
  1. Existing cookie preference
  2. Browser's Accept-Language header
  3. Default fallback (en-US)
- **Builder Registry**: The locale picker is registered with the Builder registry, allowing it to be used in the visual editor

### 4. Localized Content Delivery

- Blog posts are automatically displayed based on the user's selected locale
- The application reads the locale from cookies and shows targeted content
- Content teams can create localized versions of each page and the system will serve the appropriate content

## Running the Project

To run the project locally, clone this repository and run the following commands:

```bash
npm install
npm run dev
```

# VCP component mapping

Figma-Component-to-React-Component mappings live in `*.mapper.tsx` files, these files connect specific Figma components to some of the local React components in this repos.

1. Make sure you have the latest version of @builder.io/dev-tools installed.

```bash
npm i @builder.io/dev-tools@latest
```

2. [Login/Signup in Builder.io](https://builder.io/login)

3. Publish existing mappings into your Builder.io space. (The CLI might prompt you to authorize with Builder.io.)

```bash
npx builder.io figma publish
```

3. Open the [Sample Figma file](https://www.figma.com/design/gk3fgi86UxOGgZQohLgSGK/VCP-demo?node-id=0-1&t=IQ27EabKQr6yqH2k-1)
   This figma files includes several components, some of which are already mapped in this repository, and some Homepage example to export to builder.io.

4. Open the [Builder.io Figma Plugin](https://www.figma.com/community/plugin/747985167520967365/builder-io-ai-powered-figma-to-code-react-vue-tailwind-more) and login into the same account/space as you did in step 2.

https://github.com/user-attachments/assets/1ecd77b6-e990-4d4a-96e1-939efdf1b305

5. Click Generate Code, you will be able to see the generated code properly import and use the components in this repo.

### Why publishing mappings?

Mappings don't come into effect until they are published to your Builder.io space, this allows following up figma exports to reference your local components.

To publish your mappings:

```bash
npx builder.io figma publish
```

### Figma Mapping Files

Special files in this repository named `*.mapper.tsx` are used to map Figma components to React components.

#### Generic mapper

`generic.mapper.tsx`: Defines generic mappings for Figma elements.

```tsx
import { figmaMapping } from '@builder.io/dev-tools/figma';

figmaMapping({
  genericMapper(figma) {
    if (figma.$type === 'FRAME' && figma.$name === 'Section') {
      // If we have a FRAME node named "Section" then we will render it as a <section> element.
      return <section>{figma.$children}</section>;
    }

    // For other nodes, do not apply the generic
    // mapper and keep the default rendering behavior
    return undefined;
  },
});
```

#### Component Mappings

For example, `Hero.mapper.tsx` maps various the Hero component from Figma to React.

```tsx
import { figmaMapping } from '@builder.io/dev-tools/figma';
import ImageHero from '@/components/Hero/ImageHero';

figmaMapping({
  componentKey: '4bd6da0f53b73a462b070b55dd055ce6a4cb3eca',
  mapper(figma) {
    return (
      <ImageHero
        title={
          figma.Title ??
          figma.$children[1]?.$children[0]?.$textContent ??
          ''
        }
        subTitle="Discover our collection"
        buttonText={
          figma.buttonText ??
          figma.$findOneByName('Shop Now')?.$textContent ??
          ''
        }
        buttonLink="#"
        backgroundImage={figma.$children[0]?.$imageUrl ?? ''}
        alignment="center"
        makeFullBleed={false}
      />
    );
  },
});
```

#### Design Tokens Mapper

`design-tokens.mapper.tsx` defines mappings for design tokens (colors, etc.).

```tsx
import { figmaMapping } from '@builder.io/dev-tools/figma';

figmaMapping({
  designTokenMapper(token) {
    if (token === 'black') {
      return 'var(--company-black, #000)';
    }

    // For anything keep the same
    return undefined;
  },
});
```

## Builder Registry

`builder-registry.ts` registers custom components and design tokens with Builder.io, including our locale selector for SaaS4U's internationalization requirements.

```tsx
'use client';
import '@builder.io/widgets';
import { builder, Builder, withChildren } from '@builder.io/react';
import { Button } from './components/ui/button';
import Counter from './components/Counter/Counter';
import HeroWithChildren from './components/Hero/HeroWithChildren';
import IconCard from './components/Card/IconCard';
import ImageHero from './components/Hero/ImageHero';
import SplitHero from './components/Hero/SplitHero';
import TextHero from './components/Hero/TextHero';

builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

Builder.register('editor.settings', {
  styleStrictMode: false,
  allowOverridingTokens: true, // optional
  models: ['page'],
  designTokens: {
    colors: [
      { name: 'Primary', value: 'var(--color-primary, #000000)' },
      { name: 'Secondary', value: 'var(--color-secondary, #ffffff)' },
      {
        name: 'Deconstructive',
        value: 'var(--color-deconstructive, #18B4F4)',
      },
      { name: 'Muted', value: 'var(--color-muted, #C8E2EE)' },
      { name: 'Accent', value: 'var(--color-accent, #F35959)' },
      { name: 'Energetic', value: 'var(--color-energetic, #A97FF2)' },
      {
        name: 'Background',
        value: 'var(--color-background, #ffffff)',
      },
      { name: 'Text', value: 'var(--color-primary, #000000)' },
      { name: 'Text Muted', value: 'var(--color-muted, #e2e8f0)' },
      {
        name: 'Background Light',
        value: 'var(--color-background-light, #FAFAFA)',
      },
    ],
    spacing: [
      { name: 'Large', value: 'var(--space-large, 20px)' },
      { name: 'Small', value: 'var(--space-small, 10px)' },
      { name: 'Tiny', value: '5px' },
    ],
    fontFamily: [
      { name: 'Primary', value: 'var(--primary-font, Poppins)' },
    ],
    fontSize: [
      { name: 'Small', value: 'var(--font-size-small, 12px)' },
      { name: 'Medium', value: 'var(--font-size-medium, 14px)' },
      { name: 'Large', value: 'var(--font-size-large, 16px)' },
    ],
    fontWeight: [
      { name: 'Light', value: 'var(--font-weight-light, 200)' },
      { name: 'Normal', value: 'var(--font-weight-regular, 400)' },
      { name: 'Medium', value: 'var(--font-weight-medium, 600)' },
      { name: 'Bold', value: 'var(--font-weight-bold, 800)' },
    ],
    letterSpacing: [
      {
        name: 'Tight',
        value: 'var(--letter-spacing-tight, -0.02em)',
      },
      { name: 'Normal', value: 'var(--letter-spacing-normal, 0em)' },
      {
        name: 'Relaxed',
        value: 'var(--letter-spacing-wide, 0.02em)',
      },
      { name: 'Loose', value: 'var(--letter-spacing-wide, 0.04em)' },
    ],
    lineHeight: [
      { name: 'None', value: 'var(--line-height-none, 1)' },
      { name: 'Tight', value: 'var(--line-height-tight, 1.2)' },
      { name: 'Normal', value: 'var(--line-height-normal, 1.5)' },
      { name: 'Relaxed', value: 'var(--line-height-relaxed, 1.8)' },
      { name: 'Loose', value: 'var(--line-height-loose, 2)' },
    ],
  },
});
Builder.register('insertMenu', {
  name: 'Heros',
  items: [
    { name: 'TextHero' },
    { name: 'ImageHero' },
    { name: 'SplitHero' },
    { name: 'HeroWithChildren' },
  ],
  // priority: 2,
});
Builder.register('insertMenu', {
  name: 'Cards',
  items: [{ name: 'IconCard' }, { name: 'ProductCard' }],
  // priority: 3,
});
if (Builder.isBrowser) {
  if (builder.editingModel === 'homepage') {
    Builder.register('insertMenu', {
      name: 'Layout',
      items: [
        { name: 'Columns' },
        { name: 'Builder:Carousel' },
        { name: 'Collection' },
      ],
    });
  }
}
Builder.register('insertMenu', {
  name: 'Popups',
  items: [{ name: 'UpsellPopup' }],
});

Builder.registerComponent(Counter, {
  name: 'Counter',
  image:
    'https://cdn.builder.io/api/v1/image/assets%2Fa87584e551b6472fa0f0a2eb10f2c0ff%2F000c4b516154412498592db34d340789',
  inputs: [
    {
      name: 'initialCount',
      type: 'number',
    },
  ],
});
```

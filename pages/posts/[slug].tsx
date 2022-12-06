import type { GetStaticProps, GetStaticPaths } from 'next';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import { getPostFromSlug, getSlugs, PostMeta } from '../../src/api';
import 'highlight.js/styles/atom-one-dark.css';
import React from 'react';

interface MDXPost {
  source: MDXRemoteSerializeResult<Record<string, unknown>>;
  meta: PostMeta;
}

const PostPage = ({ post }: { post: MDXPost }) => {
  return (
    <React.Fragment>
      <Head>
        <title>{post.meta.title}</title>
      </Head>
      <nav>
        <Link href="/">Início</Link>
      </nav>
      <h1>{post.meta.title}</h1>
      <MDXRemote {...post.source} components={{ Image: null }} />
    </React.Fragment>
  );
};

export default PostPage;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string };
  const { content, meta } = getPostFromSlug(slug);
  const mdxSource = await serialize(content, {
    mdxOptions: {
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        rehypeHighlight
      ]
    }
  });

  return { props: { post: { source: mdxSource, meta } } };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getSlugs().map(slug => ({ params: { slug } }));

  return {
    paths,
    fallback: false
  };
};

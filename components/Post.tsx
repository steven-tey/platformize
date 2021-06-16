import React from "react";
import { GetStaticPaths, GetStaticProps } from "next"
import ReactMarkdown from "react-markdown";
import Link from 'next/link'

export type PostProps = {
  id: number;
  title: string;
  author: {
    name: string;
    email: string;
  } | null;
  content: string;
  published: boolean;
};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.name : "Unknown author";
  return (
    <Link href={`/p/${post.id}`}><a><div>
      <h2>{post.title}</h2>
      <small>By {authorName}</small>
      <ReactMarkdown source={post.content} />
      <style jsx>{`
        div {
          color: inherit;
          padding: 2rem;
        }
      `}</style>
    </div></a></Link>
  );
};

export default Post;
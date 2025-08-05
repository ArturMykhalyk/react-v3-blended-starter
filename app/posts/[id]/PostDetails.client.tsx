'use client';

import { useParams, useRouter } from 'next/navigation';

import css from './PostDetails.module.css';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPostById, fetchUserById } from '@/lib/api';
// import { User } from '@/types/user';

export default function PostDetailsClient() {
  const id = Number(useParams().id);
  const router = useRouter();
  const handleClickBack = () => {
    router.back();
  };
  const [author, setAuthor] = useState<string>('');

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchPostById(id),
    refetchOnMount: false,
  });

  useEffect(() => {
    const fn = async () => {
      if (post?.userId) {
        const user = await fetchUserById(post.userId);
        setAuthor(user.name ?? 'Unknown');
      }
    };
    fn();
  }, [post?.userId]);

  if (isLoading) return <p>Loading...</p>;

  if (error || !post) return <p>Error loading post.</p>;

  return (
    <>
      <div className={css.container}>
        <div className={css.item}>
          <button onClick={handleClickBack} className={css.backBtn}>
            ← Back
          </button>

          <div className={css.post}>
            <div className={css.wrapper}>
              <div className={css.header}>
                <h2>{post.title}</h2>
              </div>

              <p className={css.content}>{post.body}</p>
            </div>
            <p className={css.user}>Author:{author}</p>
          </div>
        </div>
      </div>
    </>
  );
}

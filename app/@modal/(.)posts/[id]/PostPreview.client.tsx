'use client';

// import { useQuery } from '@tanstack/react-query';
import Modal from '@/components/Modal/Modal';
import { fetchPostById, fetchUserById } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';

import css from './PostPreview.module.css';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// import { User } from '@/types/user';

export default function PostPreviewClient() {
  const id = Number(useParams().id);
  const router = useRouter();

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

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal onClose={handleClose}>
      <button onClick={handleClose} className={css.backBtn}>
        ← Back
      </button>
      <div className={css.post}>
        <div className={css.wrapper}>
          <div className={css.header}>
            <h2>{post.title}</h2>
          </div>

          <p className={css.content}>{post.body}</p>
        </div>
        <p className={css.user}>{author}</p>
      </div>
    </Modal>
  );
}

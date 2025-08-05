import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import PostDetailsClient from './PostDetails.client';
import { fetchPostById } from '@/lib/api';
type Props = {
  params: Promise<{ id: number }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const post = await fetchPostById(id);

  return {
    title: post.title,
    description: post.body.slice(0, 30), // перші 30 символів
  };
}

export default async function PostDetails({ params }: Props) {
  const { id } = await params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPostById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostDetailsClient />
    </HydrationBoundary>
  );
}

import { fetchPosts } from '@/lib/api';
import PostsClient from './Posts.client';

type Props = {
  params: Promise<{ slug: string[] }>;
};
export default async function PostsPage({ params }: Props) {
  const { slug } = await params;
  const userId = slug[0] === 'All' ? undefined : slug[0];
  const initialData = await fetchPosts({ searchText: '', page: 1, userId });
  return <PostsClient initialData={initialData} userId={slug[0]} />;
}

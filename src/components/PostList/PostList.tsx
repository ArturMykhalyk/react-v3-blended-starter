import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Post } from "../../types/post";
import css from "./PostList.module.css";
import { deletePost } from "../../services/postService";
import toast from "react-hot-toast";
interface PostListProps {
  posts: Post[];
  onClickEdit: (post: Post) => void;
}
export default function PostList({ posts, onClickEdit }: PostListProps) {
  const queryClient = useQueryClient();

  const mutationDelete = useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success(`Post deleted.`);
    },
    onError: () => {
      toast.error(`Failed to delete post.`);
    },
  });

  const handleClickDelete = (id: number) => {
    mutationDelete.mutate(id);
  };

  return (
    <ul className={css.list}>
      {posts.map(({ id, title, body, userId }) => (
        <li key={id} className={css.listItem}>
          <h2 className={css.title}>{title}</h2>
          <p className={css.content}>{body}</p>
          <div className={css.footer}>
            <button onClick={() => onClickEdit({ id, title, userId, body })} className={css.edit}>
              Edit
            </button>
            <button
              onClick={() => {
                handleClickDelete(id);
              }}
              className={css.delete}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

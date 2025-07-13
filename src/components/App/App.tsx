import Modal from "../Modal/Modal";
import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";

import css from "./App.module.css";
import { useDebouncedCallback } from "use-debounce";
import { useEffect, useState } from "react";
import { fetchPosts } from "../../services/postService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Post } from "../../types/post";
import { ErrorMessageEmpty } from "../ErrorMessageEmpty/ErrorMessageEmpty";
import { Toaster } from "react-hot-toast";
import { Loader } from "../Loader/Loader";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import CreatePostForm from "../CreatePostForm/CreatePostForm";
import EditPostForm from "../EditPostForm/EditPostForm";

const PER_PAGE = 8;

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const [searchPosts, setSearchPosts] = useState<Post[]>([]);
  type ModalType = "create" | "edit" | null;
  const [modalType, setModalType] = useState<ModalType>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetchPosts(),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const filtered = query
        ? data.filter((post) => post.title.toLowerCase().includes(query.toLowerCase()))
        : data;
      setSearchPosts(filtered);
      setCurrentPage(1);
    }
  }, [data, query]);

  // Пагінація
  const totalPages = Math.ceil(searchPosts.length / PER_PAGE);
  const startIndex = (currentPage - 1) * PER_PAGE;
  const paginatedPosts = searchPosts.slice(startIndex, startIndex + PER_PAGE);

  const handleChange = useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setCurrentPage(1);
  }, 300);

  const handleCreatePost = () => {
    setModalType("create");
  };
  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setModalType("edit");
  };
  const handleCloseModal = () => setModalType(null);
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleChange} />
        {isSuccess && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
        <button onClick={handleCreatePost} className={css.button}>
          Create post
        </button>
      </header>
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      <Toaster position="top-right" />
      {isSuccess && paginatedPosts.length === 0 && <ErrorMessageEmpty />}
      {isSuccess && paginatedPosts.length > 0 && (
        <PostList onClickEdit={handleEditPost} posts={paginatedPosts} />
      )}
      {modalType === "create" && (
        <Modal onClose={handleCloseModal}>
          <CreatePostForm onClose={handleCloseModal} />
        </Modal>
      )}
      {modalType === "edit" && editingPost && (
        <Modal onClose={handleCloseModal}>
          <EditPostForm post={editingPost} onClose={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
}

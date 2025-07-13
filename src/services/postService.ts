import axios from "axios";
import { FormValues, Post } from "../types/post";


axios.defaults.baseURL = "https://jsonplaceholder.typicode.com";

export const fetchPosts = async (): Promise<Post[]> => {

     const response = await axios.get<Post[]>(
        `/posts/`
    );
    return response.data;
};

export const createPost = async (newPost:FormValues): Promise<Post> => {
    const response = await axios.post<Post>(
      '/posts',
        newPost
    );
    return response.data;
};

export const editPost = async (newDataPost:Post): Promise<Post> => {
    const response = await axios.put<Post>(`/posts/${newDataPost.id}`, newDataPost);
  return response.data;
};

export const deletePost = async (postId:number) => {
     await axios.delete(`/posts/${postId}`);
};

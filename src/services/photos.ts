import axios from "axios";
import type { Photo } from "../types/photo";

const API_KEY = import.meta.env.VITE_API_KEY;
axios.defaults.baseURL = "https://api.pexels.com/v1/";
axios.defaults.headers.common["Authorization"] = API_KEY;
axios.defaults.params = {
  orientation: "landscape",
};

interface PhotosHttpResp{

  photos: Photo[];
  per_page: number;
  total_rusults: number;
    
}

export const getPhotos = async (query:string,page:number) => {
const {data} = await axios.get<PhotosHttpResp>(`search?query=${query}&page=${page}`);
  console.log(data);
  return data;
};

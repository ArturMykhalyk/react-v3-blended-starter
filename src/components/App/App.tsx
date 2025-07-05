import { useEffect, useState } from "react";

import Section from "../Section/Section";
import Container from "../Container/Container";
import { getPhotos } from "../../services/photos";
import Form from "../Form/Form";

import type { Photo } from "../../types/photo";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader/Loader";
import Text from "../Text/Text";
import PhotosGallery from "../PhotosGallery/PhotosGallery";
import Modal from "../Modal/Modal";
import Pagination from "../Pagination/Pagination";

export default function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number | null>(null);
  // const [isVisible, setVisible] = useState<boolean>(false);

  const handleSelectPhoto = (photo: Photo | null) => {
    setSelectedPhoto(photo);
  };

  const handleSubmit = async (query: string) => {
    setQuery(query);
    setPage(1);
    setPageCount(null);
    setPhotos([]);
  };

  useEffect(() => {
    if (!query) return;

    interface ConstGetPhotos {
      photos: Photo[];
      per_page: number;
      total_results: number;
    }
    const fetchPhotos = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const { photos, per_page, total_results }: ConstGetPhotos =
          await getPhotos(query, page);
        if (photos.length === 0) {
          toast.error("No photos found for your request.");
          return;
        }
        setPageCount(Math.ceil(total_results / per_page));
        setPhotos(photos);
        //для load more
        // setPhotos((prevPhoto) => [...prevPhoto, ...photos]);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPhotos();
  }, [page, query]);

  interface PageClickEvent {
    selected: number;
  }
  const handlePageClick = (event: PageClickEvent) => {
    // setPhotos([]);
    setPage(event.selected + 1);
  };

  return (
    <>
      <Section>
        <Container>
          <Form onSubmit={handleSubmit} />
          {isLoading && <Loader />}
          {isError && (
            <Text textAlign="center">
              {" "}
              There was an error, please try again...😔
            </Text>
          )}

          {photos.length > 0 && (
            <PhotosGallery photos={photos} onSelect={handleSelectPhoto} />
          )}

          {pageCount && (
            <Pagination onPageClick={handlePageClick} pageCount={pageCount} />
          )}

          {selectedPhoto && (
            <Modal
              onClose={() => setSelectedPhoto(null)}
              photo={selectedPhoto}
            />
          )}
        </Container>

        <Toaster position="top-right" />
      </Section>
    </>
  );
}

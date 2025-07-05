import css from "./Pagination.module.css";
import ReactPaginate from "react-paginate";
interface PageClickEvent {
  selected: number;
}
interface PaginationProps {
  onPageClick: (event: PageClickEvent) => void;
  pageCount: number;
}
export default function Pagination({
  onPageClick,
  pageCount,
}: PaginationProps) {
  return (
    <ReactPaginate
      containerClassName={css.pagination_conteiner}
      breakLabel="..."
      breakClassName={css.break_btn}
      breakLinkClassName={css.break_link}
      nextLabel="next >"
      nextClassName={css.next_btn}
      nextLinkClassName={css.next_link}
      onPageChange={onPageClick}
      marginPagesDisplayed={2}
      pageRangeDisplayed={3}
      pageCount={pageCount}
      pageClassName={css.page_number}
      pageLinkClassName={css.page_link}
      previousLabel="< previous"
      previousClassName={css.prev_btn}
      previousLinkClassName={css.prev_link}
      renderOnZeroPageCount={null}
      activeLinkClassName={css.active}
    />
  );
}

import { FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";

import style from "./Form.module.css";

interface SearchFormProps {
  onSubmit: (value: string) => void;
}

export default function Form({ onSubmit }: SearchFormProps) {
  const handleSubmit = (formData: FormData) => {
    const query = formData.get("search") as string;
    if (query.trim().length === 0) {
      toast.error("Please enter your search query.");
      return;
    }
    onSubmit(query.trim());
  };

  return (
    <form action={handleSubmit} className={style.form}>
      <input
        className={style.input}
        placeholder="What do you want to write?"
        name="search"
        autoFocus
      />

      <button className={style.button} type="submit">
        <FiSearch size="16px" />
      </button>
    </form>
  );
}

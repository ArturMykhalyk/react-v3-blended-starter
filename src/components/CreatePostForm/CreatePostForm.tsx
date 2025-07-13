import * as Yup from "yup";
import { Field, Form, Formik, ErrorMessage } from "formik";

import css from "./CreatePostForm.module.css";
import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../../services/postService";
import toast from "react-hot-toast";
import { FormValues } from "../../types/post";

const NoteFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  body: Yup.string()
    .max(500, "Content must be at most 500 characters")
    .required("Content is required"),
});

const formValues: FormValues = {
  title: "",
  body: "",
};

interface CreatePostFormProps {
  onClose: () => void;
}
export default function CreatePostForm({ onClose }: CreatePostFormProps) {
  const fieldId = useId();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onClose();
      toast.success(`Post "${data.title}" created.`);
    },
    onError: () => {
      toast.error(`Failed to create post.`);
    },
  });

  const handleSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };
  {
    return (
      <Formik initialValues={formValues} onSubmit={handleSubmit} validationSchema={NoteFormSchema}>
        {({ isSubmitting }) => {
          return (
            <Form className={css.form}>
              <div className={css.formGroup}>
                <label htmlFor={`${fieldId}-title`}>Title</label>
                <Field id={`${fieldId}-title`} type="text" name="title" className={css.input} />
                <ErrorMessage name="title" component="span" className={css.error} />
              </div>

              <div className={css.formGroup}>
                <label htmlFor={`${fieldId}-body`}>Content</label>
                <Field
                  id={`${fieldId}-body`}
                  as="textarea"
                  name="body"
                  rows="8"
                  className={css.textarea}
                />
                <ErrorMessage name="body" component="span" className={css.error} />
              </div>

              <div className={css.actions}>
                <button
                  type="button"
                  className={css.cancelButton}
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button type="submit" className={css.submitButton} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Create post"}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    );
  }
}

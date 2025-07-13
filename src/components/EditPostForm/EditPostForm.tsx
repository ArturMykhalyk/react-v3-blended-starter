import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";

import css from "./EditPostForm.module.css";
import { FormValues, Post } from "../../types/post";
import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editPost } from "../../services/postService";
import toast from "react-hot-toast";

const NoteFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  body: Yup.string()
    .max(500, "Content must be at most 500 characters")
    .required("Content is required"),
});

interface EditPostFormProps {
  onClose: () => void;
  post: Post;
}

export default function EditPostForm({ onClose, post }: EditPostFormProps) {
  const fieldId = useId();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onClose();
      toast.success(`Post  edited.`);
    },
    onError: () => {
      toast.error(`Failed to edit post.`);
    },
  });
  const handleSubmit = (values: FormValues) => {
    mutation.mutate({ ...post, ...values });
  };
  return (
    <Formik
      initialValues={{ title: post.title, body: post.body }}
      onSubmit={handleSubmit}
      validationSchema={NoteFormSchema}
    >
      {({ isSubmitting }) => {
        return (
          <Form className={css.form}>
            <div className={css.formGroup}>
              <label htmlFor={`${fieldId}-title`}>Title</label>
              <Field id={`${fieldId}-title`} type="text" name="title" className={css.input} />
              <ErrorMessage name="title" component="span" className={css.error} />
            </div>

            <div className={css.formGroup}>
              <label htmlFor={`${fieldId}-title`}>Content</label>
              <Field
                id={`${fieldId}-title`}
                as="textarea"
                name="body"
                rows={8}
                className={css.textarea}
              />
              <ErrorMessage name="body" component="span" className={css.error} />
            </div>

            <div className={css.actions}>
              <button
                onClick={onClose}
                type="button"
                className={css.cancelButton}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button type="submit" className={css.submitButton} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Edit post"}
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

import Button from "@components/button";
import styles from "./comment.module.css";
import { useRef } from "react";
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { commentsCacheKey, deleteComment } from "@/api-routes/comments";

export default function Comment({ comment, createdAt, author, id }) {

  const formRef = useRef();
  const { data: { data = [] } = {}, error } = useSWR();

  const { trigger: deleteCommentTrigger } = useSWRMutation(commentsCacheKey,deleteComment, {
    onError: (error) => {
      console.log(error)
    }
  })

  const handleDelete = async () => {
    const { data, error } = await deleteCommentTrigger(id)
    console.log({ id });
  };

  return (
    <div className={styles.container}>
      <p>{comment}</p>
      <p className={styles.author}>Author: {author}</p>
      <time className={styles.date}>{createdAt}</time>

      {/* The Delete part should only be showed if you are authenticated and you are the author */}
      <div className={styles.buttonContainer}>
        <Button onClick={handleDelete}>Delete</Button>
      </div>
    </div>
  );
}

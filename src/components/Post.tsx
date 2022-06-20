import { useState, FormEvent, ChangeEvent, InvalidEvent } from 'react';
import {format, formatDistanceToNow} from 'date-fns';
import {ptBR} from 'date-fns/locale';

import { Avatar } from './Avatar';
import {Comment} from './Comment';
import styles from './Post.module.css'

interface Author {
  name: string;
  role: string;
  avatarUrl: string
}

interface Content {
  type: string;
  content: string;

}

export interface PostProps{
  author: Author;
  content: Content[];
  publishedAt: Date;
}

export function Post({author, content, publishedAt}: PostProps) {

  const publishedAtFormatted = format(publishedAt, "d 'de' LLLL 'às' HH:mm'h'", {
    locale: ptBR
  });

  const publishedAtDateRelativeToNow = formatDistanceToNow(publishedAt, {
    locale: ptBR,
    addSuffix: true
    
  });

  const [comments, setComments] = useState(['Post muito bacana, heim?!']);

  const [newCommentText, setNewCommentText] = useState('');

  const isNewCommentEmppty = newCommentText.length === 0;

  function handleNewCommentChange(event: ChangeEvent<HTMLTextAreaElement>){
    event.target.setCustomValidity('');
    setNewCommentText(event.target.value);
  }

  function handleCreateNewComment(event: FormEvent){

    event.preventDefault();
    setComments([...comments, newCommentText]);
    setNewCommentText('');

  }

  function deleteComment(commentToDelete: string){

    const commentsWithoutDeleteOne = comments.filter(comment => comment !== commentToDelete );

    setComments(commentsWithoutDeleteOne);
  }

  function handleNewCommentInvalid(event: InvalidEvent<HTMLTextAreaElement>){
    event.target.setCustomValidity('Esse campo é obrigatório!');
  }

  return (
    <article  className={styles.post}>
      
      <header>
        <div className={styles.author}>
          
          <Avatar src={author.avatarUrl} />
          
          <div className={styles.authorInfo}>
            <strong>{author.name}</strong>
            <span>{author.role}</span>
          </div>

        </div>

        <time title={publishedAtFormatted} dateTime={publishedAt.toISOString()}>
          {publishedAtDateRelativeToNow}
        </time>
      </header>

      <div className={styles.content}>

        {
          content.map((line, index) => {
            if(line.type === 'paragraph'){
              return <p key={index}>{line.content}</p>;
            }
            else if(line.type === 'link'){
              return <p key={index}> <a href='#'>{line.content}</a> </p>
            }
          })
        }

      </div>

      <form onSubmit={handleCreateNewComment} className={styles.commentForm}>
        <strong>Deixe seu feedback</strong>

        <textarea
          onChange={handleNewCommentChange}
          value={newCommentText}
          name="comment"
          placeholder='Deixe um comentário'
          onInvalid={handleNewCommentInvalid}
          required
        />

       <footer>
        <button type='submit' disabled={isNewCommentEmppty} >Publicar</button>
       </footer>
      </form>

      <div className={styles.commentList}>
        {
          comments.map((comment, index) => {
            return <Comment key={index} content={comment} onDeleteComment={deleteComment} />
          })
        }
      </div>
    </article>
  );
}
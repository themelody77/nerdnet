import React from 'react';
import "./Post.css";
import TextPost from './TextPost';
import ImagePost from './ImagePost';

export default function Post(props) {

  return (
    <div id='post'>
      {props.isMultimedia ? 
        <ImagePost {...props}/>
      :
        <TextPost {...props}/>
      }
    </div>
  )
}

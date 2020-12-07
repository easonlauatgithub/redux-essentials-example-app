import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'

export const PostsList = () => {
  const posts = useSelector(state => state.posts)

  const orderedPosts = posts.slice().sort((a, b) => {
    if( typeof(a.date) === 'undefined' || typeof(b.date) === 'undefined'){
      return -1; //sort to the bottom if undefined
    }
    return b.date.localeCompare(a.date);
  })

  //const renderedPosts = posts.map(post => (
  const renderedPosts = orderedPosts.map(post => {
    return (
      <article className="post-excerpt" key={post.id}>
        <h3>{post.title}</h3>
        <p className="post-content">{post.content.substring(0, 100)}</p>
        <Link to={`/posts/${post.id}`} className="button muted-button">View</Link>
        <Link to={`/editPost/${post.id}`} className="button muted-button">Edit</Link>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date}/>
        <ReactionButtons post={post}/>
      </article>
    )
  })

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {renderedPosts}
    </section>
  )
}
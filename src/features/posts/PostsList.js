import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'
import { selectAllPosts, fetchPosts } from './postsSlice'


export const PostsList = () => {
  const dispatch = useDispatch()
  const posts = useSelector(selectAllPosts)

  const postStatus = useSelector(state => state.posts.status)
  const error = useSelector(state => state.posts.error)

  //useEffect(()=>{}, []) componentDidMount
  //useEffect(()=>{}, [value]) componentDidUpdate
  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts())
    }
  }, [postStatus, dispatch])

  let content

  if (postStatus === 'loading') {
    content = <div className="loader">Loading...</div>
  } else if (postStatus === 'succeeded') {
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
    content = renderedPosts
  } else if (postStatus === 'failed') {
    content = <div>{error}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}
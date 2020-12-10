import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectAllPosts, fetchPosts } from './postsSlice'
import { PostExcerpt } from './PostExcerpt'


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
        <PostExcerpt post={post} key={post.id}></PostExcerpt>
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
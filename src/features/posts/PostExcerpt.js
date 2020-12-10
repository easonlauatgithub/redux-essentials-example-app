import React from 'react'
import { Link } from 'react-router-dom'
import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'
import { selectPostById } from './postsSlice'
import { useSelector } from 'react-redux'

//let pe = ({ post }) => {
let Pe = ({ postId }) => {
    const post = useSelector(state => selectPostById(state, postId))

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
}

export const PostExcerpt = React.memo(Pe)
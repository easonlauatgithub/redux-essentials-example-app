import React, { useState } from 'react'
import { useDispatch, useSelector  } from 'react-redux'
import { postAdded2, addNewPost } from './postsSlice'
import { unwrapResult } from '@reduxjs/toolkit'
import { selectAllUsers } from '../users/usersSlice'

export const AddPostForm = () => {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [userId, setUserId] = useState('')
    const [addRequestStatus, setAddRequestStatus] = useState('idle')
    
    const dispatch = useDispatch()

    //const users = useSelector(state => state.users)
    const users = useSelector(selectAllUsers)
    

    const onTitleChanged = e => setTitle(e.target.value)
    const onContentChanged = e => setContent(e.target.value)
    const onAuthorChanged = e => setUserId(e.target.value)

    // const canSave = Boolean(title) && Boolean(content) && Boolean(userId)
    // const onSavePostClicked = () => {
    //     if (title && content) {
    //         //dispatch(postAdded1({id: nanoid(),title,content}))
    //         dispatch(postAdded2(title, content, userId))
    //         setTitle('')
    //         setContent('')
    //         setUserId('')
    //     }
    // }

    const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle'

    const onSavePostClicked = async () => {
        if (canSave) {
            try {
                setAddRequestStatus('pending')
                const resultAction = await dispatch(addNewPost({ title, content, user: userId }))
                //return either the actual action.payload value from a fulfilled action
                //or throw an error if it's the rejected action
                unwrapResult(resultAction)
                setTitle('')
                setContent('')
                setUserId('')
            } catch (err) {
                console.error('Failed to save the post: ', err)
            } finally {
                setAddRequestStatus('idle')
            }
        }
    }

    const usersOptions = users.map(user => (
      <option key={user.id} value={user.id}>
        {user.name}
      </option>
    ))

    return (
        <section>
            <h2>Add a New Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChanged}
                />
                <label htmlFor="postAuthor">Author:</label>
                <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
                    <option value="">Please select user</option>
                    {usersOptions}
                </select>
                <label htmlFor="postContent">Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                />
                <button type="button" onClick={onSavePostClicked} disabled={!canSave}>Save</button>
            </form>
        </section>
    )
}
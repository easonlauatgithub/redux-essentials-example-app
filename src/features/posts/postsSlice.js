import { createSlice } from '@reduxjs/toolkit'
import { nanoid } from '@reduxjs/toolkit'
import { sub } from 'date-fns'

const initialState = [
  { id: '1', title: 'First Post!', content: 'Hello!', 
  date: sub(new Date(), { minutes: 10 }).toISOString(),
  reactions: {thumbsUp:1, hooray:2, heart:3, rocket:4, eyes:5} },
  { id: '2', title: 'Second Post', content: 'More text', 
  date: sub(new Date(), { minutes: 5 }).toISOString(),
  reactions: {} }
]

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reactionAdded(state, action) {
      //action objects as small as possible, so calculate the new state value in reducer
      const { postId, reaction } = action.payload
      const existingPost = state.find(post => post.id === postId)
      if (existingPost) {
        if (existingPost.reactions[reaction] == null){
          existingPost.reactions[reaction] = 0
        }
        existingPost.reactions[reaction]++
      }
    },
    postAdded2: {
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            user: userId,
            date: new Date().toISOString(),
            reactions: {}
          },
          meta: "Some meta data here"
        }
        //action type 'posts/postAdded2' will be added
      },
      reducer(state, action) {
        state.push(action.payload)
      }
    },
    postAdded1(state, action) { 
      //will generate action.type 'posts/postAdded1'
      //will generate action creator, postAdded1, for dispatch(postAdded1(action.payload))
      state.push(action.payload)
    },
    postUpdated(state, action) {
        const { id, title, content } = action.payload
        const existingPost = state.find(post => post.id === id)
        if (existingPost) {
          existingPost.title = title
          existingPost.content = content
        }
    }
  }
})

export const { postAdded1, postAdded2, postUpdated, reactionAdded } = postsSlice.actions
export default postsSlice.reducer
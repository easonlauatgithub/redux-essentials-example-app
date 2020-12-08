import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../api/client'

//const initialState = [{ id: '1', title: 'First Post!', content: 'Hello!', date: sub(new Date(), { minutes: 10 }).toISOString(), reactions: {thumbsUp:1, hooray:2, heart:3, rocket:4, eyes:5} },{ id: '2', title: 'Second Post', content: 'More text', date: sub(new Date(), { minutes: 5 }).toISOString(),reactions: {} }]
const initialState = {
  posts: [],
  status: 'idle',
  error: null
}

//createAsyncThunk generates thunks that automatically dispatch those "start/success/failure" actions
//argument1: A string that will be used as the prefix for the generated action types
//argument2: A "payload creator" callback function that should return a Promise containing some data, or a rejected Promise with an error
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts')
  return response.posts
})

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reactionAdded(state, action) {
      //action objects as small as possible, so calculate the new state value in reducer
      const { postId, reaction } = action.payload
      const existingPost = state.posts.find(post => post.id === postId)
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
        state.posts.push(action.payload)
      }
    },
    postAdded1(state, action) { 
      //will generate action.type 'posts/postAdded1'
      //will generate action creator, postAdded1, for dispatch(postAdded1(action.payload))
      state.posts.push(action.payload)
    },
    postUpdated(state, action) {
        const { id, title, content } = action.payload
        const existingPost = state.posts.find(post => post.id === id)
        if (existingPost) {
          existingPost.title = title
          existingPost.content = content
        }
    }
  },
  extraReducers: { //listening for  those "start/success/failure" actions
    [fetchPosts.pending]: (state, action) => {
      state.status = 'loading'
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.status = 'succeeded'
      // Add any fetched posts to the array
      state.posts = state.posts.concat(action.payload)
    },
    [fetchPosts.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    }
  }
})

export const { postAdded1, postAdded2, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

export const selectAllPosts = state => state.posts.posts
export const selectPostById = (state, postId) => state.posts.posts.find(post => post.id === postId)
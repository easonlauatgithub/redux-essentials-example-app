import { createSlice, nanoid, createAsyncThunk, createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { client } from '../../api/client'

//const initialState = [{ id: '1', title: 'First Post!', content: 'Hello!', date: sub(new Date(), { minutes: 10 }).toISOString(), reactions: {thumbsUp:1, hooray:2, heart:3, rocket:4, eyes:5} },{ id: '2', title: 'Second Post', content: 'More text', date: sub(new Date(), { minutes: 5 }).toISOString(),reactions: {} }]
//const initialState = { posts: [], status: 'idle', error: null }
const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})
const initialState = postsAdapter.getInitialState({
  status: 'idle',
  error: null
})

//createAsyncThunk generates thunks that automatically dispatch those "start/success/failure" actions
//argument1: A string that will be used as the prefix for the generated action types
//argument2: A "payload creator" callback function that should return a Promise containing some data, or a rejected Promise with an error
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts', 
  async () => {
    const response = await client.get('/fakeApi/posts')
    return response.posts
  }
)

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  // The payload creator receives the partial `{title, content, user}` object
  async initialPost => {
    // We send the initial data to the fake API server
    const response = await client.post('/fakeApi/posts', { post: initialPost })
    // The response includes the complete post object, including unique ID
    return response.post
  }
)

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reactionAdded(state, action) {
      //action objects as small as possible, so calculate the new state value in reducer
      const { postId, reaction } = action.payload
      //const existingPost = state.posts.find(post => post.id === postId)
      const existingPost = state.entities[postId]
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
        //const existingPost = state.posts.find(post => post.id === id)
        const existingPost = state.entities[id]
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
      //state.posts = state.posts.concat(action.payload)
      // Use the `upsertMany` reducer as a mutating update utility
      // action.payload - array of posts
      postsAdapter.upsertMany(state, action.payload)      
    },
    [fetchPosts.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    },
    [addNewPost.fulfilled]: (state, action) => {
      // We can directly add the new post object to our posts array
      state.posts.push(action.payload)
    },
    // Use the `addOne` reducer for the fulfilled case
    [addNewPost.fulfilled]: postsAdapter.addOne    
  }
})

export const { postAdded1, postAdded2, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

// export const selectAllPosts = state => state.posts.posts
// export const selectPostById = (state, postId) => state.posts.posts.find(post => post.id === postId)
// Export the customized selectors for this adapter using `getSelectors`
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
  // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state => state.posts)

//createSelector - generates memoized selectors that will only recalculate results when the inputs change
//call selectPostsByUser(state, userId)
export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId], //input selector
  (posts, userId) => posts.filter(post => post.user === userId) //output selector
)
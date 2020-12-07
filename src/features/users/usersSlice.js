import { createSlice } from '@reduxjs/toolkit'

const initialState = [
  { id: '0', name: 'Eason Lau' },
  { id: '1', name: 'Angus Wong' },
  { id: '2', name: 'Philip Chak' },
  { id: '3', name: 'Lakso Chan' },
  { id: '4', name: 'Bosco Ho' },
  { id: '5', name: 'Nam Hui' },
  { id: '6', name: 'Kent Lei' },
  { id: '7', name: 'Oscar Chan' }
]

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {}
})

export default usersSlice.reducer
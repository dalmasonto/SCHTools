import { createSlice } from '@reduxjs/toolkit'

const AppSlice = createSlice({
  name: '_sch_tools_app',
  initialState: {
    linkgroups: [],
    chaptergroups: [],
  },
  reducers: {
    addgroup: (state, action) => {
      state.linkgroups.push(action.payload)
    },

    removegroup: (state, action) => {
      const index = state.linkgroups.findIndex(group => group.id === action.payload)
      state.linkgroups.splice(index, 1)
    },

    addchaptergroup: (state, action) => {
      state.chaptergroups.push(action.payload)
    },

    removechaptergroup: (state, action) => {
      const index = state.chaptergroups.findIndex(group => group.id === action.payload)
      state.chaptergroups.splice(index, 1)
    }

  }
})

export const { addgroup, removegroup, addchaptergroup, removechaptergroup } = AppSlice.actions;

export const selectApp = (state) => state._sch_tools_app;

export default AppSlice.reducer
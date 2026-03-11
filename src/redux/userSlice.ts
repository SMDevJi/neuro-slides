import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface IUser {
    id: string | null
    email: string | null 
    image?: string | null 
    name: string | null 
    credits: number | null 
}

const initialState: IUser = {
    id: null,
    email: null,
    image: null,
    name: null,
    credits:null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUser>) => {
            return { ...state, ...action.payload }
        },
        clearUser: (state) => {
            state.id = null
            state.email = null
            state.image = null
            state.name = null
            state.credits=null
        }
    }
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
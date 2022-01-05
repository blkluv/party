import { createSlice } from '@reduxjs/toolkit'

export interface AuthState {
    user: any;
    loading: boolean;
}

const initialState: AuthState = {
    user: null,
    loading: false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthLoading: (state: AuthState, { payload }) => {
            const value: any = payload;
            state.loading = value;
        },
        setAuthUser: (state: AuthState, { payload }) => {
            const value: boolean = payload;
            state.user = value;
        },
    },
})

export const { setAuthLoading, setAuthUser } = authSlice.actions

export default authSlice.reducer
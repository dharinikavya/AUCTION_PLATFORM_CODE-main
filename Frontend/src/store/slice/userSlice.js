import { USER_API_POINT } from "@/utils/APIs";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

/* ================= 🔔 NOTIFICATIONS THUNKS ================= */
export const fetchNotifications = createAsyncThunk(
  "user/fetchNotifications",
  async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/notifications`,
      { withCredentials: true }
    );
    return data.notifications;
  }
);

export const markReadNotifications = createAsyncThunk(
  "user/markReadNotifications",
  async () => {
    const { data } = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/notifications/read`,
      {},
      { withCredentials: true }
    );
    return data.notifications;
  }
);

/* ================= SLICE ================= */
const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    isAuthenticated: false,
    user: null,

    /* 🏆 Leaderboard */
    leaderboard: [],

    /* 🔔 Notifications */
    notifications: [],
    unreadNotificationCount: 0,
  },

  reducers: {
    /* ================= AUTH ================= */
    registerRequest(state) {
      state.loading = true;
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    registerFailed(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
    },

    loginRequest(state) {
      state.loading = true;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    loginFailed(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
    },

    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.notifications = [];
      state.unreadNotificationCount = 0;
    },

    /* ================= USER ================= */
    fetchUserRequest(state) {
      state.loading = true;
    },
    fetchUserSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    fetchUserFailed(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
    },

    /* ================= LEADERBOARD ================= */
    fetchLeaderBoardRequest(state) {
      state.loading = true;
    },
    fetchLeaderBoardSuccess(state, action) {
      state.loading = false;
      state.leaderboard = action.payload;
    },
    fetchLeaderBoardFailed(state) {
      state.loading = false;
      state.leaderboard = [];
    },
  },

  /* ================= 🔔 EXTRA REDUCERS (NOTIFICATIONS) ================= */
  extraReducers: (builder) => {
    builder
      /* ===== Fetch Notifications ===== */
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.unreadNotificationCount = action.payload.filter(
          (n) => !n.isRead
        ).length;
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.loading = false;
      })

      /* ===== Mark Read ===== */
      .addCase(markReadNotifications.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({
          ...n,
          isRead: true,
        }));
        state.unreadNotificationCount = 0;
      });
  },
});

/* ================= REGISTER ================= */
export const register = (formData) => async (dispatch) => {
  dispatch(userSlice.actions.registerRequest());
  try {
    const { data } = await axios.post(
      `${USER_API_POINT}/register`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    dispatch(userSlice.actions.registerSuccess(data));
    toast.success(data.message);
  } catch (error) {
    dispatch(userSlice.actions.registerFailed());
    toast.error(error?.response?.data?.message);
  }
};

/* ================= LOGIN ================= */
export const login = ({ email, password }) => async (dispatch) => {
  dispatch(userSlice.actions.loginRequest());
  try {
    const { data } = await axios.post(
      `${USER_API_POINT}/login`,
      { email, password },
      { withCredentials: true }
    );
    dispatch(userSlice.actions.loginSuccess(data));
    toast.success(data.message);
  } catch (error) {
    dispatch(userSlice.actions.loginFailed());
    toast.error(error?.response?.data?.message);
  }
};

/* ================= LOGOUT ================= */
export const logout = () => async (dispatch) => {
  try {
    const { data } = await axios.get(`${USER_API_POINT}/logout`, {
      withCredentials: true,
    });
    dispatch(userSlice.actions.logoutSuccess());
    toast.success(data.message);
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

/* ================= FETCH USER ================= */
export const fetchUser = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchUserRequest());
  try {
    const { data } = await axios.get(`${USER_API_POINT}/me`, {
      withCredentials: true,
    });
    dispatch(userSlice.actions.fetchUserSuccess(data.user));
  } catch {
    dispatch(userSlice.actions.fetchUserFailed());
  }
};

/* ================= FETCH LEADERBOARD ================= */
export const fetchLeaderBoard = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchLeaderBoardRequest());
  try {
    const { data } = await axios.get(`${USER_API_POINT}/leaderboard`, {
      withCredentials: true,
    });
    dispatch(
      userSlice.actions.fetchLeaderBoardSuccess(data.leaderboard)
    );
  } catch {
    dispatch(userSlice.actions.fetchLeaderBoardFailed());
  }
};

export default userSlice.reducer;

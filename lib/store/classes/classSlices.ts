// src/store/slices/class/classSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { classApi, ClassData } from "../classes/classApi";

interface ClassState {
  classes: ClassData[];
  selectedClass: ClassData | null;
  teacherStats: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: ClassState = {
  classes: [],
  selectedClass: null,
  teacherStats: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchClasses = createAsyncThunk(
  "class/fetchClasses",
  async (_, { rejectWithValue }) => {
    try {
      return await classApi.getAllClasses();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchClassById = createAsyncThunk(
  "class/fetchClassById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await classApi.getClassById(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchTeacherStats = createAsyncThunk(
  "class/fetchTeacherStats",
  async (teacherId: string, { rejectWithValue }) => {
    try {
      return await classApi.getTeacherStats(teacherId);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createClass = createAsyncThunk(
  "class/createClass",
  async (data: ClassData, { rejectWithValue }) => {
    try {
      return await classApi.createClass(data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateClass = createAsyncThunk(
  "class/updateClass",
  async (
    { id, data }: { id: string; data: Partial<ClassData> },
    { rejectWithValue }
  ) => {
    try {
      return await classApi.updateClass(id, data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteClass = createAsyncThunk(
  "class/deleteClass",
  async (id: string, { rejectWithValue }) => {
    try {
      return await classApi.deleteClass(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const classSlice = createSlice({
  name: "class",
  initialState,
  reducers: {
    clearSelectedClass(state) {
      state.selectedClass = null;
    },
    clearTeacherStats(state) {
      state.teacherStats = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch classes
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.classes = action.payload?.data?.classes || [];
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch class by ID
      .addCase(
        fetchClassById.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.selectedClass = action.payload;
        }
      )
      // Fetch teacher stats
      .addCase(
        fetchTeacherStats.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.teacherStats = action.payload;
        }
      )
      // Create, update, delete
      .addCase(createClass.fulfilled, (state, action: PayloadAction<any>) => {
        state.classes.push(action.payload.class);
      })
      .addCase(updateClass.fulfilled, (state, action: PayloadAction<any>) => {
        const index = state.classes.findIndex(
          (c) => c._id === action.payload.class._id
        );
        if (index !== -1) state.classes[index] = action.payload.class;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        const deletedId = (action as any).meta.arg;
        state.classes = state.classes.filter((c) => c._id !== deletedId);
      });
  },
});

export const { clearSelectedClass, clearTeacherStats } = classSlice.actions;
export default classSlice.reducer;

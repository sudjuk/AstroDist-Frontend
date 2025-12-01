import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AsteroidObservationsService } from '../../api/generated';

export interface RequestRow {
  id: number;
  status: string;
  creatorLogin: string;
  moderatorLogin?: string | null;
  comment?: string | null;
  calculatedKm?: number | null;
  formedAt?: string | null;
}

interface RequestsState {
  items: RequestRow[];
  loading: boolean;
  error: string | null;
}

const initialState: RequestsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchRequests = createAsyncThunk<
  RequestRow[],
  void,
  { rejectValue: string }
>('requests/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const data: any = await AsteroidObservationsService.getApiAsteroidObservations({});
    const rawItems: any[] = Array.isArray(data?.items) ? data.items : [];
    const normalized: RequestRow[] = rawItems.map((row: any) => ({
      id: row.ID ?? row.Id ?? row.id ?? 0,
      status: row.Status ?? row.status ?? '',
      creatorLogin:
        row.CreatorLogin ?? row.creatorLogin ?? row.creator_login ?? '',
      moderatorLogin:
        row.ModeratorLogin ?? row.moderatorLogin ?? row.moderator_login ?? null,
      comment: row.Comment ?? row.comment ?? null,
      calculatedKm:
        row.CalculatedKM ?? row.calculatedKm ?? row.calculated_km ?? null,
      formedAt:
        (row.FormedAt || row.formedAt || row.formed_at || null) &&
        String(row.FormedAt || row.formedAt || row.formed_at),
    }));
    return normalized;
  } catch (e: any) {
    const msg = e?.message || 'Ошибка загрузки заявок';
    return rejectWithValue(msg);
  }
});

const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchRequests.fulfilled,
        (state, action: PayloadAction<RequestRow[]>) => {
          state.loading = false;
          state.items = action.payload;
        }
      )
      .addCase(fetchRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Ошибка загрузки заявок';
        state.items = [];
      });
  },
});

export default requestsSlice.reducer;







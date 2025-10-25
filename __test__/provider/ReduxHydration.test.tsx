import React from 'react';
import { render, waitFor } from '@testing-library/react';
import * as reduxHook from '@/hooks/redux';
import * as albumSlice from '@/store/features/albumSlice';
import ReduxHydrator from '@/provider/ReduxHydrator';
import { Entry } from '@/lib/types';

// Mock the hooks and slice used by the component
jest.mock('@/hooks/redux', () => ({
  useAppDispatch: jest.fn(),
}));

jest.mock('@/store/features/albumSlice', () => ({
  // return a recognizable action object so the test can assert on the payload
  setAlbums: jest.fn((payload: unknown) => ({ type: 'albums/setAlbums', payload })),
}));

describe('ReduxHydrator', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // make useAppDispatch return our mockDispatch
    (reduxHook.useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  it('dispatches setAlbums when entries are provided', async () => {
    const entries = [{ id: '1', title: 'Song 1' }];

    render(<ReduxHydrator entries={entries as unknown as Entry[]} />);

    // waitFor ensures the effect has a chance to run (useEffect on mount)
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      // setAlbums should be called with the entries array
      expect(albumSlice.setAlbums).toHaveBeenCalledWith(entries);
      // And dispatch should receive the action returned by setAlbums mock
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'albums/setAlbums', payload: entries }));
    });
  });

  it('does not dispatch when entries is empty', async () => {
    render(<ReduxHydrator entries={[]} />);

    await waitFor(() => {
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(albumSlice.setAlbums).not.toHaveBeenCalled();
    });
  });
});
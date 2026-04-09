"use client";

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { fetchSchedulerSettings, updateSchedulerSetting as updateThunk } from '@/lib/features/scheduler/schedulerSlice';
import { useCallback } from 'react';

export function useSchedulerStore() {
  const dispatch = useDispatch<AppDispatch>();
  const { settings, isLoading, error } = useSelector((state: RootState) => state.scheduler);

  const fetchSettings = useCallback(() => {
    dispatch(fetchSchedulerSettings());
  }, [dispatch]);

  const updateSetting = useCallback((sno: number, payload: any) => {
    return dispatch(updateThunk({ sno, payload })).unwrap();
  }, [dispatch]);

  return {
    settings,
    isLoading,
    error,
    fetchSettings,
    updateSetting
  };
}

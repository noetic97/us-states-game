import { useState, useEffect, useCallback } from "react";
import {
  gameStorage,
  GameSettings,
  ModeProgress,
} from "../storage/GameStorage";
import { GameMode } from "../types/game";

interface StorageState {
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
}

export function useGameStorage() {
  const [state, setState] = useState<StorageState>({
    isInitialized: false,
    isLoading: true,
    error: null,
  });

  // Initialize storage when hook is first used
  useEffect(() => {
    const initializeStorage = async () => {
      try {
        await gameStorage.initialize();
        setState((prev) => ({
          ...prev,
          isInitialized: true,
          isLoading: false,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isInitialized: false,
          isLoading: false,
          error: error as Error,
        }));
      }
    };

    initializeStorage();
  }, []);

  // Progress Management
  const saveProgress = useCallback(
    async (progress: Omit<ModeProgress, "lastPlayed">) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        await gameStorage.saveProgressForMode({
          ...progress,
          lastPlayed: Date.now(),
        });
      } catch (error) {
        setState((prev) => ({ ...prev, error: error as Error }));
        throw error;
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  const getProgress = useCallback(async (mode: GameMode) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const progress = await gameStorage.getProgressForMode(mode);
      return progress;
    } catch (error) {
      setState((prev) => ({ ...prev, error: error as Error }));
      throw error;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Settings Management
  const saveSettings = useCallback(async (settings: GameSettings) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await gameStorage.saveSettings(settings);
    } catch (error) {
      setState((prev) => ({ ...prev, error: error as Error }));
      throw error;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const getSettings = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const settings = await gameStorage.getSettings();
      return settings;
    } catch (error) {
      setState((prev) => ({ ...prev, error: error as Error }));
      throw error;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Utility functions
  const clearAllData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await gameStorage.clearAllData();
    } catch (error) {
      setState((prev) => ({ ...prev, error: error as Error }));
      throw error;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Helper function to get default settings
  const getDefaultSettings = useCallback(
    (): GameSettings => ({
      soundEnabled: false,
      darkMode: false,
      lastGameMode: "easy",
      timerPreferences: {
        easy: "none",
        hard: "none",
      },
    }),
    []
  );

  // Progress utilities
  const getCompletionPercentage = useCallback(async (mode: GameMode) => {
    const progress = await getProgress(mode);
    if (!progress) return 0;
    return (progress.completedStates.length / 50) * 100; // 50 states total
  }, []);

  return {
    // State
    isInitialized: state.isInitialized,
    isLoading: state.isLoading,
    error: state.error,

    // Core operations
    saveProgress,
    getProgress,
    saveSettings,
    getSettings,

    // Utilities
    clearAllData,
    getDefaultSettings,
    getCompletionPercentage,

    // Reset state
    resetError: useCallback(() => {
      setState((prev) => ({ ...prev, error: null }));
    }, []),
  };
}

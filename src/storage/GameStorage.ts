import { TimerMode, GameMode } from "../components/game/types/game";

// Type definitions
export interface GameSettings {
  soundEnabled: boolean;
  darkMode: boolean;
  lastGameMode: GameMode;
  timerPreferences: {
    easy: TimerMode;
    hard: TimerMode;
  };
}

export interface ModeProgress {
  mode: GameMode;
  completedStates: string[];
  lastPlayed: number;
  timerMode: TimerMode;
  timeRemaining?: number;
}

// Database configuration
const DB_CONFIG = {
  name: "USStatesGame",
  version: 1,
  stores: {
    progress: "progress",
    settings: "settings",
    highScores: "highScores",
  },
} as const;

// Helper functions
const createStores = (db: IDBDatabase) => {
  // Progress store
  const progressStore = db.createObjectStore(DB_CONFIG.stores.progress, {
    keyPath: "mode",
  });
  progressStore.createIndex("byLastPlayed", "lastPlayed");

  // Settings store
  db.createObjectStore(DB_CONFIG.stores.settings, {
    keyPath: "id",
  });

  // High scores store
  const scoresStore = db.createObjectStore(DB_CONFIG.stores.highScores, {
    keyPath: "timestamp",
  });
  scoresStore.createIndex("byMode", "mode");
  scoresStore.createIndex("byScore", "score");
};

// Generic database operation helpers
const createTransaction = (
  db: IDBDatabase,
  storeName: string,
  mode: IDBTransactionMode
) => {
  const transaction = db.transaction([storeName], mode);
  const store = transaction.objectStore(storeName);
  return { transaction, store };
};

const handleRequest = <T>(request: IDBRequest<T>): Promise<T> => {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Main storage implementation
const createGameStorage = () => {
  let db: IDBDatabase | null = null;

  const initialize = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

      request.onerror = () => reject(new Error("Failed to open database"));
      request.onsuccess = (event) => {
        db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };
      request.onupgradeneeded = (event) => {
        const database = (event.target as IDBOpenDBRequest).result;
        createStores(database);
      };
    });
  };

  const ensureInitialized = () => {
    if (!db) throw new Error("Database not initialized");
  };

  // Progress operations
  const saveProgressForMode = async (progress: ModeProgress): Promise<void> => {
    ensureInitialized();
    const { store } = createTransaction(
      db!,
      DB_CONFIG.stores.progress,
      "readwrite"
    );
    const progressWithTimestamp = {
      ...progress,
      lastPlayed: Date.now(),
    };
    store.put(progressWithTimestamp);
  };

  const getProgressForMode = async (
    mode: GameMode
  ): Promise<ModeProgress | null> => {
    ensureInitialized();
    const { store } = createTransaction(
      db!,
      DB_CONFIG.stores.progress,
      "readonly"
    );
    return handleRequest(store.get(mode));
  };

  // Settings operations
  const saveSettings = async (settings: GameSettings): Promise<void> => {
    ensureInitialized();
    const { store } = createTransaction(
      db!,
      DB_CONFIG.stores.settings,
      "readwrite"
    );
    store.put({ ...settings, id: "userSettings" });
  };

  const getSettings = async (): Promise<GameSettings | null> => {
    ensureInitialized();
    const { store } = createTransaction(
      db!,
      DB_CONFIG.stores.settings,
      "readonly"
    );
    return handleRequest(store.get("userSettings"));
  };

  // Utility operations
  const clearAllData = async (): Promise<void> => {
    ensureInitialized();
    const storeNames = Object.values(DB_CONFIG.stores);
    await Promise.all(
      storeNames.map((storeName) => {
        const { store } = createTransaction(db!, storeName, "readwrite");
        return handleRequest(store.clear());
      })
    );
  };

  const deleteDatabase = async (): Promise<void> => {
    if (db) {
      db.close();
      db = null;
    }
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(DB_CONFIG.name);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error("Failed to delete database"));
    });
  };

  return {
    initialize,
    saveProgressForMode,
    getProgressForMode,
    saveSettings,
    getSettings,
    clearAllData,
    deleteDatabase,
  };
};

// Export a singleton instance
export const gameStorage = createGameStorage();

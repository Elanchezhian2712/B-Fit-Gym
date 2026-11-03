"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CategorySlug,
  DailyTracker,
  ExerciseLog,
  SetLog,
  WeightEntry,
  WorkoutSessionLog,
} from "@/lib/types";
import { exercises } from "@/lib/data/exercises";
import { applyWorkoutOrder, getExercisesByCategory, getSetReps, getWorkoutKey } from "@/lib/data/exercises";
import { getTodaySchedule, getWorkoutLimit, getWorkoutVariant } from "@/lib/data/schedule";
import { parseWarmup } from "@/lib/utils";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function emptyTracker(date: string): DailyTracker {
  return {
    date,
    gymCompleted: false,
    breakfastCompleted: false,
    lunchCompleted: false,
    postWorkoutCompleted: false,
    dinnerCompleted: false,
    waterLiters: 0,
  };
}

interface ActiveSession {
  id: string;
  category: CategorySlug;
  startedAt: string;
  exerciseIds: string[];
  currentExerciseIndex: number;
  logs: Record<string, ExerciseLog>;
}

interface FitnessState {
  startingWeight: number;
  currentWeight: number;
  goalWeight: number;
  weightEntries: WeightEntry[];
  workoutSessions: WorkoutSessionLog[];
  dailyTrackers: Record<string, DailyTracker>;
  mealCompletions: Record<string, Record<string, boolean>>;
  activeSession: ActiveSession | null;
  restOverrides: Record<string, boolean>;
  postponedCategories: Record<string, CategorySlug[]>;
  // User-arranged exercise sequence per workout (see getWorkoutKey). The library order never changes.
  workoutOrders: Record<string, string[]>;

  addWeightEntry: (weight: number, date?: string) => void;
  setGoalWeight: (weight: number) => void;

  startSession: (category: CategorySlug) => void;
  updateSet: (exerciseId: string, setIndex: number, patch: Partial<SetLog>) => void;
  markExerciseComplete: (exerciseId: string) => void;
  goToNextExercise: () => void;
  goToExercise: (index: number) => void;
  completeSession: () => WorkoutSessionLog | null;
  cancelSession: () => void;
  takeRestToday: () => void;

  setWorkoutOrder: (key: string, category: CategorySlug, exerciseIds: string[]) => void;
  resetWorkoutOrder: (key: string) => void;

  getTracker: (date: string) => DailyTracker;
  toggleTrackerFlag: (
    date: string,
    key: "gymCompleted" | "breakfastCompleted" | "lunchCompleted" | "postWorkoutCompleted" | "dinnerCompleted"
  ) => void;
  setWaterLiters: (date: string, liters: number) => void;
  toggleMealCompleted: (date: string, mealId: string) => void;

  getStreak: () => number;
  getLastWeightForExercise: (exerciseId: string) => SetLog[] | null;
}

function buildInitialLogs(exerciseIds: string[]): Record<string, ExerciseLog> {
  const logs: Record<string, ExerciseLog> = {};
  for (const id of exerciseIds) {
    const ex = exercises.find((e) => e.id === id);
    const workingSetCount = ex?.sets ?? 3;
    const workingSets: SetLog[] = Array.from({ length: workingSetCount }, (_, i) => ({
      setNumber: i + 1,
      weight: ex?.workingWeight ?? "",
      reps: ex ? getSetReps(ex, i) : "",
      completed: false,
    }));

    const sets: SetLog[] = ex?.warmup
      ? [
          {
            setNumber: 0,
            weight: parseWarmup(ex.warmup).weight,
            reps: parseWarmup(ex.warmup).reps,
            completed: false,
          },
          ...workingSets,
        ]
      : workingSets;

    logs[id] = {
      exerciseId: id,
      completed: false,
      sets,
    };
  }
  return logs;
}

export const useFitnessStore = create<FitnessState>()(
  persist(
    (set, get) => ({
      startingWeight: 91.05,
      currentWeight: 91.5,
      goalWeight: 80,
      weightEntries: [
        { date: todayISO(), weight: 91.05 },
        { date: "2026-10-13", weight: 91.5 },
        { date: "2026-11-02", weight: 91.5 },
        { date: "2026-11-21", weight: 91.5 },
      ],
      workoutSessions: [],
      dailyTrackers: {},
      mealCompletions: {},
      activeSession: null,
      restOverrides: {},
      postponedCategories: {},
      workoutOrders: {},

      addWeightEntry: (weight, date) => {
        const d = date ?? todayISO();
        set((state) => ({
          currentWeight: weight,
          weightEntries: [
            ...state.weightEntries.filter((w) => w.date !== d),
            { date: d, weight },
          ].sort((a, b) => a.date.localeCompare(b.date)),
        }));
      },

      setGoalWeight: (weight) => set({ goalWeight: weight }),

      startSession: (category) => {
        const todayCategories = getTodaySchedule().categories;
        const light = getWorkoutVariant(category, todayCategories);
        const exIds = applyWorkoutOrder(
          getExercisesByCategory(category, light, getWorkoutLimit(category, todayCategories)),
          get().workoutOrders[getWorkoutKey(category, light)]
        ).map((e) => e.id);
        set({
          activeSession: {
            id: `session-${Date.now()}`,
            category,
            startedAt: new Date().toISOString(),
            exerciseIds: exIds,
            currentExerciseIndex: 0,
            logs: buildInitialLogs(exIds),
          },
        });
      },

      updateSet: (exerciseId, setIndex, patch) => {
        set((state) => {
          if (!state.activeSession) return state;
          const log = state.activeSession.logs[exerciseId];
          if (!log) return state;
          const newSets = log.sets.map((s, i) => (i === setIndex ? { ...s, ...patch } : s));
          return {
            activeSession: {
              ...state.activeSession,
              logs: {
                ...state.activeSession.logs,
                [exerciseId]: { ...log, sets: newSets },
              },
            },
          };
        });
      },

      markExerciseComplete: (exerciseId) => {
        set((state) => {
          if (!state.activeSession) return state;
          const log = state.activeSession.logs[exerciseId];
          if (!log) return state;
          return {
            activeSession: {
              ...state.activeSession,
              logs: {
                ...state.activeSession.logs,
                [exerciseId]: { ...log, completed: true },
              },
            },
          };
        });
      },

      goToNextExercise: () => {
        set((state) => {
          if (!state.activeSession) return state;
          const next = Math.min(
            state.activeSession.currentExerciseIndex + 1,
            state.activeSession.exerciseIds.length - 1
          );
          return { activeSession: { ...state.activeSession, currentExerciseIndex: next } };
        });
      },

      goToExercise: (index) => {
        set((state) => {
          if (!state.activeSession) return state;
          return { activeSession: { ...state.activeSession, currentExerciseIndex: index } };
        });
      },

      completeSession: () => {
        const state = get();
        if (!state.activeSession) return null;
        const durationSeconds = Math.max(
          60,
          Math.round((Date.now() - new Date(state.activeSession.startedAt).getTime()) / 1000)
        );
        const log: WorkoutSessionLog = {
          id: state.activeSession.id,
          category: state.activeSession.category,
          date: todayISO(),
          exerciseLogs: Object.values(state.activeSession.logs),
          durationSeconds,
          completed: true,
        };
        set((s) => {
          const date = todayISO();
          const tracker = s.dailyTrackers[date] ?? emptyTracker(date);
          return {
            workoutSessions: [...s.workoutSessions, log],
            activeSession: null,
            dailyTrackers: {
              ...s.dailyTrackers,
              [date]: { ...tracker, gymCompleted: true },
            },
          };
        });
        return log;
      },

      cancelSession: () => set({ activeSession: null }),

      takeRestToday: () => {
        const today = todayISO();
        const tomorrow = tomorrowISO();
        set((state) => {
          if (state.restOverrides[today]) return state;
          const base = getTodaySchedule();
          const alreadyCarriedToday = state.postponedCategories[today] ?? [];
          const toMove = Array.from(new Set([...base.categories, ...alreadyCarriedToday]));
          const existingTomorrow = state.postponedCategories[tomorrow] ?? [];
          const mergedTomorrow = Array.from(new Set([...existingTomorrow, ...toMove]));
          return {
            restOverrides: { ...state.restOverrides, [today]: true },
            postponedCategories: { ...state.postponedCategories, [tomorrow]: mergedTomorrow },
          };
        });
      },

      setWorkoutOrder: (key, category, exerciseIds) => {
        set((state) => {
          const session = state.activeSession;
          // Re-sequence an in-progress session of the same workout, keeping the current exercise selected.
          const sameWorkout =
            session &&
            session.category === category &&
            session.exerciseIds.length === exerciseIds.length &&
            exerciseIds.every((id) => session.exerciseIds.includes(id));
          return {
            workoutOrders: { ...state.workoutOrders, [key]: exerciseIds },
            activeSession: sameWorkout
              ? {
                  ...session,
                  exerciseIds,
                  currentExerciseIndex: exerciseIds.indexOf(session.exerciseIds[session.currentExerciseIndex]),
                }
              : session,
          };
        });
      },

      resetWorkoutOrder: (key) => {
        set((state) => {
          const rest = { ...state.workoutOrders };
          delete rest[key];
          return { workoutOrders: rest };
        });
      },

      getTracker: (date) => {
        return get().dailyTrackers[date] ?? emptyTracker(date);
      },

      toggleTrackerFlag: (date, key) => {
        set((state) => {
          const tracker = state.dailyTrackers[date] ?? emptyTracker(date);
          return {
            dailyTrackers: {
              ...state.dailyTrackers,
              [date]: { ...tracker, [key]: !tracker[key] },
            },
          };
        });
      },

      setWaterLiters: (date, liters) => {
        set((state) => {
          const tracker = state.dailyTrackers[date] ?? emptyTracker(date);
          return {
            dailyTrackers: {
              ...state.dailyTrackers,
              [date]: { ...tracker, waterLiters: liters },
            },
          };
        });
      },

      toggleMealCompleted: (date, mealId) => {
        set((state) => {
          const dayMeals = state.mealCompletions[date] ?? {};
          return {
            mealCompletions: {
              ...state.mealCompletions,
              [date]: { ...dayMeals, [mealId]: !dayMeals[mealId] },
            },
          };
        });
      },

      getStreak: () => {
        const sessions = get().workoutSessions;
        if (sessions.length === 0) return 0;
        const dates = new Set(sessions.map((s) => s.date));
        let streak = 0;
        const cursor = new Date();
        for (;;) {
          const iso = cursor.toISOString().slice(0, 10);
          if (dates.has(iso)) {
            streak += 1;
            cursor.setDate(cursor.getDate() - 1);
          } else if (iso === todayISO()) {
            cursor.setDate(cursor.getDate() - 1);
          } else {
            break;
          }
        }
        return streak;
      },

      getLastWeightForExercise: (exerciseId) => {
        const sessions = get().workoutSessions;
        for (let i = sessions.length - 1; i >= 0; i--) {
          const log = sessions[i].exerciseLogs.find((e) => e.exerciseId === exerciseId);
          if (log && log.sets.some((s) => s.completed)) return log.sets;
        }
        return null;
      },
    }),
    {
      name: "my-fitness-journey-storage",
    }
  )
);

import type { defineStore } from 'pinia';

export type Store<T> = ReturnType<typeof defineStore<string, T>>;

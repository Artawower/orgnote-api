import { Nullable } from '../types/nullable';
import { LayoutSnapshot } from './pane';

export interface StoredLayoutSnapshot {
  id: string;
  createdAt: string;
  snapshot: LayoutSnapshot;
}

export interface LayoutSnapshotRepository {
  save(snapshot: LayoutSnapshot): Promise<void>;
  getLatest(): Promise<Nullable<StoredLayoutSnapshot>>;
  list(limit?: number): Promise<StoredLayoutSnapshot[]>;
  delete(id: string): Promise<void>;
  clear(): Promise<void>;
}

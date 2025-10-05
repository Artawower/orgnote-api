import { PanesSnapshot } from './pane';

export interface StoredPaneSnapshot {
  id: string;
  createdAt: string;
  snapshot: PanesSnapshot;
}

export interface PaneSnapshotRepository {
  save(snapshot: PanesSnapshot): Promise<void>;
  getLatest(): Promise<StoredPaneSnapshot | null>;
  list(limit?: number): Promise<StoredPaneSnapshot[]>;
  delete(id: string): Promise<void>;
  clear(): Promise<void>;
}

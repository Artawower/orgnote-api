export interface ClientUpdateInfo {
  version: string;
  changeLog: string;
  url: string;
}

export interface ClientUpdateRecord extends ClientUpdateInfo {
  fromVersion?: string;
  detectedAt: string;
  viewedAt?: string;
}

export type AssignmentType = 'EXCLUSIVE' | 'SHARED' | 'PENDING' | 'UNASSIGNED';

export interface GeoJSONBoundary {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: number[][][];
}

export interface TerritoryStatistics {
  activeCustomers: number;
  activeAgents: number;
  totalRevenue: number;
  totalMotorsRegistered: number;
  activeTechnicians: number;
}

export interface Territory {
  id: string;
  territoryId: string;
  state: string;
  district: string;
  mandals: string[];
  franchiseId?: string;
  franchiseIdRef?: string;
  franchiseName?: string;
  assignmentType: AssignmentType;
  boundaries?: GeoJSONBoundary;
  statistics: TerritoryStatistics;
  isActive: boolean;
  assignedAt?: string;
  assignedBy?: string;
  unassignedAt?: string;
  unassignedReason?: string;
  population?: number;
  areaInSqKm?: number;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TerritoryAssignmentRequest {
  territoryId: string;
  franchiseId: string;
  franchiseIdRef: string;
  assignmentType: AssignmentType;
  notes?: string;
}

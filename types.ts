export type AppState = 'SCATTERED' | 'FORMING' | 'INPUT' | 'TICKET';

export interface ParticleData {
  id: number;
  scatterPosition: [number, number, number];
  treePosition: [number, number, number];
  color: string;
  scale: number;
  rotationSpeed: [number, number, number];
  geometryType: 'tetra' | 'cube' | 'dodeca';
}

export interface TicketData {
  name: string;
}

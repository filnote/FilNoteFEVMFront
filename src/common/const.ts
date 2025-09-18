import { filecoinCalibration } from '@reown/appkit/networks';

export const Network = filecoinCalibration;

export const NoteStatus = {
  0: 'INIT',
  1: 'INVALID',
  2: 'PENDING',
  3: 'CLOSED',
  4: 'ACTIVE',
  5: 'COMPLETED',
  6: 'DEFAULTED',
  7: 'STOP',
} as const;
export type NoteStatusKey = keyof typeof NoteStatus;

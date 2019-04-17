import { PARITY } from '../constants/parity';

const accepted: PARITY[] = [
  PARITY.none,
  PARITY.even,
  PARITY.mark,
  PARITY.odd,
  PARITY.space
];

export function ensureValidParity(v: PARITY, defaultValue) {
  return accepted.indexOf(v) >= 0 ? v : defaultValue;
}

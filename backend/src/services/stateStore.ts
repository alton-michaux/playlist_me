// In-memory store for OAuth pending states.
// Wiped on server restart — user must restart the login flow if that happens.
const pendingStates = new Map<string, boolean>();

export function addState(state: string): void {
  pendingStates.set(state, true);
}

/** Returns true and removes the state if it exists; false otherwise. */
export function consumeState(state: string): boolean {
  if (!pendingStates.has(state)) return false;
  pendingStates.delete(state);
  return true;
}

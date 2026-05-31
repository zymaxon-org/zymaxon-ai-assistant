## Scanner Retry & Auto-Reinit for TrustTag

### Goal
Make the QR scanner on `/trusttag/scan` resilient to camera failures by surfacing a friendly retry UI and automatically attempting re-initialization up to 3 times.

### Current Behavior
- `Html5Qrcode` starts inside `useEffect` when `mode === 'camera'`.
- Errors during `start()` are swallowed (`catch {}`).
- No user feedback when the camera fails or the scanner stops unexpectedly.

### Planned Changes

#### 1. State Additions (ScanPage.tsx)
- `scanError: string | null` — stores the last human-readable error message.
- `retryCount: number` — tracks auto-retry attempts (cap at 3).
- `retryKey: number` — incremented to force `useEffect` re-run on manual retry.
- `isRetrying: boolean` — shows a spinner/label during auto-retry.

#### 2. Scanner Start Logic
- Catch `start()` failures and extract a friendly message:
  - Permission denied: "Camera access denied. Please allow camera permissions and try again."
  - No camera found: "No camera detected on this device."
  - Generic / unknown: "Could not start the scanner."
- Set `scanError` on failure.
- If `retryCount < 3`, schedule an auto-retry after 2.5 seconds, increment `retryCount`, and clear `scanError` before retrying.
- On success, reset `retryCount` and `scanError`.

#### 3. UI When Scanner Fails
Inside the `#tt-scanner` container (replacing the black placeholder), render:
- An icon (`AlertCircle` or `CameraOff`).
- The friendly error message.
- A primary **"Try Again"** button that increments `retryKey` and resets `retryCount`.
- A subtle "Enter token manually" link that switches to manual mode.
- During auto-retry: show a small spinner + "Retrying in Xs..." text.

#### 4. Manual Retry Flow
- Clicking **"Try Again"** clears the existing `Html5Qrcode` instance, resets `retryCount`, increments `retryKey`, and lets `useEffect` re-run.
- If the user switches modes (`camera` -> `manual` -> `camera`), `retryCount` also resets.

#### 5. Cleanup Safety
- Keep the existing guard `if (ref.current?.getState() === 2)` before calling `stop()`.
- Ensure the old instance is fully cleaned up before creating a new one on retry.

### Files Changed
- `src/components/trusttag/verify/ScanPage.tsx`

### Out of Scope
- Changing the `html5-qrcode` library.
- Adding backend logging for scan failures.
- Altering the manual entry flow.

### Test Checklist
- [ ] Block camera permission → see error message + Try Again button.
- [ ] Click Try Again after allowing permission → scanner starts.
- [ ] Switch to manual and back → retry count resets, scanner re-initializes.
- [ ] Successful scan still navigates correctly.
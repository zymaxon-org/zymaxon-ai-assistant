import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { ArrowLeft, Camera, Type, CameraOff, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const MAX_AUTO_RETRIES = 3;
const AUTO_RETRY_DELAY_MS = 2500;

function friendlyError(err: unknown): string {
  const msg = (err instanceof Error ? err.message : String(err ?? '')).toLowerCase();
  if (msg.includes('permission') || msg.includes('denied') || msg.includes('notallowed')) {
    return 'Camera access denied. Please allow camera permissions and try again.';
  }
  if (msg.includes('notfound') || msg.includes('no camera') || msg.includes('devices')) {
    return 'No camera detected on this device.';
  }
  if (msg.includes('inuse') || msg.includes('notreadable')) {
    return 'Camera is being used by another app. Close it and try again.';
  }
  return 'Could not start the scanner. Please try again.';
}

export default function ScanPage() {
  const [mode, setMode] = useState<'camera' | 'manual'>('camera');
  const [manual, setManual] = useState('');
  const [scanError, setScanError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [retryKey, setRetryKey] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const ref = useRef<Html5Qrcode | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    if (mode !== 'camera') return;
    let stopped = false;
    let retryTimer: number | undefined;

    const safeStop = async () => {
      try {
        if (ref.current?.getState() === 2) await ref.current.stop();
      } catch {}
      try {
        ref.current?.clear();
      } catch {}
      ref.current = null;
    };

    const start = async () => {
      setIsRetrying(false);
      try {
        await safeStop();
        ref.current = new Html5Qrcode('tt-scanner');
        await ref.current.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: 250 },
          (text) => {
            if (stopped) return;
            stopped = true;
            const m = text.match(/\/trusttag\/verify\/([A-Za-z0-9_-]+)/);
            const token = m ? m[1] : text;
            safeStop().then(() => nav(`/trusttag/verify/${token}`));
          },
          () => {},
        );
        setScanError(null);
        setRetryCount(0);
      } catch (err) {
        if (stopped) return;
        const message = friendlyError(err);
        setScanError(message);
        if (retryCount < MAX_AUTO_RETRIES) {
          setIsRetrying(true);
          retryTimer = window.setTimeout(() => {
            if (stopped) return;
            setRetryCount((c) => c + 1);
            setRetryKey((k) => k + 1);
          }, AUTO_RETRY_DELAY_MS);
        }
      }
    };

    start();
    return () => {
      stopped = true;
      if (retryTimer) clearTimeout(retryTimer);
      safeStop();
    };
  }, [mode, nav, retryKey]);

  const handleManualRetry = () => {
    setScanError(null);
    setRetryCount(0);
    setIsRetrying(false);
    setRetryKey((k) => k + 1);
  };

  const switchMode = (next: 'camera' | 'manual') => {
    setMode(next);
    setScanError(null);
    setRetryCount(0);
    setIsRetrying(false);
  };

  const goManual = () => {
    if (!manual.trim()) return;
    const m = manual.match(/\/trusttag\/verify\/([A-Za-z0-9_-]+)/);
    nav(`/trusttag/verify/${m ? m[1] : manual.trim()}`);
  };

  return (
    <div className="trusttag min-h-screen bg-tt-bg text-tt-fg">
      <div className="p-4">
        <Link to="/trusttag" className="inline-flex items-center gap-2 text-tt-muted hover:text-tt-fg text-sm">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </div>
      <div className="max-w-md mx-auto px-4 pb-12">
        <h1 className="font-display font-bold text-2xl mb-2">Scan a TrustTag QR</h1>
        <p className="text-tt-muted text-sm mb-4">Point your camera at the QR code to verify the item.</p>
        <div className="flex gap-2 mb-4">
          <Button variant={mode === 'camera' ? 'default' : 'outline'} className={mode === 'camera' ? 'bg-tt-primary text-white' : 'border-tt-border'} onClick={() => switchMode('camera')}><Camera className="h-4 w-4" /> Camera</Button>
          <Button variant={mode === 'manual' ? 'default' : 'outline'} className={mode === 'manual' ? 'bg-tt-primary text-white' : 'border-tt-border'} onClick={() => switchMode('manual')}><Type className="h-4 w-4" /> Enter token</Button>
        </div>
        {mode === 'camera' ? (
          <div className="relative">
            <div id="tt-scanner" className="rounded-2xl overflow-hidden bg-black aspect-square" />
            {scanError && (
              <div className="absolute inset-0 rounded-2xl bg-black/85 backdrop-blur-sm flex items-center justify-center p-6">
                <div className="text-center max-w-xs">
                  <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-tt-primary/15 flex items-center justify-center">
                    <CameraOff className="h-6 w-6 text-tt-primary" />
                  </div>
                  <p className="text-white text-sm mb-4">{scanError}</p>
                  {isRetrying ? (
                    <div className="inline-flex items-center gap-2 text-tt-muted text-sm">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Retrying… (attempt {retryCount + 1} of {MAX_AUTO_RETRIES})
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button onClick={handleManualRetry} className="w-full bg-tt-primary hover:bg-tt-primary/90 text-white">
                        <RefreshCw className="h-4 w-4" /> Try again
                      </Button>
                      <button
                        onClick={() => switchMode('manual')}
                        className="text-tt-muted hover:text-white text-xs underline"
                      >
                        Enter token manually instead
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="tt-glass rounded-2xl p-4 space-y-3">
            <Input value={manual} onChange={(e) => setManual(e.target.value)} placeholder="Paste verification URL or token" />
            <Button onClick={goManual} className="w-full bg-tt-primary hover:bg-tt-primary/90 text-white">Verify</Button>
          </div>
        )}
      </div>
    </div>
  );
}

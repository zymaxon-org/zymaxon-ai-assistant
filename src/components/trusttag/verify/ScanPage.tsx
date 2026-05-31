import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { ArrowLeft, Camera, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ScanPage() {
  const [mode, setMode] = useState<'camera' | 'manual'>('camera');
  const [manual, setManual] = useState('');
  const ref = useRef<Html5Qrcode | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    if (mode !== 'camera') return;
    let stopped = false;
    const start = async () => {
      try {
        ref.current = new Html5Qrcode('tt-scanner');
        await ref.current.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: 250 },
          (text) => {
            if (stopped) return;
            stopped = true;
            const m = text.match(/\/trusttag\/verify\/([A-Za-z0-9_-]+)/);
            const token = m ? m[1] : text;
            const safeStop = async () => {
              try {
                if (ref.current?.getState() === 2) await ref.current.stop();
              } catch {}
            };
            safeStop().then(() => nav(`/trusttag/verify/${token}`));
          },
          () => {},
        );
      } catch {}
    };
    start();
    return () => {
      stopped = true;
      try {
        if (ref.current?.getState() === 2) ref.current.stop().catch(() => {});
      } catch {}
    };
  }, [mode, nav]);

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
          <Button variant={mode === 'camera' ? 'default' : 'outline'} className={mode === 'camera' ? 'bg-tt-primary text-white' : 'border-tt-border'} onClick={() => setMode('camera')}><Camera className="h-4 w-4" /> Camera</Button>
          <Button variant={mode === 'manual' ? 'default' : 'outline'} className={mode === 'manual' ? 'bg-tt-primary text-white' : 'border-tt-border'} onClick={() => setMode('manual')}><Type className="h-4 w-4" /> Enter token</Button>
        </div>
        {mode === 'camera' ? (
          <div id="tt-scanner" className="rounded-2xl overflow-hidden bg-black aspect-square" />
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

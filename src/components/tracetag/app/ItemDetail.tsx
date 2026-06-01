import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, ArrowLeftRight, Download, QrCode, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/tracetag/shared/Layout';
import { useAuth, useDocTitle } from '@/components/tracetag/shared/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { StatusBadge } from './Dashboard';
import { downloadCertificate, downloadQR } from '@/components/tracetag/shared/qr';
import { toast } from '@/hooks/use-toast';

export default function ItemDetail() {
  useDocTitle('Item details — TraceTag');
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    supabase.from('tt_items').select('*').eq('id', id).maybeSingle().then(({ data }) => setItem(data));
  }, [id]);

  if (!item) return <AppLayout><div className="text-slate-500">Loading…</div></AppLayout>;

  const remove = async () => {
    if (!confirm('Delete this item permanently?')) return;
    await supabase.from('tt_items').delete().eq('id', item.id);
    toast({ title: 'Item deleted' });
    nav('/tracetag/app/items');
  };

  return (
    <AppLayout>
      <Link to="/tracetag/app/items" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-tt-navy mb-3">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <div className="bg-white border border-tt-border rounded-2xl p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h1 className="text-2xl font-bold text-tt-navy">{item.item_name}</h1>
            <div className="text-xs font-mono text-slate-500 mt-1">{item.vivesa_asset_id}</div>
          </div>
          <StatusBadge status={item.status} />
        </div>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm border-t pt-4">
          {Object.entries({
            Category: item.item_category, Brand: item.brand, Model: item.model, Color: item.color,
            'Serial #': item.serial_number, 'IMEI 1': item.imei_1, 'IMEI 2': item.imei_2,
            VIN: item.vin, 'Plate #': item.plate_number, 'Engine #': item.engine_number,
            'MAC': item.mac_address, 'Purchase date': item.purchase_date,
            'Purchase price': item.purchase_price ? `₦${Number(item.purchase_price).toLocaleString()}` : null,
            Location: item.purchase_location,
          }).filter(([_, v]) => v).map(([k, v]) => (
            <div key={k} className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">{k}</span><span className="font-medium">{v as string}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          {item.status === 'clean' && <Button asChild className="bg-tt-red text-white"><Link to={`/tracetag/app/items/${item.id}/stolen`}><AlertTriangle className="h-4 w-4 mr-1" />Flag as stolen</Link></Button>}
          <Button asChild variant="outline"><Link to={`/tracetag/app/items/${item.id}/transfer`}><ArrowLeftRight className="h-4 w-4 mr-1" />Transfer</Link></Button>
          <Button variant="outline" onClick={() => downloadCertificate({
            ownerName: user?.email ?? 'Owner', assetId: item.vivesa_asset_id, itemName: item.item_name,
            brand: item.brand, model: item.model, serial: item.serial_number,
            identifier: item.imei_1 ?? item.plate_number ?? item.vin ?? item.serial_number,
            registeredAt: item.created_at,
          })}><Download className="h-4 w-4 mr-1" />Certificate</Button>
          <Button variant="outline" onClick={() => downloadQR(item.vivesa_asset_id)}><QrCode className="h-4 w-4 mr-1" />QR code</Button>
          <Button variant="ghost" className="text-tt-red ml-auto" onClick={remove}><Trash className="h-4 w-4 mr-1" />Delete</Button>
        </div>
      </div>
    </AppLayout>
  );
}

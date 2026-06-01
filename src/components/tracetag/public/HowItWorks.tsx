import { StaticPage } from './StaticPage';
export default function HowItWorks() {
  return <StaticPage title="How TraceTag works">
    <ol className="space-y-4">
      <li><strong>1. Register your item.</strong> Add identifiers like IMEI, plate number, or serial. We generate a unique TraceTag Asset ID and printable QR code.</li>
      <li><strong>2. Flag if stolen.</strong> File a stolen report in seconds. Your item is flagged in our national database immediately.</li>
      <li><strong>3. Buyers verify.</strong> Anyone with the IMEI, serial, plate or TraceTag ID can verify status — free, no account needed.</li>
      <li><strong>4. Tips & recovery.</strong> When a stolen item is searched, you're notified. Buyers can submit anonymous tips on where they saw it.</li>
    </ol>
  </StaticPage>;
}

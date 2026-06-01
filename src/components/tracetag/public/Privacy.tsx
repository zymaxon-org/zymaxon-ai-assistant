import { StaticPage } from './StaticPage';
export default function Privacy() {
  return <StaticPage title="Privacy Policy">
    <p>We collect only what's needed to operate the registry: contact details, item identifiers, and ownership history. Public search returns only minimal item information (status, category, owner's first name + last initial).</p>
    <p>Photos, addresses, and full identifiers are never exposed publicly. Searches are logged for fraud prevention and to alert owners of stolen-item lookups.</p>
    <p>We never sell personal data. Law-enforcement requests require a verifiable case reference.</p>
  </StaticPage>;
}

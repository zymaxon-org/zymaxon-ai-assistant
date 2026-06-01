import { StaticPage } from './StaticPage';
export default function Contact() {
  return <StaticPage title="Contact us">
    <p>Email: <a href="mailto:hello@tracetag.ng" className="text-tt-navy underline">hello@tracetag.ng</a></p>
    <p>For dealer partnerships: <a href="mailto:business@tracetag.ng" className="text-tt-navy underline">business@tracetag.ng</a></p>
    <p>For law enforcement requests, please email with verifiable credentials.</p>
  </StaticPage>;
}

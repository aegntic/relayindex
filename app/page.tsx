import { configuredCheckoutUrl } from "../lib/checkout";
import RelayDashboard from "./relay-dashboard";
export default function Home(){ return <RelayDashboard checkoutUrl={configuredCheckoutUrl()}/> }

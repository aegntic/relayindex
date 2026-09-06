/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-img-element -- vinext's Next link/image shims currently trigger client hook failures; static local assets are precompressed and dimensioned. */
import type { Metadata } from "next";
import { configuredCheckoutUrl } from "../../lib/checkout";
import { capabilityAssuranceOffer as offer } from "../../lib/offer";
import styles from "./pilot.module.css";

export const metadata: Metadata = {
  title: "MCP Connection Decision Sprint | Relay Index",
  description: "An approval-ready evidence packet for one consequential MCP connection decision, delivered in five business days.",
};

const humanize = (value: string) => value.replaceAll("_", " ").replace(/^./, (letter) => letter.toUpperCase());

export default function PilotPage() {
  const checkoutUrl = configuredCheckoutUrl();
  const price = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: offer.pricing.currency,
    maximumFractionDigits: 0,
  }).format(offer.pricing.amount);

  return (
    <main className={styles.page}>
      <nav className={styles.nav} aria-label="Pilot navigation">
        <a className={styles.brand} href="/">
          <span>R/</span> RELAY INDEX
        </a>
        <div className={styles.navLinks}>
          <a href="/#graph">Capability graph</a>
          <a href={offer.paths.self}>JSON contract</a>
          {checkoutUrl ? <a className={styles.navAction} href={checkoutUrl} rel="noreferrer">Buy the sprint</a> : null}
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>PAID MCP DECISION SPRINT</p>
          <h1>Approve the route before the agent connects.</h1>
          <p className={styles.heroText}>We test one MCP workflow and return an evidence-backed allow, hold, reject, or insufficient-evidence decision.</p>
          <div className={styles.actions}>
            <a className={styles.primary} href={checkoutUrl ?? "#offer"} rel={checkoutUrl ? "noreferrer" : undefined}>
              {checkoutUrl ? "Buy the sprint" : "See the offer"}
            </a>
            <a className={styles.secondary} href={offer.paths.self}>Inspect contract</a>
          </div>
        </div>
        <div className={styles.heroImage}>
          <img
            src="/relay-switching-cabinet.webp"
            alt="Precision relay cabinet with aqua signal routes"
            width={1456}
            height={1092}
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </section>

      <section className={styles.marketProof} aria-labelledby="gap-heading">
        <div>
          <p className={styles.sectionLabel}>THE GAP WE FOUND</p>
          <h2 id="gap-heading">Discovery is not approval.</h2>
        </div>
        <div className={styles.marketEvidence}>
          <p>The official MCP Registry expects downstream systems to transform and curate registry data.</p>
          <a href="https://github.com/modelcontextprotocol/registry/discussions/11" rel="noreferrer">Official registry design discussion</a>
        </div>
        <div className={styles.marketEvidence}>
          <p>GitHub Agent Finder ranks resources but does not silently connect them.</p>
          <a href="https://github.blog/changelog/2026-06-17-agent-finder-for-github-copilot-now-available/" rel="noreferrer">GitHub Agent Finder launch</a>
        </div>
      </section>

      <section className={styles.packet} aria-labelledby="packet-heading">
        <div className={styles.packetImage}>
          <img
            src="/relay-evidence-dossier.webp"
            alt="Physical evidence dossier with technical measurement tools"
            width={1536}
            height={1024}
            loading="lazy"
          />
        </div>
        <div className={styles.packetCopy}>
          <h2 id="packet-heading">One workflow. One defensible call.</h2>
          <p>Bring the route you are considering, the job it must perform, and safe test inputs. Relay Index does the qualification work.</p>
          <div className={styles.decisionRail}>
            <div><span>Found</span><strong>Registry entry or candidate route</strong></div>
            <div><span>Checked</span><strong>Provenance, permissions, interface, failures</strong></div>
            <div><span>Returned</span><strong>Allow, hold, reject, or insufficient evidence</strong></div>
          </div>
        </div>
      </section>

      <section className={styles.offer} id="offer" aria-labelledby="offer-heading">
        <div className={styles.offerTop}>
          <div>
            <h2 id="offer-heading">A decision packet in five business days.</h2>
            <p>Delivery starts after valid inputs and authorized test access are confirmed.</p>
          </div>
          <div className={styles.price}>
            <span>FOUNDING PRICE</span>
            <strong>{price}</strong>
            <small>Final tax treatment is shown at checkout.</small>
          </div>
        </div>

        <div className={styles.offerBody}>
          <div className={styles.included}>
            <h3>What you receive</h3>
            <div className={styles.deliverables}>
              {offer.deliverables.map((item) => <p key={item}>{item}</p>)}
            </div>
          </div>
          <div className={styles.terms}>
            <dl>
              <div><dt>Scope</dt><dd>{offer.scope.workflowCount} workflow, up to {offer.scope.maximumCandidates} candidates</dd></div>
              <div><dt>Evidence</dt><dd>Minimum {offer.evidenceProtocol.minimumTrials} comparable trials where authorized</dd></div>
              <div><dt>Valid outcomes</dt><dd>{offer.decisionOutcomes.map(humanize).join(", ")}</dd></div>
              <div><dt>Boundary</dt><dd>No production execution or autonomous delegation</dd></div>
            </dl>
          </div>
        </div>

        <div className={styles.checkoutBand}>
          <div>
            <strong>{checkoutUrl ? "Checkout is open." : "One launch connection remains."}</strong>
            <p>{checkoutUrl ? "Stripe collects payment and the minimum details required to fulfil the sprint." : "Add a real Stripe Payment Link to open the paid route. The page fails closed until then."}</p>
          </div>
          {checkoutUrl ? (
            <a className={styles.primary} href={checkoutUrl} rel="noreferrer">Buy the sprint</a>
          ) : (
            <span className={styles.disabledAction} aria-disabled="true">Checkout not connected</span>
          )}
        </div>
      </section>

      <section className={styles.firewall} aria-label="Trust firewall">
        <strong>Customers buy testing effort and evidence.</strong>
        <p>Revenue, sponsorship, clicks, and provider payments never alter capability trust or evidence scores.</p>
      </section>

      <footer className={styles.footer}>
        <a className={styles.brand} href="/"><span>R/</span> RELAY INDEX</a>
        <p>Capability intelligence for consequential agent decisions.</p>
        <a href={offer.paths.self}>Machine-readable offer</a>
      </footer>
    </main>
  );
}

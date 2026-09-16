/* =========================================================
   WHT ELECTRICAL — page content
   All copy is the approved Tab 5 copy from the Build Pack.
   Layout follows Tab 3 (Home) and Tab 4 (Service Pillar,
   High-Intent Service and Standard Content templates).
   ========================================================= */
import {
    SITE, href, ic, btn, arrow, pageHero, sectionHead, bullets, slist, steps,
    related, callout, faqSection, ctaBand,
} from './layout.mjs';

const HOME = { key: 'home', label: 'Home' };
const ELECTRICAL = { key: 'electrical', label: 'Electrical' };

const img = (id, w) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${w > 1000 ? 65 : 70}`;
const HERO_IMG = img('1621905251189-08b45d6a269e', 1400);

/* ---------- Reusable approved copy ---------- */

/* Homepage "How it works" — reused on pillar pages that have no process copy of their own. */
const PROCESS_GENERAL = [
    ['Tell Us About the Problem', 'Explain what is happening, what service you need and where the property is located.'],
    ['Assessment', 'The relevant system, installation or project requirements are assessed.'],
    ['Recommended Solution', 'WHT explains what has been identified and what work is recommended.'],
    ['Approved Work', 'Once the work has been agreed, the repair, installation or maintenance is carried out.'],
    ['Testing &amp; Documentation', 'Completed work is checked and applicable documentation is provided where required.'],
];

/* Homepage problem-card and service-card copy, reused as cross-links on inner pages. */
const CARD = {
    electrical:  ['bolt', 'electrical', 'Electrical', 'From everyday electrical repairs and installations to DB boards, rewiring, fault finding, generator connections and COCs.', 'Explore Electrical'],
    solar:       ['solar', 'solar', 'Solar &amp; Backup Power', 'Solar installations, inverters, battery backup, hybrid systems and off-grid power solutions.', 'Explore Solar &amp; Backup Power'],
    plumbing:    ['droplet', 'plumbing', 'Plumbing', 'Leaks, burst pipes, geysers, kitchen and bathroom plumbing and general repairs.', 'Explore Plumbing'],
    maintenance: ['paint', 'maintenance', 'Property Maintenance', 'Painting, ceilings, drywall, tiling, flooring and general building maintenance.', 'Explore Property Maintenance'],
    fault:       ['bolt', 'fault', 'Power Keeps Tripping?', 'Recurring trips, earth leakage problems or another electrical fault?', 'Get Electrical Help'],
    coc:         ['doc', 'coc', 'Need an Electrical COC?', 'Need an inspection, compliance work or certification for a property?', 'Electrical COCs'],
    gate:        ['gate', 'gate', 'Gate Won&rsquo;t Open?', 'Gate motor stopped working or giving you trouble?', 'Gate Motor Repairs'],
    fence:       ['fence', 'gate', 'Electric Fence Problem?', 'Repairs, extensions and electric fence compliance services.', 'Electric Fencing'],
    hotwater:    ['droplet', 'plumbing', 'No Hot Water?', 'The issue could involve the geyser, plumbing or electrical supply.', 'Plumbing &amp; Geysers'],
    backup:      ['battery', 'solar', 'Need Backup Power?', 'Solar, inverter and battery systems designed around the way your property uses power.', 'Explore Backup Power'],
    property:    ['paint', 'maintenance', 'Property Needs Attention?', 'Painting, ceilings, drywall and general repairs.', 'Property Maintenance'],
    unsure:      ['tools', 'contact', 'Not Sure Which Service to Choose?', 'Describe the problem in your own words and WHT can help identify which service is relevant.', 'Tell Us What&rsquo;s Happening'],
};

/* ---------- Page-section builders ---------- */

const processSection = ({ h2 = 'What Happens When You Contact WHT?', items = PROCESS_GENERAL, alt = false, eyebrow = 'How it works' } = {}) => `
        <section id="process" class="wht-section${alt ? ' wht-section--alt' : ''}" aria-labelledby="wht-process-title">
            <div class="wht-container">
${sectionHead({ eyebrow, h2, center: true, id: 'wht-process-title' })}
                ${steps(items)}
            </div>
        </section>
`;

const relatedSection = ({ keys, h2 = 'Related Services', eyebrow = 'Related services', alt = false }) => `
        <section class="wht-section${alt ? ' wht-section--alt' : ''}" aria-labelledby="wht-related-title">
            <div class="wht-container">
${sectionHead({ eyebrow, h2, id: 'wht-related-title' })}
                ${related(keys.map((k) => CARD[k]))}
            </div>
        </section>
`;

/* Tab 4 "Project / proof". Projects is Phase 2, so pillar pages point at the
   homepage Recent Work section until individual project pages exist. */
const proofSection = ({ alt = false } = {}) => `
        <section class="wht-section wht-section--tight${alt ? ' wht-section--alt' : ''}" aria-labelledby="wht-proof-title">
            <div class="wht-container">
                ${callout({
        eyebrow: 'Recent work', h2: 'Recent WHT Projects', id: 'wht-proof-title',
        body: [
            'Real work tells the story better than generic claims.',
            'Explore examples of problems WHT has investigated, systems installed and property work completed for clients across Gauteng and South Africa.',
        ],
        cta: btn.ghost('View Recent Work', 'home', '#work'),
    })}
            </div>
        </section>
`;

const photoSlot = (icon, label) => `<div class="wht-photoslot" aria-hidden="true">
                        ${ic(icon)}
                        <strong>${label}</strong>
                        <span>Replace with a real WHT photograph before launch</span>
                    </div>`;

const stars = () => `<div class="wht-review__stars" aria-hidden="true">${ic('star').repeat(5)}</div>`;

/* =========================================================
   PAGES
   ========================================================= */
export const pages = [

    /* -------------------------------------------------------
       PAGE 1 — HOME   (Tab 3 wireframe, 14 sections)
       ------------------------------------------------------- */
    {
        key: 'home',
        label: 'Home',
        title: 'WHT Electrical | Electrical, Solar, Plumbing & Maintenance Gauteng',
        description: 'Electrical, solar, plumbing and property maintenance services across Gauteng and nationally. Tell WHT what’s happening and request a quote.',
        preload: HERO_IMG,
        faqs: [
            ['What services does WHT Electrical provide?', 'WHT provides general electrical work, fault finding, COCs, gate motors, electric fencing, generator connections, solar and battery backup, plumbing and property maintenance.'],
            ['Where is WHT Electrical based?', 'WHT Electrical is based in Northmead, Benoni, Gauteng.'],
            ['Which areas does WHT Electrical service?', 'WHT serves clients across Gauteng and undertakes projects nationally.'],
            ['Does WHT work with businesses and property managers?', 'Yes. WHT works across residential, commercial and industrial environments and supports businesses, property managers, complexes, landlords and other managed properties.'],
            ['Can WHT help if I do not know what is causing the problem?', 'Yes. Many clients only know the symptom they are experiencing. Explain what is happening and WHT can advise on the appropriate next step.'],
        ],
        body: (page) => `
        <!-- SECTION 2 — HERO -->
        <section id="home" class="wht-hero" aria-labelledby="wht-h1">
            <div class="wht-hero__media">
                <!-- REPLACE with real WHT technician / project photography (Tab 9) -->
                <img src="${HERO_IMG}" alt="" width="1400" height="933" fetchpriority="high" decoding="async">
            </div>
            <div class="wht-hero__panel" aria-hidden="true"></div>
            <svg class="wht-hero__edge" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                <path d="M 80 0 L 56 48 L 72 48 L 40 100" vector-effect="non-scaling-stroke"/>
            </svg>
            <div class="wht-container wht-hero__inner">
                <div class="wht-hero__content">
                    <span class="wht-hero__brandline">${SITE.tagline}</span>
                    <h1 id="wht-h1">Electrical, Solar, Plumbing &amp; Maintenance Across Gauteng</h1>
                    <p class="wht-hero__q">Power tripping? Gate stuck? No hot water? Planning solar or backup power?</p>
                    <p>WHT Electrical helps homeowners, businesses and property managers find practical solutions to the problems that interrupt everyday life.</p>
                    <p class="wht-hero__base">Based in Benoni and serving clients throughout Gauteng, with national project capability.</p>
                    <div class="wht-hero__cta">
                        ${btn.quote()}
                        ${btn.wa()}
                    </div>
                </div>
            </div>
        </section>

        <!-- SECTION 3 — TRUST STRIP -->
        <section class="wht-trustbar" aria-label="About WHT at a glance">
            <div class="wht-container">
                <ul>
                    <li>${ic('clock')} Established 2010</li>
                    <li>${ic('building')} Residential &middot; Commercial &middot; Industrial</li>
                    <li>${ic('doc')} Electrical &amp; Electric Fence COCs</li>
                    <li>${ic('pin')} Gauteng Based &middot; National Capability</li>
                </ul>
            </div>
        </section>

        <!-- SECTION 4 — PROBLEM NAVIGATION -->
        <section id="problems" class="wht-section" aria-labelledby="wht-problems-title">
            <div class="wht-container">
${sectionHead({
            eyebrow: 'Start here', h2: 'What Problem Can We Help You Solve?', id: 'wht-problems-title',
            lead: 'Sometimes you know exactly what service you need. Other times, you simply know something has stopped working. Choose the problem that sounds familiar and we&rsquo;ll point you in the right direction.',
        })}
                <div class="wht-problems">
${['fault', 'coc', 'gate', 'fence', 'hotwater', 'backup', 'property', 'unsure'].map((k) => {
            const [icon, key, h3, p, link] = CARD[k];
            return `                    <article class="wht-problem">
                        <div class="wht-problem__icon">${ic(icon)}</div>
                        <h3>${h3}</h3>
                        <p>${p}</p>
                        ${arrow(link, key)}
                    </article>`;
        }).join('\n')}
                </div>
            </div>
        </section>

        <!-- SECTION 5 — MAIN SERVICES -->
        <section id="services" class="wht-section wht-section--alt" aria-labelledby="wht-services-title">
            <div class="wht-container">
${sectionHead({
            eyebrow: 'Our services', h2: 'Practical Solutions Across Your Property', id: 'wht-services-title',
            lead: 'WHT provides electrical, power, plumbing and maintenance services for homes, businesses and managed properties.',
        })}
                <!-- REPLACE all four images with real WHT photography -->
                <div class="wht-services">
${[
            ['electrical', '1621905252507-b35492cc74b4', 'Electrician standing beside an electrical installation'],
            ['solar', '1509391366360-2e959784a276', 'Rows of installed solar panels'],
            ['plumbing', '1607472586893-edb57bdc0e39', 'Exposed plumbing pipework on a brick wall'],
            ['maintenance', '1562259949-e8e7689d7828', 'Paint roller applying fresh paint to a wall'],
        ].map(([k, photo, alt]) => {
            const [icon, key, h3, p, link] = CARD[k];
            return `                    <article class="wht-service">
                        <div class="wht-service__media">
                            <img loading="lazy" decoding="async" width="500" height="333" src="${img(photo, 500)}" alt="${alt}">
                            <span class="wht-service__badge">${ic(icon)}</span>
                        </div>
                        <div class="wht-service__body">
                            <h3>${h3}</h3>
                            <p>${p}</p>
                            ${arrow(link, key)}
                        </div>
                    </article>`;
        }).join('\n')}
                </div>
            </div>
        </section>

        <!-- SECTION 6 — PROBLEM-SOLVING -->
        <section id="approach" class="wht-section wht-brand" aria-labelledby="wht-approach-title">
            <div class="wht-container wht-grid-2">
                <div>
                    <span class="wht-eyebrow">Our approach</span>
                    <h2 id="wht-approach-title">Problems Found. Solutions Delivered.</h2>
                    <p>A recurring fault can be frustrating, especially when the cause is hidden.</p>
                    <p>WHT approaches the job by understanding what is happening, assessing the relevant system and identifying what needs attention before recommending the appropriate solution.</p>
                    <p>That approach applies across electrical work, backup power, gate motors, plumbing and general property maintenance.</p>
                    <p class="wht-emph">The goal is simple: help you understand the problem and get things working properly again.</p>
                    <p>${btn.quote('Tell Us What&rsquo;s Happening')}</p>
                </div>
                <div>
                    <ul class="wht-brand__points">
                        <li>${ic('check')} Listen to the problem.</li>
                        <li>${ic('check')} Assess what is happening.</li>
                        <li>${ic('check')} Explain the recommended solution.</li>
                        <li>${ic('check')} Do the work with care.</li>
                    </ul>
                </div>
            </div>
        </section>

        <!-- SECTION 7 — PROCESS -->
${processSection()}

        <!-- SECTION 8 — COC FEATURE -->
        <section id="coc" class="wht-section wht-section--alt" aria-labelledby="wht-coc-title">
            <div class="wht-container">
                ${callout({
            eyebrow: 'Compliance', h2: 'Need an Electrical COC?', id: 'wht-coc-title',
            body: [
                'Whether you are selling a property, checking an installation or dealing with a compliance requirement, WHT can assist with electrical inspections, remedial work and Certificates of Compliance.',
                'Electric fence compliance is also available as a separate service.',
            ],
            cta: btn.quote('Ask About a COC', 'coc'),
        })}
            </div>
        </section>

        <!-- SECTION 9 — MARKETS SERVED -->
        <section id="markets" class="wht-section" aria-labelledby="wht-markets-title">
            <div class="wht-container">
${sectionHead({ eyebrow: 'Who we work with', h2: 'Support for Homes, Businesses &amp; Properties', id: 'wht-markets-title' })}
                <div class="wht-markets">
                    <article class="wht-market">
                        <div class="wht-market__icon">${ic('home')}</div>
                        <h3>Residential</h3>
                        <p>Electrical repairs, solar, plumbing, security systems and maintenance for the places people call home.</p>
                    </article>
                    <article class="wht-market">
                        <div class="wht-market__icon">${ic('building')}</div>
                        <h3>Commercial</h3>
                        <p>Practical electrical, power and property support that helps businesses keep operating.</p>
                    </article>
                    <article class="wht-market">
                        <div class="wht-market__icon">${ic('factory')}</div>
                        <h3>Industrial</h3>
                        <p>Electrical and power services for larger installations and operational environments.</p>
                    </article>
                </div>
                <p class="wht-markets-note">WHT also works with property managers, landlords, complexes, estates, body corporates and facilities teams.</p>
            </div>
        </section>

        <!-- SECTION 10 — RECENT WORK
             BUILD NOTE (Tab 5): keep this on the homepage even though Projects is Phase 2.
             Three cards, no separate project pages needed yet. -->
        <section id="work" class="wht-section wht-section--alt" aria-labelledby="wht-work-title">
            <div class="wht-container">
${sectionHead({
            eyebrow: 'Recent work', h2: 'Recent WHT Projects', id: 'wht-work-title',
            lead: 'Real work tells the story better than generic claims. Explore examples of problems WHT has investigated, systems installed and property work completed for clients across Gauteng and South Africa.',
        })}
                <!-- PLACEHOLDER PROJECTS — replace with real WHT jobs and photographs (Tab 10 template) -->
                <div class="wht-projects">
${[
            ['1558618666-fcd25c85cd64', 'Recurring Electrical Trips', 'fault'],
            ['1508514177221-188b1cf16e9d', 'Backup Power Installation', 'solar'],
            ['1600585154340-be6161a56a0c', 'Gate Motor Replacement', 'gate'],
        ].map(([photo, h3, key]) => `                    <article class="wht-project">
                        <div class="wht-project__media">
                            <img loading="lazy" decoding="async" width="500" height="333" src="${img(photo, 500)}" alt="">
                        </div>
                        <div class="wht-project__body">
                            <span class="wht-project__loc">${ic('pin')} Example project</span>
                            <h3>${h3}</h3>
                            <dl>
                                <dt>Problem</dt><dd>Replace with what the client was experiencing.</dd>
                                <dt>Work completed</dt><dd>Replace with what WHT assessed, repaired or installed.</dd>
                            </dl>
                            ${arrow('Related service', key)}
                        </div>
                    </article>`).join('\n')}
                </div>
            </div>
        </section>

        <!-- SECTION 11 — REVIEWS
             BUILD NOTE (Tab 5): insert GENUINE Google reviews only. Do not rewrite review wording.
             Once real, add a matching aggregateRating to the business schema in build/layout.mjs. -->
        <section id="reviews" class="wht-section" aria-labelledby="wht-reviews-title">
            <div class="wht-container">
${sectionHead({
            eyebrow: 'Reviews', h2: 'What Clients Say About WHT', id: 'wht-reviews-title',
            lead: 'Finding a contractor you can rely on matters. Read what WHT clients have said about their experience, the work completed and the service they received.',
        })}
                <div class="wht-reviews">
${[1, 2, 3].map(() => `                    <figure class="wht-review">
                        ${stars()}
                        <blockquote><p>Placeholder &mdash; paste a genuine Google review here, word for word.</p></blockquote>
                        <figcaption>Reviewer name<span>Google review</span></figcaption>
                    </figure>`).join('\n')}
                </div>
            </div>
        </section>

        <!-- SECTION 12 — FAQs -->
${faqSection(page.faqs, { h2: 'Common Questions' })}
        <!-- SECTION 13 — FINAL CTA -->
${ctaBand({
            h2: 'Tell Us What&rsquo;s Happening',
            body: ['Need electrical, solar, plumbing or property maintenance help? Tell WHT about the problem or project and we&rsquo;ll help you determine the next step.'],
            buttons: `${btn.quote()}\n                    ${btn.wa()}`,
            phones: true,
        })}`,
    },

    /* -------------------------------------------------------
       PAGE 2 — ELECTRICAL   (Service Pillar template)
       ------------------------------------------------------- */
    {
        key: 'electrical',
        label: 'Electrical',
        service: 'Electrical Services &amp; Repairs',
        title: 'Electrical Services & Repairs Gauteng | WHT Electrical',
        description: 'Electrical repairs, installations, fault finding, DB boards, rewiring, COCs and generator connections across Gauteng. Contact WHT Electrical.',
        crumbs: [HOME, ELECTRICAL],
        faqs: [
            ['Why does my power keep tripping?', 'Repeated tripping can indicate a problem somewhere in the electrical system. Fault finding helps isolate the affected circuit or component so the appropriate repair can be recommended.'],
            ['Can WHT repair DB boards?', 'Yes. WHT provides DB board repairs, upgrades and related electrical work.'],
            ['Does WHT install new plugs and lighting?', 'Yes. WHT installs and repairs plug points, switches and lighting.'],
            ['Does WHT do rewiring?', 'Yes. Rewiring forms part of WHT&rsquo;s electrical service offering.'],
            ['Does WHT work on commercial and industrial electrical systems?', 'Yes. WHT provides electrical services across residential, commercial and industrial environments.'],
        ],
        body: (page) => `${pageHero(page, {
            h1: 'Electrical Services &amp; Repairs Across Gauteng',
            lead: [
                'From a plug that has stopped working to recurring power trips or a larger electrical installation, WHT provides practical electrical support for homes, businesses and properties.',
                'Services are available throughout Gauteng, with national electrical project capability.',
            ],
            cta: `${btn.quote()}\n                        ${btn.wa()}`,
        })}
        <!-- Common problems -->
        <section class="wht-section" aria-labelledby="wht-problems-title">
            <div class="wht-container wht-grid-2 wht-grid-2--top">
                <div>
                    <span class="wht-eyebrow">Common problems</span>
                    <h2 class="wht-title" id="wht-problems-title">Something Electrical Giving You Trouble?</h2>
                    <p class="wht-lead">Common problems include:</p>
                </div>
                <div>
                    ${bullets([
            'Power repeatedly tripping', 'Earth leakage faults', 'Lights that stop working',
            'Faulty plugs or switches', 'DB board problems', 'Damaged or ageing wiring',
            'Electrical problems after power interruptions', 'Circuits that need upgrading',
            'Electrical installations requiring compliance work',
        ], { one: true })}
                    <p class="wht-note">You do not need to diagnose the fault yourself. Tell WHT what is happening and the problem can be assessed.</p>
                </div>
            </div>
        </section>

        <!-- Services included -->
        <section id="services" class="wht-section wht-section--alt" aria-labelledby="wht-services-title">
            <div class="wht-container">
${sectionHead({ eyebrow: 'Electrical services', h2: 'Electrical Work WHT Can Help With', id: 'wht-services-title' })}
                ${slist([
            ['inspect', 'Repairs &amp; Fault Finding', 'Electrical diagnostics and repairs for recurring or unexpected faults.'],
            ['cable', 'New Installations', 'Electrical work for new installations, additions and property improvements.'],
            ['grid', 'DB Boards', 'DB board repairs, upgrades and related electrical work.'],
            ['layers', 'Rewiring', 'Rewiring where existing electrical systems need attention or upgrading.'],
            ['plug', 'Plugs, Switches &amp; Lighting', 'Installation and repair of plug points, switches and lighting.'],
            ['tools', 'Geyser &amp; Stove Isolators', 'Electrical isolators and related circuit work.'],
            ['doc', 'Electrical COCs', 'Electrical inspections, remedial work and Certificates of Compliance.'],
            ['generator', 'Generator Connections', 'Generator connections and whole-house generator installation requirements.'],
            ['gate', 'Gate Motors &amp; Electric Fencing', 'Electrical support for property access and perimeter systems.'],
        ])}
            </div>
        </section>

        <!-- Related specialist services — each keeps its approved H2 -->
        <section class="wht-section" aria-label="Specialist electrical services">
            <div class="wht-container">
                ${related([
            ['bolt', 'fault', 'Power Keeps Tripping?', [
                'A circuit that repeatedly trips is usually telling you that something needs attention.',
                'WHT provides electrical fault finding to identify the affected circuit, installation or component before recommending the appropriate repair.',
            ], 'Explore Fault Finding'],
            ['doc', 'coc', 'Need an Electrical COC?', ['WHT can assist with electrical inspections, compliance-related repairs and electrical Certificates of Compliance.'], 'Electrical COC Services'],
            ['gate', 'gate', 'Gate Motors &amp; Electric Fencing', ['WHT provides gate motor repairs and installations together with electric fence repairs, extensions and compliance services.'], 'Explore Gate Motors &amp; Electric Fencing'],
        ], { level: 'h2' })}
            </div>
        </section>

${processSection({
            h2: 'How WHT Approaches Electrical Work', alt: true,
            items: [
                [null, 'Tell us what is happening or what work you require.'],
                [null, 'The relevant electrical system is assessed and the recommended work is explained.'],
                [null, 'Once approved, the work is completed and tested, with applicable documentation supplied where required.'],
            ],
        })}
${proofSection()}
${faqSection(page.faqs, { h2: 'Electrical FAQs' })}
${ctaBand({
            h2: 'Need Electrical Help?',
            body: ['Whether you know exactly what work is required or simply know something is not working properly, tell WHT what is happening.'],
            buttons: `${btn.quote()}\n                    ${btn.wa()}`,
        })}`,
    },

    /* -------------------------------------------------------
       PAGE 3 — FAULT FINDING & REPAIRS   (High-Intent template)
       ------------------------------------------------------- */
    {
        key: 'fault',
        label: 'Fault Finding &amp; Repairs',
        service: 'Electrical Fault Finding &amp; Repairs',
        title: 'Electrical Fault Finding Gauteng | WHT Electrical',
        description: 'Power keeps tripping or an electrical fault keeps returning? WHT provides electrical fault finding and repairs throughout Gauteng.',
        crumbs: [HOME, ELECTRICAL, { key: 'fault', label: 'Fault Finding &amp; Repairs' }],
        faqs: [
            ['Why does my earth leakage keep tripping?', 'Earth leakage can trip when the system detects a problem. The cause may involve an appliance, circuit, moisture or another electrical fault and should be properly investigated if it keeps happening.'],
            ['Why does my electricity trip after rain?', 'Moisture can contribute to electrical faults in certain installations. A recurring weather-related problem should be assessed to determine where moisture or another fault is affecting the system.'],
            ['Why does my power trip when electricity comes back on?', 'Electrical systems can experience faults or load-related issues when supply returns. Repeated problems should be investigated rather than treated as normal.'],
            ['Should I keep resetting a breaker that trips?', 'If the same breaker repeatedly trips, the underlying problem should be identified before the circuit is continually reset.'],
            ['Can WHT fix the problem once the fault has been found?', 'WHT provides general electrical repairs and can advise on the work required once the cause has been identified.'],
        ],
        body: (page) => `${pageHero(page, {
            h1: 'Power Keeps Tripping? Electrical Fault Finding Across Gauteng',
            lead: [
                'When an electrical problem keeps coming back, finding the cause matters.',
                'WHT provides electrical fault finding and repairs to identify what is causing the problem and determine the appropriate solution.',
            ],
            cta: `${btn.wa('WhatsApp WHT About the Problem', "Hi WHT Electrical, my power keeps tripping. Here's what is happening:")}\n                        ${btn.call()}`,
        })}
        <!-- Direct answer + common problems -->
        <section class="wht-section" aria-label="Why power trips and what WHT investigates">
            <div class="wht-container wht-grid-2 wht-grid-2--top">
                <div class="wht-answer">
                    <h2>Why Does My Power Keep Tripping?</h2>
                    <p>Repeated tripping usually means the electrical system is responding to a fault or abnormal condition. The cause may sit within a circuit, appliance, connection or another part of the installation.</p>
                    <p>Proper testing helps identify where the problem is coming from.</p>
                </div>
                <div>
                    <span class="wht-eyebrow">Common problems</span>
                    <h2 class="wht-title">Electrical Problems WHT Can Investigate</h2>
                    ${bullets([
            'Power repeatedly tripping', 'Earth leakage problems', 'Trips after rain',
            'Electrical problems after power interruptions', 'Lights not working correctly',
            'Faulty plug circuits', 'DB board problems', 'Recurring unexplained faults',
            'Electrical issues other contractors have struggled to resolve',
        ], { one: true })}
                </div>
            </div>
        </section>

        <!-- What WHT does -->
        <section class="wht-section wht-brand" aria-labelledby="wht-approach-title">
            <div class="wht-container">
                <div class="wht-prose">
                    <span class="wht-eyebrow">Fault-finding approach</span>
                    <h2 id="wht-approach-title">Find the Cause Before Recommending the Repair</h2>
                    <p class="wht-emph">Electrical faults are not always obvious.</p>
                    <p>The visible symptom may be a tripped switch or a circuit that stops working, while the underlying problem sits somewhere else in the system.</p>
                    <p>WHT assesses and tests the relevant electrical installation to narrow down the cause.</p>
                    <p>Once the issue has been identified, the findings and recommended work can be explained.</p>
                </div>
            </div>
        </section>

${processSection({
            h2: 'What Happens During Fault Finding?',
            items: [
                ['Describe the Problem', 'Tell WHT what happens and when you notice it.'],
                ['Assessment &amp; Testing', 'The relevant circuits and electrical components are assessed.'],
                ['Identify the Fault', 'Testing helps narrow down the cause of the problem.'],
                ['Recommended Repair', 'WHT explains what needs attention and the appropriate next step.'],
            ],
        })}
        <!-- Related service -->
        <section class="wht-section wht-section--alt" aria-labelledby="wht-related-title">
            <div class="wht-container wht-grid-2">
                <div>
                    <span class="wht-eyebrow">Related electrical work</span>
                    <h2 class="wht-title" id="wht-related-title">Related Electrical Work</h2>
                    <p class="wht-lead">Fault finding may lead to work involving:</p>
                    <p style="margin-top:24px">${btn.ghost('View All Electrical Services', 'electrical')}</p>
                </div>
                <div>
                    ${bullets(['DB boards', 'Wiring', 'Plug circuits', 'Lighting', 'Isolators', 'Electrical repairs', 'Compliance-related work'])}
                </div>
            </div>
        </section>

${faqSection(page.faqs, { h2: 'Fault Finding FAQs', alt: false })}
${ctaBand({
            h2: 'Power Keeps Tripping?',
            body: ['Tell us what is happening and when the problem occurs.'],
            buttons: `${btn.wa('WhatsApp WHT', "Hi WHT Electrical, my power keeps tripping. Here's what is happening:")}\n                    ${btn.call()}`,
            phones: true,
        })}`,
    },

    /* -------------------------------------------------------
       PAGE 4 — ELECTRICAL COCs   (High-Intent template)
       ------------------------------------------------------- */
    {
        key: 'coc',
        label: 'Electrical COCs',
        service: 'Electrical COC Inspections &amp; Certificates',
        title: 'Electrical COC Gauteng | WHT Electrical',
        description: 'Need an electrical COC? WHT provides electrical inspections, remedial work and Certificates of Compliance across Gauteng.',
        crumbs: [HOME, ELECTRICAL, { key: 'coc', label: 'Electrical COCs' }],
        faqs: [
            ['Do I need an electrical COC to sell my property?', 'Electrical compliance commonly forms part of property transfer requirements. The specific requirements applicable to your transaction should be confirmed with the relevant professionals handling the transfer.'],
            ['Can WHT issue an electrical COC?', 'WHT provides electrical COC inspection and certification services.'],
            ['What happens if the property fails the inspection?', 'The problems identified can be explained and the required remedial electrical work can be quoted before repairs proceed.'],
            ['Can WHT complete the repairs identified during the inspection?', 'Yes. WHT provides general electrical repairs and compliance-related electrical work.'],
            ['Is an electric fence COC the same as the electrical COC?', 'No. Electric fence compliance is treated separately from the general electrical installation.'],
        ],
        body: (page) => `${pageHero(page, {
            h1: 'Electrical COC Inspections &amp; Certificates Across Gauteng',
            question: 'Need an electrical Certificate of Compliance for your property?',
            lead: ['WHT provides electrical inspections, compliance-related repairs and COC services for residential, commercial and other properties.'],
            cta: `${btn.quote('Ask About a COC')}\n                        ${btn.wa('WhatsApp WHT', "Hi WHT Electrical, I'd like to ask about an electrical COC for my property.")}`,
        })}
        <!-- Direct answer + when you need one -->
        <section class="wht-section" aria-label="What a COC is and when you may need one">
            <div class="wht-container wht-grid-2 wht-grid-2--top">
                <div class="wht-answer">
                    <span class="wht-eyebrow">What is an electrical COC?</span>
                    <h2>What Is an Electrical Certificate of Compliance?</h2>
                    <p>An electrical Certificate of Compliance confirms that an electrical installation has been assessed against the applicable compliance requirements at the time of inspection.</p>
                    <p>If problems are identified, remedial work may be needed before certification can be completed.</p>
                </div>
                <div>
                    <span class="wht-eyebrow">When clients may need a COC</span>
                    <h2 class="wht-title">When Might You Need an Electrical COC?</h2>
                    <p class="wht-lead">Clients commonly enquire about COCs when:</p>
                    <div style="margin:20px 0">${bullets([
            'Selling or transferring property', 'Checking an existing electrical installation',
            'Completing electrical alterations', 'Addressing compliance concerns', 'Updating electrical systems',
        ], { one: true })}</div>
                    <p class="wht-note">The requirements can vary according to the property and work involved.</p>
                </div>
            </div>
        </section>

${processSection({
            h2: 'What Happens During the COC Process?', eyebrow: 'The WHT COC process', alt: true,
            items: [
                ['Inspection', 'The electrical installation is assessed.'],
                ['Findings', 'Any compliance problems identified during the inspection are explained.'],
                ['Remedial Work', 'Where required, WHT can quote on the electrical work needed to address the identified issues.'],
                ['Reinspection &amp; Certification', 'Once the relevant work has been completed and the installation meets the applicable requirements, the certification process can proceed.'],
            ],
        })}
        <!-- Electric fence COC -->
        <section class="wht-section" aria-labelledby="wht-fence-title">
            <div class="wht-container">
                ${callout({
            eyebrow: 'Electric fence COC', h2: 'Does My Electric Fence Need Separate Compliance?', id: 'wht-fence-title',
            body: [
                'Electrical installation compliance and electric fence compliance are separate areas.',
                'WHT provides electric fence COC services in addition to general electrical compliance services.',
                'If your property has an electric fence, mention this when you contact WHT.',
            ],
            cta: btn.ghost('Ask About Electric Fence Compliance', 'gate'),
        })}
            </div>
        </section>

${faqSection(page.faqs, { h2: 'COC FAQs' })}
${ctaBand({
            h2: 'Need an Electrical COC?',
            body: ['Tell WHT what type of property you have and what the COC is required for.'],
            buttons: `${btn.quote('Ask About a COC')}\n                    ${btn.wa('WhatsApp WHT', "Hi WHT Electrical, I'd like to ask about an electrical COC for my property.")}`,
        })}`,
    },

    /* -------------------------------------------------------
       PAGE 5 — GATE MOTORS & ELECTRIC FENCING   (High-Intent template)
       ------------------------------------------------------- */
    {
        key: 'gate',
        label: 'Gate Motors &amp; Electric Fencing',
        service: 'Gate Motor &amp; Electric Fence Repairs',
        title: 'Gate Motor & Electric Fence Repairs Gauteng | WHT',
        description: 'Gate motor repairs, installations, electric fence repairs, extensions and COC services throughout Gauteng. Contact WHT Electrical.',
        crumbs: [HOME, ELECTRICAL, { key: 'gate', label: 'Gate Motors &amp; Electric Fencing' }],
        faqs: [
            ['Why won&rsquo;t my gate motor open?', 'Gate motor problems may involve the battery, power supply, motor, controls or another component. Assessment helps identify where the fault lies.'],
            ['Can WHT replace a gate motor battery?', 'Gate motor problems involving battery backup can be assessed and the appropriate solution recommended.'],
            ['Does WHT install new gate motors?', 'Yes. Gate motor installation forms part of WHT&rsquo;s service offering.'],
            ['Does WHT repair electric fences?', 'Yes. WHT provides electric fence repairs, installations and extensions.'],
            ['Can WHT provide an electric fence COC?', 'Yes. Electric fence compliance services are included in WHT&rsquo;s offering.'],
        ],
        body: (page) => `${pageHero(page, {
            h1: 'Gate Motor &amp; Electric Fence Repairs Across Gauteng',
            lead: [
                'A gate that will not open or an electric fence that is not working can quickly become inconvenient and affect how secure the property feels.',
                'WHT provides gate motor and electric fence repairs, installations and compliance support.',
            ],
            cta: `${btn.quote()}\n                        ${btn.wa()}`,
        })}
        <!-- Gate motors | Electric fencing -->
        <section class="wht-section" aria-label="Gate motor and electric fence services">
            <div class="wht-container wht-grid-2 wht-grid-2--top">
                <article class="wht-panel" aria-labelledby="wht-gate-title">
                    <div class="wht-panel__icon">${ic('gate')}</div>
                    <span class="wht-eyebrow">Gate motor problems</span>
                    <h2 id="wht-gate-title">Gate Won&rsquo;t Open?</h2>
                    <p>A gate motor failure may involve the motor itself, electrical supply, backup battery, controls or another part of the system.</p>
                    <p>WHT can assess the problem and determine what needs attention.</p>
                    <h3 class="wht-sublabel">Gate motor services</h3>
                    ${bullets(['Gate motor installations', 'Gate motor repairs', 'Gate motor upgrades', 'Electrical fault finding', 'Power supply-related problems'], { one: true })}
                </article>
                <article class="wht-panel" aria-labelledby="wht-fence-title">
                    <div class="wht-panel__icon">${ic('fence')}</div>
                    <span class="wht-eyebrow">Electric fencing</span>
                    <h2 id="wht-fence-title">Keep Your Electric Fence Working Properly</h2>
                    <p>An electric fence needs to operate consistently to perform its intended role.</p>
                    <h3 class="wht-sublabel">WHT provides</h3>
                    ${bullets(['Electric fence installations', 'Electric fence repairs', 'Electric fence extensions', 'Fault assessment', 'Electric fence COCs'], { one: true })}
                </article>
            </div>
        </section>

${processSection({
            alt: true,
            items: [
                [null, 'Explain whether the problem involves the gate, electric fence or both.'],
                [null, 'The relevant system is assessed before the recommended repair, installation or compliance work is explained.'],
            ],
        })}
${relatedSection({ keys: ['coc', 'fault', 'backup'], h2: 'Related Services' })}
${faqSection(page.faqs, { h2: 'Gate &amp; Fence FAQs' })}
${ctaBand({
            h2: 'Gate or Electric Fence Giving You Trouble?',
            body: ['Tell WHT what is happening.'],
            buttons: `${btn.wa()}\n                    ${btn.quote()}`,
        })}`,
    },

    /* -------------------------------------------------------
       PAGE 6 — SOLAR & BACKUP POWER   (Service Pillar template)
       ------------------------------------------------------- */
    {
        key: 'solar',
        label: 'Solar &amp; Backup Power',
        service: 'Solar, Inverter &amp; Battery Backup Systems',
        title: 'Solar, Inverter & Battery Backup Gauteng | WHT Electrical',
        description: 'Solar, inverter, battery backup, hybrid and off-grid systems for homes and businesses across Gauteng and nationally.',
        crumbs: [HOME, { key: 'solar', label: 'Solar &amp; Backup Power' }],
        faqs: [
            ['What size inverter do I need?', 'The correct inverter size depends on the equipment and circuits you want to power and the load they place on the system.'],
            ['What size battery do I need?', 'Battery capacity depends on how much power you use and how long you want the system to supply that power.'],
            ['Can backup power run my lights, Wi-Fi and fridge?', 'Those are common backup priorities, although the final system size needs to be based on the actual loads at your property.'],
            ['Does WHT install solar panels?', 'Yes. Solar panel installations form part of WHT&rsquo;s solar and backup power offering.'],
            ['Does WHT install off-grid systems?', 'Yes. WHT provides off-grid and hybrid solar solutions.'],
            ['Does WHT provide commercial solar?', 'Yes. WHT works across residential, commercial and industrial applications.'],
        ],
        body: (page) => `${pageHero(page, {
            h1: 'Solar, Inverter &amp; Battery Backup Systems Across Gauteng',
            question: 'What Do You Need to Keep Running When the Power Goes Out?',
            lead: [
                'The right backup system starts with understanding how your home, business or property actually uses power.',
                'WHT provides solar, inverter, battery and off-grid power systems for residential, commercial and industrial applications.',
            ],
            cta: `${btn.quote('Request a Solar Assessment')}\n                        ${btn.wa('WhatsApp WHT', "Hi WHT Electrical, I'm planning solar or backup power and would like an assessment.")}`,
        })}
        <!-- Start with your power needs -->
        <section class="wht-section" aria-labelledby="wht-needs-title">
            <div class="wht-container wht-grid-2 wht-grid-2--top">
                <div>
                    <span class="wht-eyebrow">Start with your power needs</span>
                    <h2 class="wht-title" id="wht-needs-title">Design the System Around What Matters to You</h2>
                    <p>Customers often start by asking what size inverter or battery they need.</p>
                    <p class="wht-emph">A more useful starting point is understanding what you want to keep running.</p>
                    <p>From there, the system can be planned around your actual requirements.</p>
                </div>
                <div class="wht-panel">
                    <h3 class="wht-sublabel" style="margin-top:0">That may include</h3>
                    ${bullets(['Lighting', 'Wi-Fi', 'Refrigeration', 'Security systems', 'Gate motors', 'Office equipment', 'Selected appliances', 'Important business circuits'])}
                </div>
            </div>
        </section>

        <!-- Services included -->
        <section id="services" class="wht-section wht-section--alt" aria-labelledby="wht-services-title">
            <div class="wht-container">
${sectionHead({ eyebrow: 'Solar &amp; backup power services', h2: 'Solar &amp; Backup Power Services', id: 'wht-services-title' })}
                ${slist([
            ['solar', 'Solar Installations', 'Solar panel installations for residential, commercial and industrial applications.'],
            ['bolt', 'Inverter Systems', 'Inverter installations designed around the power requirements of the property.'],
            ['battery', 'Battery Backup', 'Battery systems that provide stored power when grid supply is interrupted.'],
            ['layers', 'Lithium Battery Storage', 'Lithium storage systems for backup and solar applications.'],
            ['grid', 'Hybrid Solar', 'Systems combining solar generation, battery storage and grid supply.'],
            ['home', 'Off-Grid Systems', 'Solutions for properties requiring a greater level of energy independence.'],
        ])}
            </div>
        </section>

        <!-- Choose the right level of backup -->
        <section class="wht-section" aria-labelledby="wht-levels-title">
            <div class="wht-container">
${sectionHead({ eyebrow: 'Choose the right level of backup', h2: 'What Are You Trying to Achieve?', id: 'wht-levels-title' })}
                <div class="wht-markets">
                    <article class="wht-market">
                        <div class="wht-market__icon">${ic('battery')}</div>
                        <h3>Keep the Essentials Running</h3>
                        <p>Backup for selected circuits and important everyday appliances.</p>
                    </article>
                    <article class="wht-market">
                        <div class="wht-market__icon">${ic('solar')}</div>
                        <h3>Reduce Dependence on Grid Power</h3>
                        <p>Combine solar generation with storage to reduce reliance on grid electricity.</p>
                    </article>
                    <article class="wht-market">
                        <div class="wht-market__icon">${ic('home')}</div>
                        <h3>Move Towards Greater Independence</h3>
                        <p>Larger hybrid or off-grid systems can be designed around broader energy requirements.</p>
                    </article>
                </div>
            </div>
        </section>

        <!-- Commercial & industrial -->
        <section class="wht-section wht-brand" aria-labelledby="wht-commercial-title">
            <div class="wht-container wht-grid-2">
                <div>
                    <span class="wht-eyebrow">Commercial &amp; industrial solar</span>
                    <h2 id="wht-commercial-title">Power Solutions for Businesses</h2>
                    <p>Commercial and industrial properties often have different consumption patterns, operating hours and continuity requirements.</p>
                    <p>WHT can assess the property and recommend a system suited to the operational environment.</p>
                    <p class="wht-emph">National project capability is available for suitable commercial and industrial work.</p>
                </div>
                <div>
                    <p>${btn.quote('Request a Solar Assessment')}</p>
                </div>
            </div>
        </section>

${processSection({ alt: true })}
${relatedSection({ keys: ['electrical', 'gate', 'fault'] })}
${proofSection({ alt: true })}
${faqSection(page.faqs, { h2: 'Solar FAQs', alt: false })}
${ctaBand({
            h2: 'Planning Solar or Backup Power?',
            body: ['Tell WHT what you want to keep running and what you would like the system to achieve.'],
            buttons: `${btn.quote('Request a Solar Assessment')}\n                    ${btn.wa('WhatsApp WHT', "Hi WHT Electrical, I'm planning solar or backup power and would like an assessment.")}`,
        })}`,
    },

    /* -------------------------------------------------------
       PAGE 7 — PLUMBING   (Service Pillar template)
       ------------------------------------------------------- */
    {
        key: 'plumbing',
        label: 'Plumbing',
        service: 'Plumbing, Leak &amp; Geyser Repairs',
        title: 'Plumbing & Geyser Repairs Gauteng | WHT Electrical',
        description: 'Plumbing repairs, leaks, burst pipes and geyser services across Gauteng. Contact WHT for practical plumbing support.',
        crumbs: [HOME, { key: 'plumbing', label: 'Plumbing' }],
        faqs: [
            ['Why do I have no hot water?', 'A lack of hot water may involve the geyser, electrical supply or another part of the hot-water system. Assessment helps determine the cause.'],
            ['Does WHT repair geysers?', 'Yes. Geyser repairs form part of WHT&rsquo;s plumbing offering.'],
            ['Can WHT replace a geyser?', 'Yes. WHT provides geyser installation and replacement.'],
            ['Does WHT repair burst pipes?', 'Yes. Burst pipe repairs are included within the plumbing service offering.'],
            ['Can WHT help with leaks?', 'Yes. WHT provides leak detection and repair services.'],
        ],
        body: (page) => `${pageHero(page, {
            h1: 'Plumbing, Leak &amp; Geyser Repairs Across Gauteng',
            lead: [
                'A plumbing problem can disrupt a home or property quickly.',
                'WHT provides general plumbing repairs, geyser services, leak repairs and property plumbing support.',
            ],
            cta: `${btn.quote()}\n                        ${btn.wa()}`,
        })}
        <!-- Common problems -->
        <section class="wht-section" aria-labelledby="wht-problems-title">
            <div class="wht-container wht-grid-2 wht-grid-2--top">
                <div>
                    <span class="wht-eyebrow">Common plumbing problems</span>
                    <h2 class="wht-title" id="wht-problems-title">What Plumbing Problem Are You Dealing With?</h2>
                    <p class="wht-lead">WHT can assist with:</p>
                </div>
                <div>
                    ${bullets(['Leaks', 'Burst pipes', 'Geyser problems', 'No hot water', 'Kitchen plumbing', 'Bathroom plumbing', 'General plumbing repairs', 'Plumbing maintenance'])}
                </div>
            </div>
        </section>

        <!-- Services included -->
        <section id="services" class="wht-section wht-section--alt" aria-labelledby="wht-services-title">
            <div class="wht-container">
${sectionHead({ eyebrow: 'Plumbing services', h2: 'Plumbing Services', id: 'wht-services-title' })}
                ${slist([
            ['inspect', 'Leak Detection &amp; Repairs', 'Assessment and repair of plumbing leaks.'],
            ['droplet', 'Burst Pipes', 'Repairs where damaged plumbing has caused or may cause water loss and property damage.'],
            ['tools', 'Geyser Repairs', 'Assessment and repair of geyser-related problems.'],
            ['home', 'Geyser Installation &amp; Replacement', 'Installation or replacement where a geyser needs to be changed.'],
            ['grid', 'Kitchen &amp; Bathroom Plumbing', 'Practical plumbing work for kitchens and bathrooms.'],
            ['clock', 'General Maintenance', 'Ongoing plumbing repairs and property maintenance requirements.'],
        ])}
            </div>
        </section>

        <!-- No hot water? -->
        <section class="wht-section" aria-labelledby="wht-hotwater-title">
            <div class="wht-container">
                ${callout({
            eyebrow: 'No hot water?', h2: 'Is the Problem Plumbing or Electrical?', id: 'wht-hotwater-title',
            body: [
                'A loss of hot water can involve the geyser, plumbing system or electrical supply.',
                'Because WHT works across both electrical and plumbing services, the problem can be approached from the relevant side of the system.',
            ],
            cta: btn.quote('Tell Us What&rsquo;s Happening'),
        })}
            </div>
        </section>

${processSection({
            alt: true,
            items: [
                [null, 'Tell us what is happening and where the problem is located.'],
                [null, 'WHT can assess the issue, explain what needs attention and recommend the appropriate repair or replacement.'],
            ],
        })}
${relatedSection({ keys: ['electrical', 'maintenance', 'solar'] })}
${proofSection({ alt: true })}
${faqSection(page.faqs, { h2: 'Plumbing FAQs', alt: false })}
${ctaBand({
            h2: 'Plumbing Problem?',
            body: ['Tell WHT what is happening.'],
            buttons: `${btn.wa()}\n                    ${btn.quote()}`,
        })}`,
    },

    /* -------------------------------------------------------
       PAGE 8 — PROPERTY MAINTENANCE   (Service Pillar template)
       ------------------------------------------------------- */
    {
        key: 'maintenance',
        label: 'Property Maintenance',
        service: 'Property Maintenance',
        title: 'Property Maintenance Gauteng | WHT Electrical',
        description: 'Painting, ceilings, drywall, tiling and general property maintenance across Gauteng. Residential, commercial and managed property support.',
        crumbs: [HOME, { key: 'maintenance', label: 'Property Maintenance' }],
        faqs: [
            ['Does WHT work with property managers?', 'Yes. WHT supports property managers, landlords, complexes and other managed properties.'],
            ['Does WHT provide commercial maintenance?', 'Yes. Property maintenance services are available for commercial environments.'],
            ['Does WHT repair ceilings?', 'Yes. Ceiling repairs form part of WHT&rsquo;s maintenance offering.'],
            ['Does WHT provide painting?', 'Yes. WHT provides interior and exterior painting.'],
            ['Does WHT handle tiling and flooring?', 'Yes. Tiling and flooring are included within the property maintenance service offering.'],
        ],
        body: (page) => `${pageHero(page, {
            h1: 'Property Maintenance Across Gauteng',
            lead: [
                'Properties need ongoing attention to stay functional, presentable and properly maintained.',
                'WHT provides practical maintenance support for homes, businesses and managed properties across Gauteng, with national capability for suitable projects.',
            ],
            cta: `${btn.quote()}\n                        ${btn.wa()}`,
        })}
        <!-- Services included -->
        <section id="services" class="wht-section" aria-labelledby="wht-services-title">
            <div class="wht-container">
${sectionHead({ eyebrow: 'Maintenance services', h2: 'Property Work WHT Can Help With', id: 'wht-services-title' })}
                ${slist([
            ['tools', 'General Property Maintenance', 'Practical repairs and maintenance across residential and commercial properties.'],
            ['paint', 'Painting', 'Interior and exterior painting.'],
            ['layers', 'Ceilings', 'Ceiling repairs and related maintenance work.'],
            ['grid', 'Drywall', 'Drywall installation and repairs.'],
            ['roof', 'Roof &amp; Gutter Repairs', 'Maintenance work involving roofs and guttering.'],
            ['grid', 'Tiling', 'Tiling repairs and installations.'],
            ['home', 'Flooring', 'Flooring-related property maintenance.'],
        ])}
            </div>
        </section>

        <!-- Managed properties -->
        <section class="wht-section wht-brand" aria-labelledby="wht-managed-title">
            <div class="wht-container wht-grid-2">
                <div>
                    <span class="wht-eyebrow">Property managers &amp; complexes</span>
                    <h2 id="wht-managed-title">Maintenance Support for Managed Properties</h2>
                    <p>Property managers, landlords, complexes and businesses often need contractors who can assist across more than one part of a property.</p>
                    <p class="wht-emph">WHT&rsquo;s combined electrical, plumbing and maintenance offering allows clients to manage a broader range of practical property requirements through one service relationship.</p>
                </div>
                <div>
                    <p>${btn.quote()}</p>
                </div>
            </div>
        </section>

        <!-- Residential | Commercial -->
        <section class="wht-section" aria-label="Residential and commercial maintenance">
            <div class="wht-container wht-grid-2 wht-grid-2--top">
                <article class="wht-panel" aria-labelledby="wht-res-title">
                    <div class="wht-panel__icon">${ic('home')}</div>
                    <span class="wht-eyebrow">Residential maintenance</span>
                    <h2 id="wht-res-title">Keep Your Home in Good Working Order</h2>
                    <p>From damaged ceilings and painting to tiling and general repairs, WHT can assist with the maintenance work that keeps a property functional and cared for.</p>
                </article>
                <article class="wht-panel" aria-labelledby="wht-com-title">
                    <div class="wht-panel__icon">${ic('building')}</div>
                    <span class="wht-eyebrow">Commercial maintenance</span>
                    <h2 id="wht-com-title">Practical Support for Business Properties</h2>
                    <p>Maintenance issues can affect how a workplace functions and how the property is experienced by staff, tenants or customers.</p>
                    <p>WHT provides property maintenance alongside electrical and plumbing services for commercial environments.</p>
                </article>
            </div>
        </section>

${processSection({ alt: true })}
${relatedSection({ keys: ['electrical', 'plumbing', 'solar'] })}
${proofSection({ alt: true })}
${faqSection(page.faqs, { h2: 'Maintenance FAQs', alt: false })}
${ctaBand({
            h2: 'Have a Property Maintenance Job?',
            body: ['Tell WHT what work needs attention.'],
            buttons: `${btn.quote()}\n                    ${btn.wa()}`,
        })}`,
    },

    /* -------------------------------------------------------
       PAGE 9 — ABOUT WHT   (Standard Content template)
       ------------------------------------------------------- */
    {
        key: 'about',
        label: 'About WHT',
        title: 'About WHT Electrical | Gauteng',
        description: 'Meet WHT Electrical. Established in 2010 and built around practical problem-solving, dependable service and long-term client relationships.',
        crumbs: [HOME, { key: 'about', label: 'About WHT' }],
        body: (page) => `${pageHero(page, {
            h1: 'About WHT Electrical',
            lead: ['WHT Electrical was built from the ground up around practical skill, problem-solving and the satisfaction of helping people get things working again.'],
            question: SITE.tagline,
        })}
        <!-- The beginning -->
        <section class="wht-section" aria-labelledby="wht-begin-title">
            <div class="wht-container wht-grid-2">
                <div class="wht-prose">
                    <span class="wht-eyebrow">The beginning</span>
                    <h2 class="wht-title" id="wht-begin-title">A New Direction</h2>
                    <p>Before entering the electrical trade, Wayne spent twelve years working for a Swiss printing company.</p>
                    <p>When the company began closing down, he had to decide what came next.</p>
                    <p>A conversation with his father-in-law introduced him to a new opportunity. His father-in-law&rsquo;s brother was an electrician, and in 2010 Wayne began an apprenticeship with him.</p>
                    <p>At the same time, Wayne was attending night classes, developing practical experience and adjusting to life as a new father.</p>
                    <p class="wht-emph">The foundations of WHT were taking shape.</p>
                </div>
                <div>
                    ${photoSlot('users', 'Photo of Wayne')}
                </div>
            </div>
        </section>

        <!-- Building WHT -->
        <section class="wht-section wht-section--alt" aria-labelledby="wht-build-title">
            <div class="wht-container wht-grid-2">
                <div>
                    ${photoSlot('camera', 'Early WHT photo &mdash; the old Hilux or first jobs')}
                </div>
                <div class="wht-prose">
                    <span class="wht-eyebrow">Building WHT</span>
                    <h2 class="wht-title" id="wht-build-title">One Job at a Time</h2>
                    <p>The beginning was simple.</p>
                    <p class="wht-emph">An old Hilux bakkie. One team member. Real work that needed to be done properly.</p>
                    <p>Over time, WHT grew through hands-on experience, continued learning and clients who returned when they needed help again.</p>
                    <p>Electrical work remained at the heart of the business, while the service offering expanded into solar and backup power, plumbing and property maintenance.</p>
                </div>
            </div>
        </section>

        <!-- Why problem-solving matters -->
        <section class="wht-section wht-brand" aria-labelledby="wht-why-title">
            <div class="wht-container wht-grid-2">
                <div>
                    <span class="wht-eyebrow">Why problem-solving matters</span>
                    <h2 id="wht-why-title">Finding the Cause Changes the Outcome</h2>
                    <p>One of the most satisfying parts of the work has always been solving the problem that is disrupting someone&rsquo;s day.</p>
                    <p>Sometimes that means restoring hot water.</p>
                    <p>Another job may involve finding the cause of a recurring electrical fault or helping a business regain reliable power.</p>
                    <p>That practical sense of responsibility continues to shape the way WHT works today.</p>
                </div>
                <div>
                    <ul class="wht-brand__points">
                        <li>${ic('check')} Listen to the problem.</li>
                        <li>${ic('check')} Assess what is happening.</li>
                        <li>${ic('check')} Explain the recommended solution.</li>
                        <li>${ic('check')} Do the work with care.</li>
                    </ul>
                </div>
            </div>
        </section>

        <!-- Who WHT serves -->
        <section class="wht-section" aria-labelledby="wht-serves-title">
            <div class="wht-container wht-grid-2 wht-grid-2--top">
                <div>
                    <span class="wht-eyebrow">Who WHT serves</span>
                    <h2 class="wht-title" id="wht-serves-title">From Homes to Commercial Properties</h2>
                    <p class="wht-lead">WHT works across:</p>
                    <p class="wht-note" style="margin-top:24px">WHT is based in Benoni and serves clients throughout Gauteng, with national project capability.</p>
                </div>
                <div>
                    ${bullets(['Residential properties', 'Businesses', 'Commercial environments', 'Industrial sites', 'Complexes and estates', 'Managed properties', 'Landlord portfolios', 'Property and facilities requirements'])}
                </div>
            </div>
        </section>

        <!-- The WHT approach -->
        <section class="wht-section wht-section--alt" aria-labelledby="wht-approach-title">
            <div class="wht-container">
                <div class="wht-prose">
                    <span class="wht-eyebrow">The WHT approach</span>
                    <h2 class="wht-title" id="wht-approach-title">Practical Service Built Around the Client</h2>
                    <p>WHT aims to make technical and property problems easier to deal with.</p>
                    <p>That means clear communication, practical recommendations and a focus on solving the actual problem in front of the client.</p>
                    <p class="wht-emph">The strongest sign of trust is often simple: the client knows who to call again.</p>
                </div>
            </div>
        </section>

${ctaBand({
            h2: 'Have Something That Needs Attention?',
            body: ['Tell WHT what is happening.'],
            buttons: `${btn.quote()}\n                    ${btn.ondark('Contact WHT', 'contact')}`,
        })}`,
    },

    /* -------------------------------------------------------
       PAGE 10 — CONTACT   (Standard Content template, Tab 8 form)
       ------------------------------------------------------- */
    {
        key: 'contact',
        label: 'Contact',
        title: 'Contact WHT Electrical | Gauteng',
        description: 'Contact WHT Electrical for electrical, solar, plumbing and maintenance services across Gauteng and nationally.',
        crumbs: [HOME, { key: 'contact', label: 'Contact' }],
        body: (page) => `${pageHero(page, {
            h1: 'Tell Us What&rsquo;s Happening',
            question: 'Need electrical, solar, plumbing or property maintenance help?',
            lead: ['Tell WHT about the problem or project and we can help determine the appropriate next step.'],
        })}
        <section id="enquiry" class="wht-section" aria-label="Contact details and enquiry form">
            <div class="wht-container wht-contact-grid">
                <div>
                    <h2 class="wht-title">Contact Details</h2>
                    <ul class="wht-contact__list">
                        <li>${ic('phone')}
                            <span><strong>Call WHT</strong>
                                <a href="tel:${SITE.tel1}" data-wht-event="click_call">${SITE.phone1}</a><br>
                                <a href="tel:${SITE.tel2}" data-wht-event="click_call">${SITE.phone2}</a>
                            </span>
                        </li>
                        <li>${ic('wa')}
                            <span><strong>WhatsApp</strong>
                                <a href="https://wa.me/${SITE.wa}" target="_blank" rel="noopener" data-wht-event="click_whatsapp">WhatsApp WHT</a>
                            </span>
                        </li>
                        <li>${ic('mail')}
                            <span><strong>Email</strong>
                                <a href="mailto:${SITE.email}" data-wht-event="click_email">${SITE.email}</a>
                            </span>
                        </li>
                        <li>${ic('globe')}
                            <span><strong>Website</strong>www.whtelectrical.co.za</span>
                        </li>
                        <li>${ic('pin')}
                            <span><strong>Visit</strong>
                                <address>${SITE.street}<br>${SITE.suburb}<br>${SITE.town}<br>${SITE.region}</address>
                            </span>
                        </li>
                        <li>${ic('building')}
                            <span><strong>Service Area</strong>Based in Benoni and serving clients throughout Gauteng, with national project capability.</span>
                        </li>
                        <!-- BUSINESS HOURS: Tab 12 lists hours as still to be confirmed by WHT. Add a
                             "Hours" row here once confirmed, and openingHoursSpecification to the schema. -->
                    </ul>

                    <div class="wht-support">
                        <h3>Not Sure Which Service to Choose?</h3>
                        <p>That is fine.</p>
                        <p>Describe the problem in your own words and WHT can help identify which service is relevant.</p>
                    </div>
                </div>

                <div>
                    <!-- In WordPress, replace this with an Elementor Form / WPForms / CF7 form so submissions
                         are stored, emailed and the photo upload is handled. Keep the same fields (Tab 8).
                         Fire quote_submit + generate_lead on the plugin's success event. -->
                    <form class="wht-form" id="wht-quote-form" method="post" action="#" enctype="multipart/form-data" novalidate aria-labelledby="wht-form-title">
                        <h2 class="wht-form__title" id="wht-form-title">How Can WHT Help?</h2>
                        <p class="wht-form__req"><span class="req" aria-hidden="true">*</span> Required field</p>

                        <div class="wht-form__row">
                            <div class="wht-field">
                                <label for="wf-name">Name <span class="req" aria-hidden="true">*</span></label>
                                <input id="wf-name" name="name" type="text" autocomplete="name" required>
                            </div>
                            <div class="wht-field">
                                <label for="wf-mobile">Mobile Number <span class="req" aria-hidden="true">*</span></label>
                                <input id="wf-mobile" name="mobile" type="tel" inputmode="tel" autocomplete="tel" required>
                            </div>
                        </div>
                        <div class="wht-form__row">
                            <div class="wht-field">
                                <label for="wf-email">Email</label>
                                <input id="wf-email" name="email" type="email" autocomplete="email">
                            </div>
                            <div class="wht-field">
                                <label for="wf-area">Area / Suburb <span class="req" aria-hidden="true">*</span></label>
                                <input id="wf-area" name="area" type="text" autocomplete="address-level2" required>
                            </div>
                        </div>
                        <div class="wht-field">
                            <label for="wf-service">What Do You Need Help With? <span class="req" aria-hidden="true">*</span></label>
                            <select id="wf-service" name="service" required>
                                <option value="">Select a service&hellip;</option>
${['Electrical', 'Fault Finding', 'Electrical COC', 'Gate Motor', 'Electric Fencing', 'Solar &amp; Backup Power', 'Plumbing', 'Property Maintenance', 'Other']
            .map((o) => `                                <option>${o}</option>`).join('\n')}
                            </select>
                        </div>
                        <div class="wht-field">
                            <label for="wf-message">Tell Us What&rsquo;s Happening <span class="req" aria-hidden="true">*</span></label>
                            <textarea id="wf-message" name="message" required></textarea>
                        </div>
                        <div class="wht-field">
                            <label for="wf-photo">Upload a Photo <span class="wht-optional">Optional</span></label>
                            <input id="wf-photo" name="photo" type="file" accept="image/*">
                        </div>

                        <div class="wht-hp" aria-hidden="true">
                            <label for="wf-website">Website</label>
                            <input id="wf-website" name="website" type="text" tabindex="-1" autocomplete="off">
                        </div>

                        <button class="wht-btn wht-btn--primary wht-btn--block" type="submit">Send My Enquiry ${ic('arrow', 'wht-icon')}</button>
                        <p class="wht-form__status" id="wht-form-status" role="status" aria-live="polite"></p>
                    </form>
                </div>
            </div>
        </section>
`,
    },
];

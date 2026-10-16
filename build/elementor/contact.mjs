/* Contact page as an Elementor template. Copy is the approved Tab 5 copy. */
import { box, heading, text, dims } from './lib.mjs';
import { pageHero, enquiryForm, contactDetails } from './sections.mjs';

export const title = 'WHT — Contact';

export const build = () => [

    pageHero({
        h1: 'Tell Us What&rsquo;s Happening',
        question: 'Need electrical, solar, plumbing or property maintenance help?',
        lead: ['Tell WHT about the problem or project and we can help determine the appropriate next step.'],
        crumbs: [{ key: 'home', label: 'Home' }, { key: 'contact', label: 'Contact' }],
    }),

    box({
        cls: 'wht-section', anchor: 'enquiry', tag: 'section', label: 'Contact details and enquiry',
        pad: dims(88, 22, 88, 22), padM: dims(56, 22, 56, 22),
    }, [
        box({ cls: 'wht-container wht-contact-grid', label: 'Contact grid' }, [

            box({ label: 'Left column — details' }, [
                heading('Contact Details', { tag: 'h2', cls: 'wht-title', label: 'Contact Details heading' }),
                contactDetails(),

                box({ cls: 'wht-support', label: 'Not sure which service' }, [
                    heading('Not Sure Which Service to Choose?', { tag: 'h3', label: 'Support heading' }),
                    text('<p>That is fine.</p>', { label: 'Support line 1' }),
                    text('<p>Describe the problem in your own words and WHT can help identify which service is relevant.</p>',
                        { label: 'Support line 2' }),
                ]),
            ]),

            box({ label: 'Right column — form' }, [
                enquiryForm(),
            ]),
        ]),
    ]),
];

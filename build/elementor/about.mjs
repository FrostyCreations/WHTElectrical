/* About WHT as an Elementor template (Standard Content template).
   Copy is the approved Tab 5 copy from build/pages.mjs.

   Both photographs are real WHT work photographs, deliberately not a
   portrait: the copy beside them is about Wayne personally, and a stock
   portrait there would be a fabricated picture of a named real person.
   Swap in the photos of Wayne and early WHT when WHT supplies them. */
import { text, dims } from './lib.mjs';
import {
    pageData, pageHero, section, col, eyebrow, h2, prose, photo, bullets, points, ctaBand,
    quoteBtn, ondarkBtn,
} from './sections.mjs';
import { SITE } from '../layout.mjs';

export const title = 'WHT — About';
const page = pageData('about');

export const build = () => [

    pageHero({
        h1: 'About WHT Electrical',
        question: SITE.tagline,
        lead: ['WHT Electrical was built from the ground up around practical skill, problem-solving and the satisfaction of helping people get things working again.'],
        crumbs: page.crumbs,
    }),

    /* The beginning */
    section({ label: 'The beginning', grid: true }, [
        col({ cls: 'wht-prose', label: 'Story' }, [
            eyebrow('The beginning'),
            h2('A New Direction', { id: 'wht-begin-title', cls: 'wht-title' }),
            prose([
                'Before entering the electrical trade, Wayne spent twelve years working for a Swiss printing company.',
                'When the company began closing down, he had to decide what came next.',
                'A conversation with his father-in-law introduced him to a new opportunity. His father-in-law&rsquo;s brother was an electrician, and in 2010 Wayne began an apprenticeship with him.',
                'At the same time, Wayne was attending night classes, developing practical experience and adjusting to life as a new father.',
                ['wht-emph', 'The foundations of WHT were taking shape.'],
            ]),
        ]),
        col({ label: 'Photo' }, [
            photo('electrical', { alt: 'A WHT electrician at work on a newly installed conduit run' }),
        ]),
    ]),

    /* Building WHT */
    section({ alt: true, label: 'Building WHT', grid: true }, [
        col({ label: 'Photo' }, [
            photo('commercial', { alt: 'Solar panels covering the roof of a commercial building, installed by WHT' }),
        ]),
        col({ cls: 'wht-prose', label: 'Story' }, [
            eyebrow('Building WHT'),
            h2('One Job at a Time', { id: 'wht-build-title', cls: 'wht-title' }),
            prose([
                'The beginning was simple.',
                ['wht-emph', 'An old Hilux bakkie. One team member. Real work that needed to be done properly.'],
                'Over time, WHT grew through hands-on experience, continued learning and clients who returned when they needed help again.',
                'Electrical work remained at the heart of the business, while the service offering expanded into solar and backup power, plumbing and property maintenance.',
            ]),
        ]),
    ]),

    /* Why problem-solving matters */
    section({ extra: 'wht-brand', label: 'Why problem-solving matters', grid: true }, [
        col({ label: 'Copy' }, [
            eyebrow('Why problem-solving matters'),
            h2('Finding the Cause Changes the Outcome', { id: 'wht-why-title' }),
            prose([
                'One of the most satisfying parts of the work has always been solving the problem that is disrupting someone&rsquo;s day.',
                'Sometimes that means restoring hot water.',
                'Another job may involve finding the cause of a recurring electrical fault or helping a business regain reliable power.',
                'That practical sense of responsibility continues to shape the way WHT works today.',
            ]),
        ]),
        col({ label: 'Points' }, [
            points(['Listen to the problem.', 'Assess what is happening.', 'Explain the recommended solution.', 'Do the work with care.']),
        ]),
    ]),

    /* Who WHT serves */
    section({ label: 'Who WHT serves', grid: true, top: true }, [
        col({ label: 'Heading' }, [
            eyebrow('Who WHT serves'),
            h2('From Homes to Commercial Properties', { id: 'wht-serves-title', cls: 'wht-title' }),
            text('<p>WHT works across:</p>', { cls: 'wht-lead', label: 'Lead' }),
            text('<p>WHT is based in Benoni and serves clients throughout Gauteng, with national project capability.</p>',
                { cls: 'wht-note', margin: dims(24, 0, 0, 0), label: 'Note' }),
        ]),
        col({ label: 'List' }, [
            bullets(['Residential properties', 'Businesses', 'Commercial environments', 'Industrial sites', 'Complexes and estates', 'Managed properties', 'Landlord portfolios', 'Property and facilities requirements']),
        ]),
    ]),

    /* The WHT approach */
    section({ alt: true, label: 'The WHT approach' }, [
        col({ cls: 'wht-prose', label: 'Approach copy' }, [
            eyebrow('The WHT approach'),
            h2('Practical Service Built Around the Client', { id: 'wht-approach-title', cls: 'wht-title' }),
            prose([
                'WHT aims to make technical and property problems easier to deal with.',
                'That means clear communication, practical recommendations and a focus on solving the actual problem in front of the client.',
                ['wht-emph', 'The strongest sign of trust is often simple: the client knows who to call again.'],
            ]),
        ]),
    ]),

    ctaBand({
        h2: 'Have Something That Needs Attention?',
        body: ['Tell WHT what is happening.'],
        buttons: [quoteBtn(), ondarkBtn('Contact WHT', 'contact')],
    }),
];

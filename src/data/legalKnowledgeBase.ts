export type IntentType =
    | 'greeting'
    | 'visa_b1b2'
    | 'visa_f1'
    | 'visa_h1b'
    | 'green_card_marriage'
    | 'green_card_family'
    | 'green_card_employment'
    | 'asylum'
    | 'citizenship'
    | 'deportation'
    | 'pricing'
    | 'consultation'
    | 'timeline'
    | 'documents'
    | 'contact'
    | 'unknown';

export interface LegalResponse {
    text: string;
    suggestions: string[];
    action?: {
        label: string;
        link: string;
    };
}

export const LEGAL_KNOWLEDGE_BASE: Record<IntentType, LegalResponse> = {
    greeting: {
        text: "Hello! I'm the M&T Immigration Legal Assistant. I can provide general information about immigration services, help you understand visa types, or assist you in scheduling a consultation with our attorneys.\n\n**Please note:** I am an AI, not a lawyer. My responses are for informational purposes only and do not constitute legal advice.",
        suggestions: ["What services do you offer?", "How much is a consultation?", "I need a Green Card"]
    },
    visa_b1b2: {
        text: "**B1/B2 Visitor Visa Information:**\n\nThis visa is for temporary travel to the U.S. for business (B1) or tourism/medical purposes (B2).\n\n• **Key Requirement:** You must prove \"non-immigrant intent\" (strong ties to your home country).\n• **Our Service:** We help draft invitation letters, review your DS-160 application, and provide a 1-hour mock interview session to prepare you for consular questions.\n• **Legal Fee:** Starting at $350.",
        suggestions: ["Book a consultation", "What documents do I need?", "Check B1/B2 Timeline"],
        action: { label: "Book B1/B2 Consult", link: "#contact" }
    },
    visa_f1: {
        text: "**F-1 Student Visa Guide:**\n\nFor international students admitted to a U.S. school.\n\n• **Process:** Accepted by school -> Receive Form I-20 -> Pay SEVIS Fee -> Apply for F-1 Visa -> Interview.\n• **Common Issues:** Proving financial ability and intent to return home.\n• **How We Help:** We review your financial evidence and prepare you for the \"intent\" questions at the embassy.",
        suggestions: ["Can I work on F-1?", "What is OPT?", "Book Student Consulation"],
        action: { label: "Student Visa Help", link: "#contact" }
    },
    visa_h1b: {
        text: "**H-1B Specialty Occupation Visa:**\n\nFor professionals in specialty fields (tech, engineering, medicine, etc.).\n\n• **The Lottery:** Most applicants typically go through a lottery system in March.\n• **Requirements:** Bachelor's degree or higher and a valid job offer.\n• **Status:** We assist employers with registration and petition filing.",
        suggestions: ["When is the H-1B lottery?", "H-1B Cap Exempt?", "Contact an Attorney"],
        action: { label: "Contact for H-1B", link: "#contact" }
    },
    green_card_marriage: {
        text: "**Marriage-Based Green Card:**\n\nOne of the most common paths to permanent residency. Process differs if you are inside (Adjustment of Status) or outside (Consular Processing) the US.\n\n• **Key Form:** I-130 (Petition for Alien Relative).\n• **Critical Element:** Proving a \"bona fide\" (real) marriage through evidence like joint bank accounts, photos, and leases.\n• **Our Fee:** $1,800 - $3,500 depending on complexity.",
        suggestions: ["What evidence is needed?", "How long does it take?", "Schedule Marriage Consult"],
        action: { label: "Start Marriage Case", link: "#contact" }
    },
    green_card_family: {
        text: "**Family-Based Immigration:**\n\nUS Citizens can petition for: Spouses, Children, Parents, and Siblings.\nGreen Card holders can petition for: Spouses and Unmarried Children.\n\n• **Priority Dates:** Immediate relatives of citizens have no wait for a visa number. Others must wait for their \"Priority Date\" to become current in the Visa Bulletin.",
        suggestions: ["Check Visa Bulletin", "Petition for Parent", "Petition for Sibling"]
    },
    green_card_employment: {
        text: "**Employment-Based Green Cards:**\n\n• **EB-1:** Extraordinary Ability / Multinational Managers.\n• **EB-2:** Advanced Degree / National Interest Waiver (NIW).\n• **EB-3:** Skilled/Unskilled Workers.\n\nMany categories require a PERM Labor Certification to prove no US workers are available.",
        suggestions: ["What is NIW?", "Do I need a sponsor?", "Book Strategy Session"]
    },
    asylum: {
        text: "**Asylum & Refugee Status:**\n\nProtection for those unable to return to their home country due to persecution based on race, religion, nationality, membership in a particular social group, or political opinion.\n\n• **Deadline:** Must generally apply within 1 year of arriving in the US.\n• **Process:** Affirmative (with USCIS) or Defensive (in Immigration Court).\n• **Support:** We help craft your personal statement and prepare comprehensive country condition packages.",
        suggestions: ["What forms do I file?", "Can I work while waiting?", "Urgent Consultation"],
        action: { label: "Get Asylum Help", link: "#contact" }
    },
    citizenship: {
        text: "**Naturalization (Citizenship):**\n\nThe final step for Green Card holders!\n\n• **Requirements:** 5 years as extensive resident (3 years if married to US Citizen), good moral character, pass English/Civics test.\n• **Benefits:** Vote, US Passport, No deportation risk.\n• **Our Fee:** Flat rate $950 for straightforward cases.",
        suggestions: ["When can I apply?", "Practice Civics Test", "Start N-400"]
    },
    deportation: {
        text: "**Deportation Defense:**\n\nIf you are facing removal proceedings, **timing is critical**.\n\n• **You have rights:** You have the right to an attorney (though the government won't pay for one).\n• **Possible Defenses:** Cancellation of Removal, Asylum, Waivers, or Adjustment of Status.\n\n*Please schedule an urgent consultation immediately.*",
        suggestions: ["Urgent Consultation", "Call Attorney Now", "What are my rights?"],
        action: { label: "EMERGENCY CONSULT", link: "#contact" }
    },
    pricing: {
        text: "**Transparent Low-Bono Pricing:**\n\nWe believe in affordable justice. Examples of our legal fees:\n\n• **Consultation:** $20 (15m) / $40 (30m) - *Credited to your case!*\n• **Visitor Visa:** $350+\n• **Work Permit:** $250+\n• **Fiancé Visa:** $950+\n• **Marriage Green Card:** $1,800+\n\n*Does not include USCIS government filing fees.* Payment plans available via Stripe.",
        suggestions: ["Book Consultation", "Do you take payment plans?", "USCIS Fee questions"],
        action: { label: "View All Pricing", link: "#pricing" }
    },
    consultation: {
        text: "**Book a Consultation:**\n\nSpeak with a licensed attorney to analyze your case.\n\n1. **Select Duration:** 15 min ($20) or 30 min ($40).\n2. **Choose Method:** Zoom, WhatsApp, or Phone.\n3. **Get Advice:** We'll review your documents and propose a clear legal strategy.\n\n*The consultation fee is deducted from your total legal bill if you hire us.*",
        suggestions: ["Schedule Now", "Call Office", "Available times"],
        action: { label: "Book Appointment", link: "#contact" }
    },
    timeline: {
        text: "**Processing Timelines:**\n\nTimelines vary significantly by case type and service center.\n\n• **Visitor Visa:** 2-6 weeks (interview wait times vary).\n• **Work Permit:** 3-7 months.\n• **Marriage Green Card:** 10-24 months.\n• **Asylum:** 2-5+ years (backlogged).\n\nWe provide real-time tracking for all our clients.",
        suggestions: ["Check my case status", "Expedite request?", "Talk to a lawyer"]
    },
    documents: {
        text: "**General Document Checklist:**\n\nFor most cases, you will need:\n\n• Valid Passport\n• Birth Certificate (translated)\n• Marriage Certificate (if applicable)\n• Proof of Financial Support (Bank statements, Tax returns)\n• Passport-style Photos\n\n*We provide a secure client portal for easy document upload.*",
        suggestions: ["How to translate documents?", "Upload portal login", "Consultation"]
    },
    contact: {
        text: "**Contact M&T Immigration:**\n\n📍 **Office:** New York, NY (Virtual services globally)\n📞 **Phone:** (555) 123-4567\n📧 **Email:** help@mtimmigration.com\n\nBusiness Hours: Mon-Fri, 9AM - 6PM EST.",
        suggestions: ["Call Now", "Email Us", "Book Online"],
        action: { label: "Go to Contact Form", link: "#contact" }
    },
    unknown: {
        text: "I am specifically trained in US Immigration Law, but I'm not sure I understand that specific question.\n\nCould you rephrase it? You can ask about **Visas**, **Green Cards**, **Asylum**, **Pricing**, or **Citizenship**.\n\nOr, would you like to speak to a human attorney?",
        suggestions: ["Speak to Attorney", "Show Services", "Pricing"],
        action: { label: "Book Consultation", link: "#contact" }
    }
};

export function detectIntent(message: string): IntentType {
    const msg = message.toLowerCase();

    // Urgent / Defense
    if (msg.includes('deport') || msg.includes('remove') || msg.includes('court') || msg.includes('police') || msg.includes('arrest') || msg.includes('judge')) return 'deportation';
    if (msg.includes('asylum') || msg.includes('refugee') || msg.includes('fear') || msg.includes('torture') || msg.includes('persecut')) return 'asylum';

    // Green Cards
    if (msg.includes('marriage') || msg.includes('spouse') || msg.includes('husband') || msg.includes('wife') || msg.includes('finance') || msg.includes('couple')) return 'green_card_marriage';
    if (msg.includes('brother') || msg.includes('sister') || msg.includes('parent') || msg.includes('child') || msg.includes('relative') || msg.includes('family')) return 'green_card_family';
    if (msg.includes('investor') || msg.includes('niw') || msg.includes('extraordinary') || msg.includes('perm') || msg.includes('labor') || msg.includes('eb-')) return 'green_card_employment';
    if (msg.includes('green card') || msg.includes('permanent residen') || msg.includes('adjustment')) return 'green_card_marriage'; // Default to marriage if vague

    // Visas
    if (msg.includes('student') || msg.includes('study') || msg.includes('f1') || msg.includes('f-1') || msg.includes('university') || msg.includes('college') || msg.includes('opt') || msg.includes('cpt')) return 'visa_f1';
    if (msg.includes('visit') || msg.includes('tourist') || msg.includes('travel') || msg.includes('b1') || msg.includes('b2') || msg.includes('vacation')) return 'visa_b1b2';
    if (msg.includes('work') || msg.includes('job') || msg.includes('h1b') || msg.includes('h-1b') || msg.includes('employ') || msg.includes('occupation')) return 'visa_h1b';

    // Citizenship
    if (msg.includes('citizen') || msg.includes('naturaliz') || msg.includes('n400') || msg.includes('n-400') || msg.includes('passport') || msg.includes('vote')) return 'citizenship';

    // Logistics
    if (msg.includes('price') || msg.includes('cost') || msg.includes('fee') || msg.includes('money') || msg.includes('pay') || msg.includes('rate')) return 'pricing';
    if (msg.includes('time') || msg.includes('long') || msg.includes('wait') || msg.includes('month') || msg.includes('year') || msg.includes('clock') || msg.includes('status')) return 'timeline';
    if (msg.includes('document') || msg.includes('form') || msg.includes('paper') || msg.includes('certificate') || msg.includes('evidence')) return 'documents';
    if (msg.includes('contact') || msg.includes('email') || msg.includes('phone') || msg.includes('call') || msg.includes('address') || msg.includes('office') || msg.includes('locate')) return 'contact';
    if (msg.includes('consult') || msg.includes('appoint') || msg.includes('sched') || msg.includes('meet') || msg.includes('book') || msg.includes('speak')) return 'consultation';

    // Greetings
    if (msg.match(/^(hi|hello|hey|greetings|hola|good morning|good afternoon)/)) return 'greeting';

    return 'unknown';
}

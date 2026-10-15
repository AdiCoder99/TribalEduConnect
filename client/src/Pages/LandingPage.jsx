import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  Landmark,
  ShieldCheck,
  Globe,
  PhoneCall,
  Megaphone,
  ChevronRight,
  Plus,
  Minus,
  Lock,
} from 'lucide-react';

import logo from '../assets/assets.js';

/*
  Design tokens
  Palette is taken from Gond folk art: peacock teal, marigold, berry, on a cool off-white.
  Type: Bitter (headings) + Mukta (body). Mukta has full Devanagari support, so Hindi
  text renders in the same family as English.
*/
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bitter:wght@500;700;800&family=Mukta:wght@400;500;600;700&display=swap');

.tec {
  --teal: #0E4D52;
  --teal-deep: #093A3E;
  --teal-tint: #E2ECEA;
  --gold: #F2B01E;
  --gold-dark: #D99A0B;
  --berry: #9B2257;
  --ink: #12262A;
  --muted: #4A5F63;
  --bg: #F6F8F7;
  --line: #C9D7D4;
  font-family: 'Mukta', system-ui, sans-serif;
  background: var(--bg);
  color: var(--ink);
  line-height: 1.6;
}
.tec .display { font-family: 'Bitter', Georgia, serif; letter-spacing: -0.01em; }
.tec .btn {
  display: inline-flex; align-items: center; gap: .5rem;
  padding: .65rem 1.2rem; border-radius: 4px;
  font-weight: 600; font-size: .95rem; cursor: pointer;
  transition: background-color .15s, color .15s, border-color .15s;
}
.tec .btn-gold { background: var(--gold); color: var(--ink); }
.tec .btn-gold:hover { background: var(--gold-dark); }
.tec .btn-teal { background: var(--teal); color: #fff; }
.tec .btn-teal:hover { background: var(--teal-deep); }
.tec .btn-outline { border: 1.5px solid currentColor; }
.tec .btn-outline:hover { background: rgba(255,255,255,.1); }
.tec .btn-outline-dark { border: 1.5px solid var(--line); color: var(--ink); background: #fff; }
.tec .btn-outline-dark:hover { border-color: var(--teal); color: var(--teal); }
.tec .nav-link { padding: .35rem 0; border-bottom: 2px solid transparent; font-weight: 500; }
.tec .nav-link:hover { border-bottom-color: var(--gold); }
.tec :focus-visible { outline: 3px solid var(--gold); outline-offset: 2px; }
/* The one decorative motif: a Gond-style dotted line */
.tec .dots {
  height: 10px;
  background-image: radial-gradient(circle, var(--gold) 2.2px, transparent 2.7px);
  background-size: 16px 10px;
  background-repeat: repeat-x;
  background-position: center;
}
.tec .tricolor {
  height: 4px;
  background: linear-gradient(to right, #FF9933 0 33.3%, #fff 33.3% 66.6%, #138808 66.6% 100%);
}
`;

const features = [
  {
    id: 'dbt',
    short: 'Direct payments',
    title: 'Scholarship money goes straight to your bank account',
    desc: 'Sanctioned funds move from the Ministry through the Aadhaar Payment Bridge (APBS) to the bank account you have linked with Aadhaar. Your institution does not handle the money, and every payment is recorded in an audit ledger.',
    specs: [
      ['Payment route', 'Ministry grant, then APBS, then student account'],
      ['Account check', 'Automatic NPCI mapper check before payout'],
      ['Record keeping', 'Tamper-proof ledger for auditors'],
    ],
  },
  {
    id: 'rag',
    short: 'Ask in your language',
    title: 'Ask about eligibility in the language you speak',
    desc: 'The guidance assistant reads state and central tribal welfare gazettes and answers by voice or text. Each answer points to the scheme rule it comes from.',
    specs: [
      ['Languages', 'Hindi, Gondi, Santhali, English and more'],
      ['Sources', 'Cites the gazette clause behind each answer'],
      ['Speed', 'Answers in under a second'],
    ],
  },
  {
    id: 'rbac',
    short: 'Separate access',
    title: 'Each person sees only what their role needs',
    desc: 'Students, district nodal officers and ministry auditors work in separate spaces. Personal data is encrypted, and an officer can only open applications from their own district.',
    specs: [
      ['Login', 'Token-based sessions with role checks'],
      ['Personal data', 'Encrypted at rest'],
      ['Standard', 'National portal security guidelines'],
    ],
  },
  {
    id: 'vault',
    short: 'Document vault',
    title: 'Upload your documents once, reuse them every year',
    desc: 'Caste, income and academic certificates are checked against state registries and DigiLocker, then stored with a fingerprint so any later change is detected. Renewal needs only a new marksheet.',
    specs: [
      ['Verification', 'SHA-256 hash match on every file'],
      ['Sources', 'State revenue records and DigiLocker'],
      ['Renewal', 'Existing records carry over each year'],
    ],
  },
];

const steps = [
  ['Register', 'Sign up with your Aadhaar and college enrolment details.'],
  ['Upload documents', 'Add income, sub-caste and academic certificates. They are checked automatically.'],
  ['District review', 'A nodal officer in your district verifies your application.'],
  ['Receive payment', 'Approved funds arrive in your Aadhaar-linked bank account.'],
];

const faqs = [
  ['What is TribalEduConnect?', 'A single portal for Scheduled Tribe (ST) students to find scholarships, verify documents and receive grants under Ministry of Tribal Affairs schemes.'],
  ['I do not read English well. Can I still use it?', 'Yes. You can type or speak your question in Hindi, Gondi, Santhali or English, and the assistant explains the rules in plain language.'],
  ['How will I receive my scholarship?', 'Approved funds are sent through the Aadhaar Payment Bridge (APBS) to your Aadhaar-linked bank account. Check that the link is active before you apply.'],
  ['Which documents do I need?', 'Your Aadhaar, income certificate, sub-caste certificate and proof of enrolment. You upload them once, and they stay verified for later years.'],
];

const example = {
  hi: {
    q: 'पोस्ट-मैट्रिक छात्रवृत्ति के लिए मुझे कौन-से कागज़ चाहिए?',
    a: 'आपको जाति प्रमाण पत्र, आय प्रमाण पत्र, कॉलेज में नामांकन का प्रमाण और आधार से जुड़ा बैंक खाता चाहिए। एक बार अपलोड करने पर ये अगले साल भी काम आएँगे।',
  },
  en: {
    q: 'Which documents do I need for the post-matric scholarship?',
    a: 'You need a caste certificate, an income certificate, proof of enrolment, and a bank account linked to Aadhaar. Once uploaded, they carry over to next year.',
  },
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dbt');
  const [activeFaq, setActiveFaq] = useState(0);
  const [lang, setLang] = useState('hi');
  const [textScale, setTextScale] = useState(100);

  useEffect(() => {
    document.documentElement.style.fontSize = `${textScale}%`;
    return () => { document.documentElement.style.fontSize = ''; };
  }, [textScale]);

  const active = features.find((f) => f.id === activeTab);

  return (
    <div className="tec min-h-screen">
      <style>{styles}</style>

      {/* Utility bar */}
      <div className="tricolor" />
      <div className="text-sm" style={{ background: 'var(--ink)', color: '#D5E0DE' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <span className="font-semibold">Government of India &nbsp;|&nbsp; Ministry of Tribal Affairs</span>
          <div className="flex items-center gap-5">
            <span className="hidden sm:flex items-center gap-1">
              Text size
              {[['A-', 90], ['A', 100], ['A+', 115]].map(([label, v]) => (
                <button
                  key={label}
                  onClick={() => setTextScale(v)}
                  aria-pressed={textScale === v}
                  className="px-1.5 font-bold hover:text-white"
                  style={textScale === v ? { color: 'var(--gold)' } : undefined}
                >
                  {label}
                </button>
              ))}
            </span>
            <a href="tel:1800110000" className="flex items-center gap-1.5 hover:text-white">
              <PhoneCall className="w-3.5 h-3.5" /> Helpline 1800-11-0000
            </a>
            <button className="flex items-center gap-1.5 hover:text-white">
              <Globe className="w-3.5 h-3.5" /> English / हिंदी
            </button>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white sticky top-0 z-50" style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-6">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 text-left">
            <img src={logo.icon} alt="TribalEduConnect" className="w-16" />
            <span>
              <span className="display block text-xl font-bold leading-tight" style={{ color: 'var(--teal)' }}>
                TribalEduConnect
              </span>
              <span className="block text-[13px] leading-tight" style={{ color: 'var(--muted)' }}>
                Scholarships and direct payments for ST students
              </span>
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-7 text-[15px]">
            <a href="#about" className="nav-link">About</a>
            <a href="#modules" className="nav-link">How it works</a>
            <a href="#steps" className="nav-link">Apply</a>
            <a href="#faq" className="nav-link">Help</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button onClick={() => navigate('/login')} className="btn btn-outline-dark">
              <Lock className="w-4 h-4" /> Log in
            </button>
            <button onClick={() => navigate('/register')} className="btn btn-teal hidden sm:inline-flex">
              Register
            </button>
          </div>
        </div>
      </header>

      {/* Notice */}
      <div style={{ background: '#FBF0D0', borderBottom: '1px solid #EBD79A' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-start gap-3 text-[15px]">
          <Megaphone className="w-4 h-4 mt-1.5 shrink-0" style={{ color: 'var(--berry)' }} />
          <p>
            <strong>Applications are open</strong> for Post-Matric and Higher Education Scholarships 2026–27.
            Link your Aadhaar to your bank account before you apply.
          </p>
        </div>
      </div>

      {/* Hero */}
      <section style={{ background: 'var(--teal)', color: '#fff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <h1 className="display text-4xl sm:text-5xl font-extrabold leading-[1.12]">
              Apply for your scholarship in your own language.
            </h1>
            <p className="mt-6 text-lg max-w-xl" style={{ color: '#CFE3E0' }}>
              One portal to find the schemes you qualify for, verify your documents once, and get
              the money directly in your bank account. No agents, no middlemen.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => navigate('/register')} className="btn btn-gold text-base">
                Register as a student
              </button>
              <button onClick={() => navigate('/login')} className="btn btn-outline text-base">
                Officer login
              </button>
            </div>
            <ul className="mt-10 space-y-1 text-[15px]" style={{ color: '#CFE3E0' }}>
              <li>Already registered?</li>
              <li>
                <button onClick={() => navigate('/login')} className="underline underline-offset-4 hover:text-white">
                  Check your application status
                </button>
                {'  '}or{'  '}
                <button onClick={() => navigate('/login')} className="underline underline-offset-4 hover:text-white">
                  verify your Aadhaar-bank link
                </button>
              </li>
            </ul>
          </div>

          {/* Sample conversation */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-xl overflow-hidden" style={{ color: 'var(--ink)', boxShadow: '0 20px 50px -20px rgba(0,0,0,.45)' }}>
              <div className="px-5 py-3 flex items-center justify-between gap-3" style={{ background: 'var(--teal-tint)', borderBottom: '1px solid var(--line)' }}>
                <span className="flex items-center gap-2 font-semibold">
                  <Bot className="w-5 h-5" style={{ color: 'var(--teal)' }} /> Guidance assistant
                </span>
                <div className="flex gap-1.5" role="group" aria-label="Example language">
                  {[['hi', 'हिंदी'], ['en', 'English']].map(([k, label]) => (
                    <button
                      key={k}
                      onClick={() => setLang(k)}
                      aria-pressed={lang === k}
                      className="px-3 py-1 rounded text-sm font-semibold"
                      style={lang === k ? { background: 'var(--teal)', color: '#fff' } : { background: '#fff', border: '1px solid var(--line)' }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-5 space-y-4">
                <p className="ml-auto max-w-[85%] rounded-lg rounded-br-sm px-4 py-3" style={{ background: 'var(--gold)' }}>
                  {example[lang].q}
                </p>
                <p className="max-w-[92%] rounded-lg rounded-bl-sm px-4 py-3" style={{ background: 'var(--teal-tint)' }}>
                  {example[lang].a}
                </p>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                  Example answer. The live assistant also speaks Gondi and Santhali, and shows the gazette rule behind each reply.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="dots" />
      </section>

      {/* About */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <h2 className="display text-3xl font-bold leading-snug">Less paperwork, fewer trips to the district office</h2>
          <p className="mt-4" style={{ color: 'var(--muted)' }}>
            Many students in remote areas drop out of higher education because applying is
            confusing and payments arrive late. The portal is built to fix both.
          </p>
        </div>
        <div className="lg:col-span-8" style={{ borderTop: '2px solid var(--ink)' }}>
          {[
            [Bot, 'Understand the rules', 'Ask eligibility questions by voice or text. The assistant matches your situation to the scheme guidelines and answers in plain language.'],
            [Landmark, 'Get paid directly', 'Scholarship funds go from the treasury to your Aadhaar-linked bank account. No one in between can hold or delay them.'],
            [ShieldCheck, 'Verify once', 'Upload caste, income and academic certificates one time. Verified records stay saved for every renewal.'],
          ].map(([Icon, title, text]) => (
            <div key={title} className="py-6 flex gap-5" style={{ borderBottom: '1px solid var(--line)' }}>
              <Icon className="w-7 h-7 shrink-0 mt-1" style={{ color: 'var(--teal)' }} />
              <div>
                <h3 className="display text-xl font-bold">{title}</h3>
                <p className="mt-1 max-w-2xl" style={{ color: 'var(--muted)' }}>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section id="modules" style={{ background: 'var(--teal-tint)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <h2 className="display text-3xl font-bold">What runs behind the portal</h2>
          <p className="mt-2 max-w-2xl" style={{ color: 'var(--muted)' }}>
            Four parts work together to keep applications fast, private and auditable.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-8">
            <div role="tablist" aria-label="Portal modules" className="md:col-span-4 flex md:flex-col gap-2 overflow-x-auto">
              {features.map((f) => {
                const on = f.id === activeTab;
                return (
                  <button
                    key={f.id}
                    role="tab"
                    aria-selected={on}
                    onClick={() => setActiveTab(f.id)}
                    className="flex items-center justify-between gap-3 px-4 py-3.5 text-left font-semibold rounded whitespace-nowrap md:whitespace-normal"
                    style={on
                      ? { background: 'var(--teal)', color: '#fff' }
                      : { background: '#fff', border: '1px solid var(--line)' }}
                  >
                    {f.short}
                    <ChevronRight className="w-4 h-4 shrink-0 hidden md:block" style={{ color: on ? 'var(--gold)' : 'var(--muted)' }} />
                  </button>
                );
              })}
            </div>

            <div role="tabpanel" className="md:col-span-8 bg-white rounded-lg p-7" style={{ border: '1px solid var(--line)' }}>
              <h3 className="display text-2xl font-bold leading-snug">{active.title}</h3>
              <p className="mt-3 max-w-2xl" style={{ color: 'var(--muted)' }}>{active.desc}</p>
              <dl className="mt-6" style={{ borderTop: '1px solid var(--line)' }}>
                {active.specs.map(([k, v]) => (
                  <div key={k} className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4" style={{ borderBottom: '1px solid var(--line)' }}>
                    <dt className="font-semibold">{k}</dt>
                    <dd className="sm:col-span-2" style={{ color: 'var(--muted)' }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section id="steps" className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="display text-3xl font-bold">Four steps from registration to payment</h2>
        <ol className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6 relative">
          <div className="hidden md:block absolute left-0 right-0 top-5 h-0.5" style={{ background: 'var(--line)' }} aria-hidden="true" />
          {steps.map(([title, text], i) => (
            <li key={title} className="relative">
              <span
                className="display w-10 h-10 rounded-full flex items-center justify-center font-bold relative"
                style={i === steps.length - 1
                  ? { background: 'var(--gold)', color: 'var(--ink)' }
                  : { background: 'var(--teal)', color: '#fff' }}
              >
                {i + 1}
              </span>
              <h3 className="display text-lg font-bold mt-4">{title}</h3>
              <p className="mt-1" style={{ color: 'var(--muted)' }}>{text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ background: '#fff', borderTop: '1px solid var(--line)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <h2 className="display text-3xl font-bold">Common questions</h2>
            <p className="mt-3" style={{ color: 'var(--muted)' }}>
              Still stuck? Call the toll-free helpline on 1800-11-0000 and ask in your own language.
            </p>
          </div>
          <div className="lg:col-span-8" style={{ borderTop: '2px solid var(--ink)' }}>
            {faqs.map(([q, a], i) => {
              const open = activeFaq === i;
              return (
                <div key={q} style={{ borderBottom: '1px solid var(--line)' }}>
                  <button
                    onClick={() => setActiveFaq(open ? -1 : i)}
                    aria-expanded={open}
                    className="w-full flex items-center justify-between gap-4 py-5 text-left text-lg font-semibold"
                  >
                    {q}
                    {open
                      ? <Minus className="w-5 h-5 shrink-0" style={{ color: 'var(--berry)' }} />
                      : <Plus className="w-5 h-5 shrink-0" style={{ color: 'var(--teal)' }} />}
                  </button>
                  {open && <p className="pb-5 max-w-2xl" style={{ color: 'var(--muted)' }}>{a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--teal)', color: '#fff' }}>
        <div className="dots" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="display text-2xl sm:text-3xl font-bold">Ready to apply?</h2>
            <p className="mt-2 max-w-xl" style={{ color: '#CFE3E0' }}>
              Keep your Aadhaar and bank passbook handy. Registration takes a few minutes.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/login')} className="btn btn-outline">Log in</button>
            <button onClick={() => navigate('/register')} className="btn btn-gold">Register now</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--ink)', color: '#A9BBB8' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-[15px]">
          <div>
            <p className="display font-bold text-white text-lg">TribalEduConnect</p>
            <p className="mt-2">Built for Smart India Hackathon 2026 under Ministry of Tribal Affairs directives.</p>
          </div>
          <div>
            <p className="font-semibold text-white mb-2">Portal</p>
            <ul className="space-y-1">
              <li><a href="#about" className="hover:text-white">About</a></li>
              <li><a href="#steps" className="hover:text-white">How to apply</a></li>
              <li><a href="#faq" className="hover:text-white">Help</a></li>
            </ul>
          </div>
          <div className="md:text-right">
            <p className="font-semibold text-white mb-2">Support</p>
            <p>Toll-free 1800-11-0000</p>
            <p className="mt-4 text-sm">© 2026 TribalEduConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
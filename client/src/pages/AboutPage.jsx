import { BriefcaseBusiness, HandHeart, ShieldCheck, UsersRound } from 'lucide-react';

const missionPoints = [
  {
    title: 'रोजगार और अवसर',
    text: 'समाज के युवाओं को नए काम, सेवा और व्यवसायिक अवसरों से जोड़ना।',
    icon: BriefcaseBusiness,
  },
  {
    title: 'स्थानीय पहचान',
    text: 'स्थानीय सेवा प्रदाताओं, व्यवसायों और हुनरमंद लोगों को डिजिटल पहचान देना।',
    icon: UsersRound,
  },
  {
    title: 'सामाजिक सहयोग',
    text: 'जरूरतमंद परिवारों तक सही समय पर सहायता और उपयोगी संपर्क पहुँचाना।',
    icon: HandHeart,
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="site-shell max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-800 shadow-sm">
            About Vipra Seva Setu
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            समाज को जोड़ने वाला विश्वसनीय डिजिटल मंच
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-xl leading-8 text-slate-600">
            Vipra Seva Setu is a modern community platform for services, employment, business visibility, and social support.
          </p>
        </div>

        <section className="mb-8 overflow-hidden rounded-3xl border border-amber-200/60 bg-[linear-gradient(135deg,#431407_0%,#7f1d1d_45%,#172554_100%)] text-white shadow-[0_24px_70px_rgba(69,26,3,0.16)]">
          <div className="grid gap-8 p-8 md:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <span className="inline-flex rounded-full border border-amber-100/30 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-amber-100">
                Our Mission / हमारा ध्येय
              </span>
              <h2 className="mt-5 text-3xl font-extrabold leading-tight md:text-4xl">
                विश्वास, सहयोग और आत्मनिर्भर समाज की दिशा में एक डिजिटल पहल।
              </h2>
              <div className="mt-6 space-y-4 text-base leading-8 text-amber-50/90 md:text-lg">
                <p>
                  विप्र सेवा सेतु समाज को डिजिटल रूप से जोड़ने की एक आधुनिक पहल है, जहाँ रोजगार, सेवाएँ, व्यवसाय और सामाजिक सहयोग एक ही मंच पर उपलब्ध हैं।
                </p>
                <p>
                  हमारा उद्देश्य समाज के युवाओं को नए अवसरों से जोड़ना, स्थानीय सेवा प्रदाताओं को पहचान देना और जरूरतमंद परिवारों तक सहायता पहुँचाना है।
                </p>
                <p>
                  यह प्लेटफॉर्म विश्वास, सहयोग और आत्मनिर्भर समाज की भावना को मजबूत करने के लिए बनाया गया है।
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-300/20 text-amber-100">
                  <ShieldCheck size={25} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Vipra Seva Setu</h3>
                  <p className="text-sm text-amber-50/75">Digital seva, samajik sahyog aur local growth</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {['Trusted community network', 'Local services and businesses', 'Opportunities for youth', 'Support for families'].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/8 px-4 py-3 text-sm font-semibold text-amber-50">
                    <span className="h-2 w-2 rounded-full bg-amber-300" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="mb-8 grid gap-6 md:grid-cols-3">
          {missionPoints.map(({ title, text, icon: Icon }) => (
            <div key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <Icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200/60 md:p-12 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">How It Works</h2>
          <div className="grid gap-6 md:grid-cols-3 mt-6">
            <div className="rounded-2xl bg-slate-50 p-6 border border-slate-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-xl mb-4">1</div>
              <h3 className="font-bold text-slate-900 mb-2">Service Choose Karein</h3>
              <p className="text-sm text-slate-600">Household, Event, Education, Hospital, Property, Hotel ya Other Services me se zarurat ki service select karein.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-6 border border-slate-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-xl mb-4">2</div>
              <h3 className="font-bold text-slate-900 mb-2">Apply / Order</h3>
              <p className="text-sm text-slate-600">Apna naam, mobile number, location aur requirement submit karke request bhejein.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-6 border border-slate-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-xl mb-4">3</div>
              <h3 className="font-bold text-slate-900 mb-2">Connect & Support</h3>
              <p className="text-sm text-slate-600">Relevant provider ya community support aapko contact karega, jisse kaam jaldi aur bharose ke saath ho sake.</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900 p-8 shadow-sm md:p-12 text-white">
          <h2 className="text-2xl font-bold mb-4 text-center">Facilities We Provide</h2>
          <ul className="grid gap-4 md:grid-cols-2 mt-8">
            <li className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
              <div className="h-2 w-2 rounded-full bg-amber-300"></div>
              <span className="font-medium">Verified local service providers</span>
            </li>
            <li className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
              <div className="h-2 w-2 rounded-full bg-amber-300"></div>
              <span className="font-medium">Employment and business visibility</span>
            </li>
            <li className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
              <div className="h-2 w-2 rounded-full bg-amber-300"></div>
              <span className="font-medium">Community support and assistance</span>
            </li>
            <li className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
              <div className="h-2 w-2 rounded-full bg-amber-300"></div>
              <span className="font-medium">Trust-based digital connection</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

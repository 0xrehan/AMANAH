import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  GraduationCap,
  HandHeart,
  Heart,
  HeartHandshake,
  ShieldCheck,
  Users,
  Globe2,
  Sparkles,
  Menu,
} from "lucide-react";

const categories = [
  {
    icon: GraduationCap,
    title: "Education",
    description: "Learn, teach and share knowledge with others.",
    color: "bg-blue-50 text-blue-700",
  },
  {
    icon: BriefcaseBusiness,
    title: "Career & Skills",
    description: "Share professional skills and discover opportunities.",
    color: "bg-amber-50 text-amber-700",
  },
  {
    icon: HandHeart,
    title: "Community Support",
    description: "Support people facing everyday challenges.",
    color: "bg-rose-50 text-rose-700",
  },
  {
    icon: BookOpen,
    title: "Knowledge",
    description: "Exchange useful knowledge and learning resources.",
    color: "bg-violet-50 text-violet-700",
  },
];

const steps = [
  {
    number: "01",
    title: "Create your profile",
    description:
      "Join the community and tell others about your skills and interests.",
  },
  {
    number: "02",
    title: "Give or request help",
    description:
      "Share what you can offer or explain the support you are looking for.",
  },
  {
    number: "03",
    title: "Connect and make an impact",
    description:
      "Connect with people and turn small acts of kindness into meaningful change.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfcf8] text-[#163c30]">
      {/* Announcement */}
      <div className="bg-[#123d30] px-4 py-2.5 text-center text-xs font-medium tracking-wide text-white sm:text-sm">
        A global community built on trust, kindness and shared responsibility.
        <span className="ml-2 text-[#e8c985]">Join the movement →</span>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-[#e8eee7] bg-[#fbfcf8]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#174b39] text-[#f1d59a] shadow-lg shadow-emerald-950/10">
              <HeartHandshake size={25} strokeWidth={1.8} />
            </div>
            <div>
              <div className="text-xl font-bold tracking-[0.12em] text-[#174b39]">
                AMANAH
              </div>
              <div className="text-[9px] font-semibold tracking-[0.22em] text-[#9a8150]">
                COMMUNITY NETWORK
              </div>
            </div>
          </a>

          <nav className="hidden items-center gap-9 text-sm font-medium text-[#61756a] lg:flex">
            <a href="#about" className="transition hover:text-[#174b39]">
              About
            </a>
            <a href="#categories" className="transition hover:text-[#174b39]">
              Explore
            </a>
            <a href="#how-it-works" className="transition hover:text-[#174b39]">
              How it works
            </a>
            <a href="#mission" className="transition hover:text-[#174b39]">
              Our mission
            </a>
          </nav>

          <div className="hidden items-center gap-4 sm:flex">
            <a
              href="#join"
              className="text-sm font-semibold text-[#174b39] transition hover:text-[#b18a48]"
            >
              Log in
            </a>
            <a
              href="#join"
              className="flex items-center gap-2 rounded-full bg-[#174b39] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-950/10 transition hover:-translate-y-0.5 hover:bg-[#205b43]"
            >
              Join Amanah <ArrowUpRight size={16} />
            </a>
          </div>

          <a
            href="#join"
            aria-label="Join Amanah"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#dce7dc] text-[#174b39] sm:hidden"
          >
            <Menu size={21} />
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24">
        <div className="pointer-events-none absolute -right-40 -top-20 h-[480px] w-[480px] rounded-full bg-[#e8efe3] opacity-70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-40 h-[350px] w-[350px] rounded-full bg-[#f3ead6] opacity-50 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#dce8dc] bg-white px-4 py-2 text-xs font-semibold tracking-wide text-[#47745c] shadow-sm">
              <Sparkles size={14} className="text-[#b38c4d]" />
              A NEW WAY TO CONNECT THE UMMAH
            </div>

            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.12] tracking-[-0.055em] text-[#153e30] sm:text-6xl lg:text-[76px]">
              Goodness grows
              <br />
              when we{" "}
              <span className="relative inline-block text-[#b18b4e]">
                help together.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#6b7d72] sm:text-lg">
              A global community where Muslims connect, share their skills,
              support one another and create meaningful change. Because no act
              of kindness is too small.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href="#categories"
                className="flex items-center justify-center gap-3 rounded-full bg-[#174b39] px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-emerald-950/15 transition hover:-translate-y-1 hover:bg-[#205b43]"
              >
                Explore the community <ArrowRight size={18} />
              </a>
              <a
                href="#how-it-works"
                className="flex items-center justify-center rounded-full border border-[#d9e3d9] bg-white px-8 py-4 text-sm font-semibold text-[#315c47] transition hover:border-[#174b39]"
              >
                Discover how it works
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs font-medium text-[#728378]">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#4d8a64]" />
                Always free to use
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#4d8a64]" />
                Built around trust
              </span>
              <span className="flex items-center gap-2">
                <Globe2 size={16} className="text-[#4d8a64]" />
                Open to everyone
              </span>
            </div>
          </div>

          {/* Community visual */}
          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="absolute -right-5 -top-5 h-32 w-32 rounded-full border border-[#d6c49d]/60" />
            <div className="absolute -bottom-7 -left-7 h-36 w-36 rounded-full border border-[#d6c49d]/50" />

            <div className="relative overflow-hidden rounded-[32px] bg-[#174b39] p-7 shadow-2xl shadow-emerald-950/20 sm:p-9">
              <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10" />
              <div className="absolute -right-10 -top-14 h-52 w-52 rounded-full border border-white/10" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-[0.2em] text-[#d9c38e]">
                    THE POWER OF COMMUNITY
                  </span>
                  <Globe2 size={20} className="text-[#e6d19f]" />
                </div>

                <h2 className="mt-10 max-w-sm text-3xl font-medium leading-tight tracking-tight text-white sm:text-4xl">
                  Together, we can make a difference.
                </h2>

                <p className="mt-4 max-w-sm text-sm leading-7 text-[#c6d8ca]">
                  Every skill shared. Every hand extended. Every life touched.
                  It all matters.
                </p>

                <div className="my-9 flex items-center justify-center">
                  <div className="relative flex h-56 w-56 items-center justify-center rounded-full border border-[#d9c38e]/30 bg-white/[0.04]">
                    <div className="absolute h-44 w-44 rounded-full border border-[#d9c38e]/30" />
                    <div className="absolute h-32 w-32 rounded-full border border-[#d9c38e]/40" />
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-[#e5d09c] text-[#174b39] shadow-xl shadow-black/20">
                      <HeartHandshake size={43} strokeWidth={1.5} />
                    </div>
                    <div className="absolute left-0 top-10 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e9f0e4] text-[#174b39] shadow-lg">
                      <BookOpen size={21} />
                    </div>
                    <div className="absolute right-0 top-10 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f3e5c8] text-[#795b2e] shadow-lg">
                      <GraduationCap size={22} />
                    </div>
                    <div className="absolute bottom-2 left-7 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f3e6e4] text-[#8d4d43] shadow-lg">
                      <HandHeart size={21} />
                    </div>
                    <div className="absolute bottom-2 right-7 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#dce9e0] text-[#174b39] shadow-lg">
                      <Users size={21} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/15 pt-6">
                  <div>
                    <div className="text-2xl font-semibold text-white">
                      One Ummah.
                    </div>
                    <div className="mt-1 text-sm text-[#d7c38f]">
                      One shared purpose.
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d9c38e]/50 text-[#e7d39f]">
                    <Heart size={22} />
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-7 -right-2 rounded-2xl border border-[#e5eadd] bg-white px-5 py-4 shadow-xl shadow-emerald-950/10 sm:-right-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e6f0e5] text-[#32724e]">
                  <HandHeart size={21} />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#174b39]">
                    Give a little. Help a lot.
                  </div>
                  <div className="text-xs text-[#849186]">
                    Every contribution matters.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission strip */}
      <section id="mission" className="border-y border-[#e8eee5] bg-white px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
          <div>
            <div className="text-xs font-bold tracking-[0.2em] text-[#ad8b51]">
              OUR BELIEF
            </div>
            <p className="mt-2 text-lg font-medium text-[#234b39] sm:text-xl">
              A stronger community begins with helping one another.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm font-medium text-[#678072]">
            <Heart size={19} className="text-[#b28d4d]" />
            Built on kindness. Guided by responsibility.
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="text-xs font-bold tracking-[0.2em] text-[#ad8b51]">
                EXPLORE AMANAH
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#174b39] sm:text-5xl">
                Many ways to make a difference.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#718076] sm:text-base">
                Everyone has something valuable to offer. Discover ways to
                share what you know and support people who need a helping hand.
              </p>
            </div>
            <a
              href="#join"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#387253] hover:text-[#b18b4e]"
            >
              Become a member <ArrowUpRight size={17} />
            </a>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <article
                  key={category.title}
                  className="group rounded-3xl border border-[#e6ece4] bg-white p-7 transition duration-300 hover:-translate-y-2 hover:border-[#c8d9c9] hover:shadow-xl hover:shadow-emerald-950/5"
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${category.color}`}
                  >
                    <Icon size={27} strokeWidth={1.8} />
                  </div>
                  <h3 className="mt-7 text-lg font-semibold text-[#214b38]">
                    {category.title}
                  </h3>
                  <p className="mt-3 min-h-[60px] text-sm leading-6 text-[#7b887e]">
                    {category.description}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#43805b] transition group-hover:gap-3">
                    Explore <ArrowRight size={16} />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="bg-[#f0f4ed] px-5 py-24 sm:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-bold tracking-[0.2em] text-[#ad8b51]">
              SIMPLE BY DESIGN
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#174b39] sm:text-5xl">
              How AMANAH works
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#718076] sm:text-base">
              Three simple steps to turn your intention into meaningful
              community support.
            </p>
          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <div className="text-5xl font-light tracking-tight text-[#c2a46c]">
                  {step.number}
                </div>
                <div className="mt-6 h-px w-full bg-[#d7e1d4]" />
                <h3 className="mt-7 text-xl font-semibold text-[#214b38]">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-7 text-[#718076]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-5 py-24 sm:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="rounded-[32px] bg-[#174b39] p-9 text-white sm:p-12">
            <div className="text-xs font-bold tracking-[0.2em] text-[#e2cb92]">
              OUR PROMISE
            </div>
            <h2 className="mt-7 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Goodness should never come with a price tag.
            </h2>
            <p className="mt-6 text-sm leading-8 text-[#d0dfd2]">
              AMANAH is built around the belief that community support should
              be accessible. No compulsory subscriptions. No paid memberships.
              Just people helping people.
            </p>
            <div className="mt-9 flex items-center gap-3 border-t border-white/15 pt-7">
              <ShieldCheck size={25} className="text-[#e2cb92]" />
              <span className="text-sm font-medium text-[#e9eee8]">
                Free access is our founding principle.
              </span>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold tracking-[0.2em] text-[#ad8b51]">
              WHY AMANAH
            </div>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-[#174b39] sm:text-5xl">
              A community is only as strong as the care it shares.
            </h2>
            <p className="mt-6 text-base leading-8 text-[#718076]">
              We want to make it easier for people to find help, offer their
              talents and build genuine connections across borders. AMANAH is
              a place where giving and receiving support both matter.
            </p>
            <div className="mt-8 space-y-4">
              {[
                "Connect through skills and knowledge.",
                "Make community support easier to discover.",
                "Build trust through responsible participation.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-[#57916a]"
                  />
                  <span className="text-sm font-medium text-[#486653]">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section id="join" className="px-5 pb-24 sm:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-[#e9efe5] px-7 py-16 text-center sm:px-14 sm:py-20">
          <div className="absolute -left-20 -top-28 h-72 w-72 rounded-full border border-[#c9d7c5]" />
          <div className="absolute -bottom-32 -right-12 h-80 w-80 rounded-full border border-[#c9d7c5]" />
          <div className="relative">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#174b39] text-[#e5cf98]">
              <HeartHandshake size={28} />
            </div>
            <h2 className="mx-auto mt-7 max-w-2xl text-3xl font-semibold tracking-tight text-[#174b39] sm:text-5xl">
              Be part of something meaningful.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#6f8173] sm:text-base">
              Your skills, your time and your kindness can make a difference.
              Join the AMANAH community and help goodness travel further.
            </p>
            <a
              href="mailto:hello@amanah.example"
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#174b39] px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-950/15 transition hover:-translate-y-1 hover:bg-[#205b43]"
            >
              Get involved <ArrowUpRight size={18} />
            </a>
            <p className="mt-5 text-xs font-medium text-[#849184]">
              Free to join. Built for community. Made to help.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#123d30] px-5 py-12 text-white sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-9 md:flex-row">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5cf98] text-[#174b39]">
                <HeartHandshake size={23} />
              </div>
              <span className="text-xl font-bold tracking-[0.12em]">
                AMANAH
              </span>
            </div>
            <p className="mt-5 text-sm leading-7 text-[#c2d5c6]">
              One Ummah. One Network. Endless Good. A community built on
              helping one another.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-12 gap-y-6 text-sm text-[#d1dfd3]">
            <div className="space-y-3">
              <div className="font-semibold text-white">Explore</div>
              <a href="#about" className="block hover:text-[#e5cf98]">
                About us
              </a>
              <a href="#categories" className="block hover:text-[#e5cf98]">
                Categories
              </a>
            </div>
            <div className="space-y-3">
              <div className="font-semibold text-white">Community</div>
              <a href="#how-it-works" className="block hover:text-[#e5cf98]">
                How it works
              </a>
              <a href="#join" className="block hover:text-[#e5cf98]">
                Get involved
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-7xl border-t border-white/15 pt-7 text-xs text-[#a9c0ae]">
          © 2026 AMANAH. Built with care for the Ummah.
        </div>
      </footer>
    </main>
  );
}

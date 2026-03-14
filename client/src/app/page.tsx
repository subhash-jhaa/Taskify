import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import MarketingLayout from '@/components/marketing/MarketingLayout';

export default function HomePage() {
  return (
    <MarketingLayout>
      <div className="space-y-14">
        {/* Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <Badge variant="outline" className="px-3 py-1 text-xs font-semibold">
              Minimal task management for daily work
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
              Organize tasks.
              <br />
              Stay consistent.
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-prose">
              Taskify helps you capture, track, and finish tasks with a clean workflow. No noise—just the essentials.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg">
                <Link href="/register">
                  Get started <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/dashboard">Go to dashboard</Link>
              </Button>
            </div>

            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              {['Fast dashboard for daily check-ins', 'Search and filter tasks by status', 'Dark mode supported'].map(
                (item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 text-primary" />
                    <span>{item}</span>
                  </li>
                ),
              )}
            </ul>
          </div>

          <Card className="rounded-2xl">
            <CardHeader className="[.border-b]:border-border border-b">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-sm font-semibold">Today’s flow</CardTitle>
                  <CardDescription>A simple routine that keeps you moving.</CardDescription>
                </div>
                <Badge variant="secondary" className="mt-0.5">
                  Preview
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {[
                { title: 'Plan weekly priorities', status: 'TODO' as const },
                { title: 'Work on top task (60 min)', status: 'IN PROGRESS' as const },
                { title: 'Review and close completed tasks', status: 'COMPLETED' as const },
              ].map((t) => (
                <div
                  key={t.title}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{t.title}</p>
                    <div className="mt-1">
                      <Badge variant="outline" className="text-[11px] font-semibold">
                        {t.status}
                      </Badge>
                    </div>
                  </div>
                  <span className="h-2.5 w-2.5 rounded-full bg-primary shrink-0" />
                </div>
              ))}
            </CardContent>

            <CardFooter className="border-t border-border pt-6 justify-between gap-3">
              <p className="text-sm font-medium">Start in under a minute</p>
              <Button asChild size="sm">
                <Link href="/register">
                  Sign up <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </section>

        {/* Social proof */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[
            { label: 'Clarity first', value: '3', sub: 'core statuses' },
            { label: 'Minimal UI', value: '0', sub: 'unnecessary panels' },
            { label: 'Quick daily use', value: '60s', sub: 'to get oriented' },
          ].map((s) => (
            <Card key={s.label} className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-base">{s.label}</CardTitle>
                <CardDescription>{s.sub}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black tracking-tight">{s.value}</div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Single-page sections */}
        <section className="space-y-4">
          <div className="max-w-2xl space-y-2">
            <Badge variant="outline" className="px-3 py-1 text-xs font-semibold">
              Features
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Everything you need, nothing you don’t.</h2>
            <p className="text-muted-foreground">A small set of features designed to stay out of your way.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Simple workflow', desc: 'Create tasks, update status, and keep momentum.' },
              { title: 'Search + filters', desc: 'Find tasks quickly by status and keywords.' },
              { title: 'Clean UI', desc: 'Minimal styling that works in light and dark mode.' },
            ].map((f) => (
              <Card key={f.title} className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-base">{f.title}</CardTitle>
                  <CardDescription>{f.desc}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Built with a consistent component system so the UI stays predictable.
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="space-y-4">
          <div className="max-w-2xl space-y-2">
            <Badge variant="outline" className="px-3 py-1 text-xs font-semibold">
              How it works
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">A simple loop you’ll actually follow.</h2>
            <p className="text-muted-foreground">Capture → focus → finish. Repeat daily.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step: '01', title: 'Capture', desc: 'Add tasks quickly without overthinking.' },
              { step: '02', title: 'Focus', desc: 'Move one task to “In progress” and work.' },
              { step: '03', title: 'Finish', desc: 'Mark completed and keep the list clean.' },
            ].map((x) => (
              <Card key={x.step} className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>{x.title}</span>
                    <Badge variant="secondary">{x.step}</Badge>
                  </CardTitle>
                  <CardDescription>{x.desc}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Minimal steps, visible progress, no clutter.
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="space-y-4">
          <div className="max-w-2xl space-y-2">
            <Badge variant="outline" className="px-3 py-1 text-xs font-semibold">
              Pricing
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Start free. Keep it simple.</h2>
            <p className="text-muted-foreground">You can always add paid plans later—this stays minimal for now.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'Starter',
                price: 'Free',
                desc: 'Personal task tracking.',
                highlights: ['Tasks', 'Statuses', 'Search'],
                primary: true,
              },
              {
                title: 'Pro',
                price: '—',
                desc: 'Add later if needed.',
                highlights: ['More projects (soon)', 'More insights (soon)', 'More automations (soon)'],
                primary: false,
              },
              {
                title: 'Team',
                price: '—',
                desc: 'Collaboration (soon).',
                highlights: ['Shared tasks (soon)', 'Roles (soon)', 'Activity (soon)'],
                primary: false,
              },
            ].map((p) => (
              <Card key={p.title} className={`rounded-2xl ${p.primary ? 'border-primary/40' : ''}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-3">
                    <span>{p.title}</span>
                    {p.primary ? <Badge>Recommended</Badge> : <Badge variant="secondary">Minimal</Badge>}
                  </CardTitle>
                  <CardDescription>{p.desc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-black tracking-tight">{p.price}</div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {p.highlights.map((h) => (
                      <li key={h} className="flex items-center justify-between gap-3">
                        <span className="truncate">{h}</span>
                        <span className="text-foreground">✓</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full" variant={p.primary ? 'default' : 'outline'}>
                    <Link href="/register">Get started</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-4">
          <div className="max-w-2xl space-y-2">
            <Badge variant="outline" className="px-3 py-1 text-xs font-semibold">
              FAQ
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Common questions.</h2>
            <p className="text-muted-foreground">Short answers, no fluff.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[
              {
                q: 'Is Taskify free?',
                a: 'Yes. The current experience is designed to be simple and usable without a paywall.',
              },
              {
                q: 'Can I use it on mobile?',
                a: 'Yes. The UI is responsive and keeps the layout minimal on smaller screens.',
              },
              {
                q: 'What’s the workflow?',
                a: 'Tasks move through TODO → IN PROGRESS → COMPLETED.',
              },
              {
                q: 'Do I need to set up anything?',
                a: 'Just create an account and start adding tasks.',
              },
            ].map((x) => (
              <Card key={x.q} className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-base">{x.q}</CardTitle>
                  <CardDescription>{x.a}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <Badge variant="outline" className="px-3 py-1 text-xs font-semibold">
                Ready
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Start with a clean slate.</h2>
              <p className="text-muted-foreground">
                Create your account, add your first task, and keep the workflow simple.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/register">
                  Get started <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <Link href="/login">Sign in</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </MarketingLayout>
  );
}

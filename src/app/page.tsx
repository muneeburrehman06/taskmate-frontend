'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem('token'));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ff2d20]/10 via-white to-[#ff2d20]/10 dark:from-black dark:via-zinc-900 dark:to-black">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-10 py-6">
        <h1 className="text-3xl font-extrabold text-[#ff2d20]">TaskMate</h1>

        <div className="flex gap-4">
          {loggedIn ? (
            <Link href="/tasks" className="btn-outline">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn-outline">
                Login
              </Link>
              <Link href="/register" className="btn-primary">
                SignUp
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="flex flex-col items-center text-center mt-24 px-6">
        <h2 className="text-5xl md:text-6xl font-black leading-tight text-black dark:text-white">
          Organize Your Tasks <br />
          <span className="text-[#ff2d20]">Effortlessly</span>
        </h2>

        <p className="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          TaskMate helps you plan, track, and complete your tasks with ease.
          Simple. Fast. Powerful.
        </p>

        <div className="mt-10 flex gap-4">
          <Link href="/register" className="btn-primary-lg">
            Start Free
          </Link>
          <Link href="/login" className="btn-outline-lg">
            Login
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mt-28 px-10 grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
        <Feature icon="📝" title="Create Tasks" desc="Add tasks instantly and stay organized." />
        <Feature icon="⚡" title="Fast & Secure" desc="Powered by Laravel API & Sanctum." />
        <Feature icon="📱" title="Responsive" desc="Works perfectly on all devices." />
      </section>

      {/* FOOTER */}
      <footer className="mt-32 py-10 text-center text-sm text-gray-500">
        © 2025 TaskMate — Built with using Laravel & Next.js
      </footer>
    </div>
  );
}

/* FEATURE CARD */
function Feature({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="glass-card">
      <div className="text-4xl">{icon}</div>
      <h3 className="mt-4 text-xl font-semibold text-black dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        {desc}
      </p>
    </div>
  );
}

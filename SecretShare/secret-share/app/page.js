import Link from "next/link";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center text-center min-h-[75vh]">
      <h2 className="text-4xl md:text-6xl font-bold mb-6 mt-6 py-4 text-white">
        Secure. Scoped. Shared.
      </h2>
      <p className="text-lg md:text-xl text-white font-semibold max-w-2xl mb-8">
        Share secrets like API keys and credentials with time-limited and usage-limited access — powered by Storacha.
      </p>
      <Link
        href="/agent"
        className="bg-lime-400 hover:bg-lime-300 text-black font-semibold py-3 px-6 rounded-full shadow-lg transition"
      >
        Get Started
      </Link>
    </section>
  );
}

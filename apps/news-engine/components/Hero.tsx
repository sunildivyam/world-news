export default function Hero() {
  return (
    <section className="text-center py-20 px-6">
      <h1 className="text-5xl font-bold tracking-tight">
        Global News API for Developers
      </h1>

      <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
        Fetch breaking news, headlines, and full articles in real-time. Built
        for scale, speed, and production-grade reliability.
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <a
          href="/register"
          className="px-6 py-3 bg-black text-white rounded-xl"
        >
          Get API Key
        </a>

        <a href="#playground" className="px-6 py-3 border rounded-xl">
          Try API
        </a>
      </div>
    </section>
  );
}

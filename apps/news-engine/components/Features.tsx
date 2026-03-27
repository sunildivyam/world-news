const features = [
  {
    title: "Real-time Headlines",
    desc: "Get breaking news as it happens",
  },
  {
    title: "Global Coverage",
    desc: "News from multiple regions and categories",
  },
  {
    title: "High Performance",
    desc: "Optimized for low latency and high throughput",
  },
  {
    title: "Flexible Filters",
    desc: "Filter by category, tags, region, and more",
  },
];

export default function Features() {
  return (
    <section className="px-6">
      <h2 className="text-3xl text-center font-semibold">Why Use Our API?</h2>

      <div className="grid md:grid-cols-4 gap-6 mt-10">
        {features.map((f, i) => (
          <div key={i} className="p-6 border rounded-xl">
            <h3 className="font-semibold text-lg">{f.title}</h3>
            <p className="text-gray-600 mt-2">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

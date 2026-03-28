import { endpoints } from "@/app-constants/endpoints.constants";

export default function Endpoints() {
  return (
    <section className="px-6">
      <h2 className="text-3xl text-center font-semibold">
        Simple & Powerful API
      </h2>

      <div className="mt-8 max-w-xl mx-auto bg-gray-900 text-white p-6 rounded-xl">
        {endpoints.map((ep, i) => (
          <div key={i} className="font-mono text-sm py-1">
            {ep}
          </div>
        ))}
      </div>
    </section>
  );
}

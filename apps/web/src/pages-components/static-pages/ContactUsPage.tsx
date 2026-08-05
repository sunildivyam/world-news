"use client";

import React, { useState, useTransition } from "react";

// Lucide Icons
import {
  Mail,
  Send,
  CheckCircle2,
  Clock,
  MessageSquare,
  Newspaper,
  AlertCircle,
  Loader2,
} from "lucide-react";

// Import your server action here
import { saveContactus } from "@/actions/contact";
import { ScaleIn, SlideUp } from "@worldnews/shared/motion";

interface ContactUsPageProps {
  companyName: string;
  contactEmail: string;
}

export default function ContactUsPage({
  companyName,
  contactEmail,
}: ContactUsPageProps) {
  const pressEmail = contactEmail;

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    startTransition(async () => {
      try {
        const response = await saveContactus(formData);
        if (response?.success) {
          setStatus({
            type: "success",
            message:
              "Thank you for reaching out! Our team will get back to you within 24 hours.",
          });
          setFormData({
            fullName: "",
            email: "",
            subject: "General Inquiry",
            message: "",
          });
        } else {
          setStatus({
            type: "error",
            message:
              "Something went wrong while sending your message. Please try again.",
          });
        }
      } catch (err) {
        setStatus({
          type: "error",
          message: "Failed to connect to server. Please try again later.",
        });
      }
    });
  };

  return (
    <>
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white font-sans antialiased">
        {/* ================= HERO SECTION ================= */}
        <SlideUp
          as="section"
          className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-20 border-b border-slate-800/80 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))]"
        >
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-medium text-blue-400 mb-6 backdrop-blur-md">
              <MessageSquare className="w-3.5 h-3.5" />
              We're Here to Help
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
              Get in Touch with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400">
                {companyName}
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-xl mx-auto">
              Have questions about news source indexing, publisher partnerships,
              or technical support? Drop us a message below.
            </p>
          </div>
        </SlideUp>

        {/* ================= MAIN CONTENT ================= */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Direct Contact Info & Cards */}
              <ScaleIn as="div" className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs font-bold tracking-widest text-blue-400 uppercase">
                    Communication Channels
                  </span>
                  <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Direct Contact Points
                  </h2>
                  <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                    Prefer direct email? Select the appropriate department below
                    to ensure your message reaches the right team quickly.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  {/* General Inquiries */}
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        General & Support
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Platform queries, account issues, and general feedback.
                      </p>
                      <a
                        href={`mailto:${contactEmail}`}
                        className="text-sm font-medium text-blue-400 hover:underline mt-2 inline-block"
                      >
                        {contactEmail}
                      </a>
                    </div>
                  </div>

                  {/* Publisher / Press Inquiries */}
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                      <Newspaper className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        Publishers & Press
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        RSS feed inclusion requests, removals, and media kits.
                      </p>
                      <a
                        href={`mailto:${pressEmail}`}
                        className="text-sm font-medium text-blue-400 hover:underline mt-2 inline-block"
                      >
                        {pressEmail}
                      </a>
                    </div>
                  </div>

                  {/* Response Time Guarantee */}
                  <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 flex items-center gap-3 text-xs text-slate-400">
                    <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>
                      Average response time:{" "}
                      <strong>12 to 24 business hours</strong>.
                    </span>
                  </div>
                </div>
              </ScaleIn>

              {/* Right Column: Contact Form */}
              <ScaleIn as="div" className="lg:col-span-7">
                <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl relative backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Send Us a Message
                  </h3>
                  <p className="text-sm text-slate-400 mb-8">
                    Fill out the fields below and we'll process your request.
                  </p>

                  {/* Success / Error Feedback Banner */}
                  {status && (
                    <div
                      className={`mb-6 p-4 rounded-xl flex items-start gap-3 border text-sm ${
                        status.type === "success"
                          ? "bg-emerald-950/50 border-emerald-800 text-emerald-300"
                          : "bg-rose-950/50 border-rose-800 text-rose-300"
                      }`}
                    >
                      {status.type === "success" ? (
                        <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                      )}
                      <span>{status.message}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Full Name Input */}
                      <div>
                        <label
                          htmlFor="fullName"
                          className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
                        >
                          Your Name <span className="text-blue-400">*</span>
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Jane Doe"
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                        />
                      </div>

                      {/* Email Input */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
                        >
                          Email Address <span className="text-blue-400">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="jane@example.com"
                          className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                        />
                      </div>
                    </div>

                    {/* Subject Selection */}
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
                      >
                        Inquiry Topic
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Publisher Feed Request">
                          Publisher Feed Inclusion Request
                        </option>
                        <option value="Copyright or DMCA Notice">
                          Copyright / DMCA Notice
                        </option>
                        <option value="Technical Bug / Feedback">
                          Technical Bug or Feedback
                        </option>
                        <option value="Partnerships">
                          Partnership Inquiry
                        </option>
                      </select>
                    </div>

                    {/* Message Input */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
                      >
                        Message <span className="text-blue-400">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help you..."
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed rounded-xl transition-all shadow-lg shadow-blue-600/25 active:scale-[0.98] gap-2"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </ScaleIn>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

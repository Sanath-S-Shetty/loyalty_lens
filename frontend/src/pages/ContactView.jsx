import React, { useState } from "react";
import { submitContactMessage } from "../services/api";

export default function ContactView() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitContactMessage(formData);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Contact form error:", error);
      alert("Failed to send message. Please verify connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Title Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
          Connect With Us
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight glow-text">
          Contact Support
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Have questions about LoyaltyLens API integrations or enterprise plans? Drop us a line.
        </p>
      </div>

      <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {isSubmitted ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-teal-500/10 border border-teal-500/20 rounded-full flex items-center justify-center mx-auto text-teal-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Message Transmitted Successfully!</h3>
            <p className="text-sm text-gray-400 max-w-sm mx-auto">
              Thank you for reaching out.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="mt-4 px-5 py-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500/20 text-teal-300 font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Your Name <span className="text-teal-400">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder=""
                  className="w-full px-4 py-3 text-sm border border-white/10 rounded-2xl focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 bg-white/5 hover:bg-white/10 transition text-white placeholder:text-white/30"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Email Address <span className="text-teal-400">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder=""
                  className="w-full px-4 py-3 text-sm border border-white/10 rounded-2xl focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 bg-white/5 hover:bg-white/10 transition text-white placeholder:text-white/30"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="subject" className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is this regarding?"
                className="w-full px-4 py-3 text-sm border border-white/10 rounded-2xl focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 bg-white/5 hover:bg-white/10 transition text-white placeholder:text-white/30"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="message" className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Message <span className="text-teal-400">*</span>
              </label>
              <textarea
                id="message"
                required
                rows="5"
                value={formData.message}
                onChange={handleChange}
                placeholder="Type your query in detail here..."
                className="w-full px-4 py-3 text-sm border border-white/10 rounded-2xl focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 bg-white/5 hover:bg-white/10 transition text-white placeholder:text-white/30 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-450 text-black font-extrabold text-xs uppercase tracking-widest transition-all duration-300 shadow-lg shadow-teal-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Transmitting Data...
                </>
              ) : (
                "Submit Message"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

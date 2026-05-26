import React, { useState } from 'react';
import { Mail, Phone, MessageCircle, MapPin } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    alert('Thank you for your message. We will get back to you shortly.');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="site-shell max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700 shadow-sm">
            Contact Us
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Get in Touch
          </h1>
          <p className="mt-4 text-xl text-slate-600">
            Have questions or need assistance? We're here to help.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2">
          {/* Contact Details Card */}
          <div className="rounded-3xl bg-blue-600 p-8 shadow-sm md:p-10 text-white">
            <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
            <p className="text-blue-100 mb-8 leading-relaxed">
              Reach out to us through any of the channels below. Our support team is available 24/7 to answer your queries and provide assistance.
            </p>

            <div className="space-y-6">
              <a href="tel:+919462874574" className="flex items-center gap-4 hover:bg-white/10 p-3 rounded-2xl transition-colors">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <Phone className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-sm text-blue-200">Phone</p>
                  <p className="font-bold text-lg">+91 94628 74574</p>
                </div>
              </a>

              <a href="mailto:support@viprasevasetu.com" className="flex items-center gap-4 hover:bg-white/10 p-3 rounded-2xl transition-colors">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <Mail className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-sm text-blue-200">Email</p>
                  <p className="font-bold text-lg">support@viprasevasetu.com</p>
                </div>
              </a>

              <a href="https://wa.me/919462874574" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 hover:bg-white/10 p-3 rounded-2xl transition-colors">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500 shadow-md">
                  <MessageCircle className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-sm text-blue-200">WhatsApp</p>
                  <p className="font-bold text-lg">Chat with us</p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-3 rounded-2xl">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <MapPin className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-sm text-blue-200">Office</p>
                  <p className="font-bold text-lg">MATHS Point, Near Fumes Flames, RK Colony, Bhilwara, Rajasthan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200/60 md:p-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-slate-900 px-8 py-4 font-bold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

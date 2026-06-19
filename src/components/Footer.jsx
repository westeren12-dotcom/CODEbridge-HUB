import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Twitter, Github, Linkedin, Youtube, Instagram, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div>
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                                <BookOpen size={20} className="text-white" />
                            </div>
                            <span className="font-display font-bold text-xl text-white">
                                CODE<span className="text-blue-400">bridge</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Premium SAT prep and IT skills platform. Master the skills that change your future.
                        </p>
                        <div className="flex items-center gap-3">
                            {[
                                { icon: Twitter, href: "#", label: "Twitter" },
                                { icon: Github, href: "#", label: "GitHub" },
                                { icon: Linkedin, href: "#", label: "LinkedIn" },
                                { icon: Youtube, href: "#", label: "YouTube" },
                                { icon: Instagram, href: "#", label: "Instagram" },
                            ].map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-blue-600 flex items-center justify-center text-slate-400 hover:text-white transition-all"

                                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Courses */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Courses</h3>
                        <ul className="space-y-3">
                            {[
                                ["SAT English", "/sat-english"],
                                ["SAT Math", "/sat-math"],
                                ["IT Developing", "/it-developing"],
                                ["Practice Center", "/practice"],
                                ["SAT Analytics", "/analytics"],
                            ].map(([label, to]) => (
                                <li key={label}>
                                    <Link to={to} className="text-slate-400 hover:text-blue-400 text-sm transition-colors">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Account</h3>
                        <ul className="space-y-3">
                            {[
                                ["Dashboard", "/dashboard"],
                                ["Profile", "/profile"],
                                ["Login", "/login"],
                                ["Register", "/register"],
                            ].map(([label, to]) => (
                                <li key={label}>
                                    <Link to={to} className="text-slate-400 hover:text-blue-400 text-sm transition-colors">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Contact</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-slate-400 text-sm">
                                <Mail size={14} />
                                <a href="mailto:hello@codebridgehub.com" className="hover:text-blue-400 transition-colors">
                                    hello@codebridgehub.com
                                </a>
                            </li>
                        </ul>
                        <div className="mt-6">
                            <h4 className="text-white text-sm font-medium mb-2">Stay Updated</h4>
                            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="flex-1 min-w-0 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                />
                                <button type="submit" className="px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm text-white font-medium transition-colors">
                                    Go
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm">© 2024 CODEbridge HUB. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Privacy Policy</a>
                        <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Phone, Mail, MapPin } from 'lucide-react';
import { firmConfig } from '@/config/firm';
import { SiteLogo } from '@/components/branding/SiteLogo';

const footerLinks = {
    services: [
        { name: "Visitor Visas (B1/B2)", href: "/#services" },
        { name: "Student Visas (F-1)", href: "/#services" },
        { name: "Marriage-Based", href: "/#services" },
        { name: "Asylum & U-Visa", href: "/#services" },
        { name: "Work Permits (EAD)", href: "/#services" },
    ],
    company: [
        { name: "About the Practice", href: "/#about" },
        { name: "Our Process", href: "/#process" },
        { name: "Client Experience", href: "/#testimonials" },
        { name: "Contact", href: "/#contact" },
    ],
    support: [
        { name: "Pricing & Fees", href: "/#pricing" },
        { name: "FAQ", href: "/#faq" },
        { name: "Book Consultation", href: "/#contact" },
        { name: "Brief Break", href: "/brief-break" },
    ],
    legal: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Use", href: "/terms" },
        { name: "Attorney Advertising", href: "/terms" },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-black text-white">
            {/* Main Footer */}
            <div className="container-wide py-16">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-6">
                    {/* Brand Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="col-span-2 md:col-span-1"
                    >
                        <Link href="/" className="flex items-center gap-3 mb-5 group">
                            <SiteLogo
                                imageClassName="border-white/10 shadow-md group-hover:scale-105 transition-transform"
                                nameClassName="text-base text-white"
                            />
                        </Link>
                        <p className="text-sm text-zinc-400 leading-relaxed mb-5">
                            Boutique, attorney-led immigration representation with direct communication, transparent fees, and focused case strategy.
                        </p>
                        <div className="space-y-2">
                            <a href={firmConfig.contact.emailHref} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                                <Mail size={14} />
                                {firmConfig.contact.email}
                            </a>
                            <a href={firmConfig.contact.phoneHref} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                                <Phone size={14} />
                                {firmConfig.contact.phoneDisplay}
                            </a>
                            <p className="flex items-center gap-2 text-sm text-zinc-400">
                                <MapPin size={14} />
                                {firmConfig.contact.city}
                            </p>
                        </div>
                    </motion.div>

                    {/* Services Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 }}
                    >
                        <h3 className="font-semibold text-xs text-white uppercase tracking-wide mb-4">Services</h3>
                        <ul className="space-y-2">
                            {footerLinks.services.map((link, i) => (
                                <li key={i}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                                    >
                                        {link.name}
                                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Company Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <h3 className="font-semibold text-xs text-white uppercase tracking-wide mb-4">Company</h3>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link, i) => (
                                <li key={i}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                                    >
                                        {link.name}
                                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Support Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 }}
                    >
                        <h3 className="font-semibold text-xs text-white uppercase tracking-wide mb-4">Support</h3>
                        <ul className="space-y-2">
                            {footerLinks.support.map((link, i) => (
                                <li key={i}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                                    >
                                        {link.name}
                                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Legal Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className="font-semibold text-xs text-white uppercase tracking-wide mb-4">Legal</h3>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link, i) => (
                                <li key={i}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                                    >
                                        {link.name}
                                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Bar - Apple Style */}
            <div className="border-t border-zinc-800">
                <div className="container-wide py-6">
                    {/* Disclaimer */}
                    <p className="text-[11px] text-zinc-500 leading-relaxed mb-4">
                        ATTORNEY ADVERTISING. The information on this website is for general information purposes only. Nothing on this site should be taken as legal advice for any individual case or situation. This information is not intended to create, and receipt or viewing does not constitute, an attorney-client relationship. Prior results do not guarantee a similar outcome.
                    </p>

                    {/* Copyright & Links */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-[11px] text-zinc-500">
                        <p>Copyright © {new Date().getFullYear()} {firmConfig.name}. All rights reserved.</p>
                        <div className="flex items-center gap-4">
                            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <span className="text-zinc-700">|</span>
                            <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
                            <span className="text-zinc-700">|</span>
                            <Link href="/sitemap.xml" className="hover:text-white transition-colors">Site Map</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

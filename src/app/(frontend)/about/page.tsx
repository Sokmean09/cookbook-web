"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { SiGithub, SiLinkedin, SiX, SiFacebook, SiInstagram } from "react-icons/si";

export default function About() {
	
	return (
		<div className="min-h-screen flex flex-col">
			{/* Hero */}
			<section className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-500 text-white py-40 text-center">
				<h1 className="text-5xl font-extrabold mb-16">About Cookbook</h1>
				<p className="max-w-2xl mx-auto text-2xl">
					We created Cookbook to make it easier for people to share, discover,
					and enjoy recipes from around the world with different cultures and
					traditions. Our mission is to inspire home cooks and food enthusiasts
					to explore new flavors and culinary techniques.
				</p>
			</section>

			{/* CTA */}
			<section className="py-40 px-6 text-center">
				<h2 className="text-2xl font-bold mb-4">Want to Join Our Community?</h2>
				<p className="mb-6 text-gray-600">
					Share your own recipes and explore thousands of dishes from home cooks
					worldwide.
				</p>
				<Button asChild>
					<Link href="/recipes">Start Exploring</Link>
				</Button>
			</section>

			{/* Contact */}
			<section className="py-40 px-6 bg-gray-100">
				<h2 className="text-3xl font-bold mb-6 text-center">Contact Us</h2>
				<form className="max-w-2xl mx-auto space-y-4">
					<div>
						<Input type="text" placeholder="Name" required />
					</div>
					<div>
						<Input type="email" placeholder="Email" required />
					</div>
					<div>
						<Textarea placeholder="Message" rows={5} required />
					</div>
					<div className="text-center">
						<Button type="submit" className="w-full sm:w-auto">
							Send Message
						</Button>
					</div>
				</form>

				{/* Social Links */}
				<div className="mt-8 flex justify-center gap-6">
					<a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
						<SiFacebook size={32} className="text-gray-700 hover:text-blue-600 transition" />
					</a>
					<a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
						<SiX size={32} className="text-gray-700 hover:text-sky-500 transition" />
					</a>
					<a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
						<SiInstagram size={32} className="text-gray-700 hover:text-pink-500 transition" />
					</a>
					<a href="https://github.com" target="_blank" rel="noopener noreferrer">
						<SiGithub size={32} className="text-gray-700 hover:text-gray-900 transition" />
					</a>
					<a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
						<SiLinkedin size={32} className="text-gray-700 hover:text-blue-700 transition" />
					</a>
				</div>

			</section>

		</div>
	);
}

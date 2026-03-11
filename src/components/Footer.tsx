import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-10 px-6">
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

                <div>
                    <h2 className="text-xl font-semibold text-white mb-3">
                        Neuro Slides
                    </h2>
                    <p className="text-sm text-gray-400">
                        Create professional presentations in seconds with AI-powered tools.
                    </p>
                </div>

                <div>
                    <h3 className="text-white font-semibold mb-3">Quick Links</h3>
                    <ul className="space-y-3 text-sm">
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/" className="hover:text-white cursor-pointer">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/workspace" className="hover:text-white cursor-pointer">
                                    Workspace
                                </Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="hover:text-white cursor-pointer">
                                    Pricing
                                </Link>
                            </li>
                        </ul>
                    </ul>
                </div>

                <div>
                    <h3 className="text-white font-semibold mb-3">About</h3>
                    <p className="text-sm text-gray-400">
                        Neuro Slides helps students, professionals, and teams build
                        beautiful presentations quickly and easily.
                    </p>
                </div>

            </div>

            <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Neuro Slides. All rights reserved.
            </div>
        </footer>
    );
}
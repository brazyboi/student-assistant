import { Button } from "@/components/ui/button";

export default function LandingNavBar() {
    return (
        <nav className="border-b border-secondary bg-background sticky top-0 z-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-16">
                    {/* Left: Logo/Home */}
                    <div className="flex items-center">
                        <a href="/" className="text-xl font-bold text-primary transition">
                            logo
                        </a>
                    </div>

                    {/* Right: GitHub and Login */}
                    <div className="flex items-center gap-4 ml-auto">
                        <a 
                            href="#" 
                            className="text-primary hover:text-primary transition font-medium"
                        >
                            back to top
                        </a>
                        <a 
                            href="#features" 
                            className="text-primary hover:text-accent transition font-medium"
                        >
                            features
                        </a>
                        <a 
                            href="#about" 
                            className="text-primary hover:text-accent transition font-medium"
                        >
                            about
                        </a>
                        {/* GitHub Link */}
                        <a 
                            href="https://github.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:text-accent transition"
                            aria-label="GitHub"
                        >
                            source code
                        </a>

                        {/* Login Button */}
                        <Button 
                            variant="outline"
                            onClick={() => window.location.href = "/login"}
                            className="hidden sm:inline-flex"
                        >
                            Login
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
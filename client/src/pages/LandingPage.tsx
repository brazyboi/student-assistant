import React from "react";
import LandingNavBar from "@/components/landingpage/LandingNavBar";
import GetStartedButton from "@/components/landingpage/GetStartedButton";

export default function LandingPage() {
    return (
        <React.Fragment>
            <LandingNavBar />
            <div className="max-w-3xl mx-auto">
                <main className="min-h-screen w-full">
                    {/* Hero Section */}
                    <section className="py-20 px-4 text-center">
                        <h1>
                            <b>ai socratic tutor for students</b>
                        </h1>
                        <p className="text-right text-1xl max-w-2xl mx-auto mb-8">
                            maximize your thinking 
                        </p>
                        <GetStartedButton />
                    </section>

                    {/* Features Section */}
                    <section id="features" className="py-20 px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">
                            features
                        </h2>
                        Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
                    </section>

                    {/* About Section */}
                    <section id="about" className="py-20 px-4">
                        <h2 className="text-3xl font-bold text-foreground text-center mb-12">
                            about
                        </h2>
                        <p>
                            This started off as .
                            Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
                        </p>
                    </section>
                </main>
            </div>
        </React.Fragment>
    );
};
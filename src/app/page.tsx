import About from "@/components/About/About";
import Approach from "@/components/Approach/Approach";
import BerryStage from "@/components/Berry/BerryStage";
import Familiar from "@/components/Familiar/Familiar";
import Faq from "@/components/Faq/Faq";
import Footer from "@/components/Footer/Footer";
import Hero from "@/components/Hero/Hero";
import Navbar from "@/components/Navbar/Navbar";
import Offer from "@/components/Offer/Offer";
import Process from "@/components/Process/Process";
import PromoBanner from "@/components/PromoBanner/PromoBanner";
import Stories from "@/components/Stories/Stories";

export default function Home() {
    return (
        <>
            <Navbar />
            <main>
                <Hero />
                <About />
                <Familiar />
                <Approach />
                <Process />
                <Stories />
                <Offer />
                <Faq />
            </main>
            <Footer />
            <PromoBanner />
            <BerryStage />
        </>
    );
}

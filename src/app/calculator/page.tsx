import type { Metadata } from "next";
import BerryStage from "@/components/Berry/BerryStage";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import PromoBanner from "@/components/PromoBanner/PromoBanner";
import { SketchUnderline } from "@/components/Sketch/Sketch";
import Calculator from "./Calculator";
import styles from "./page.module.css";

export const metadata: Metadata = {
    title: "Kalkulator BMI, PPM i CPM",
    description:
        "Policz swoje BMI, podstawową przemianę materii (PPM) i całkowitą przemianę materii (CPM). Kalkulator NieDiety - dietetyczki klinicznej Kingi Sobańskiej.",
};

export default function CalculatorPage() {
    return (
        <>
            <Navbar home={false} />
            <main className={styles.page}>
                <div className="container">
                    <header className={styles.header}>
                        <h1 className={styles.title}>
                            Policz swoje{" "}
                            <span className={styles.hand}>
                                zapotrzebowanie
                                <SketchUnderline className={styles.underline} seed={6} draw={false} />
                            </span>
                        </h1>
                        <p className={`lead ${styles.lead}`}>
                            Wypełnij dane i poznaj swoje BMI, podstawową przemianę materii (PPM) i całkowitą przemianę materii (CPM).
                        </p>
                    </header>
                    <Calculator />
                </div>
            </main>
            <Footer home={false} cta={false} />
            <PromoBanner home={false} />
            <BerryStage />
        </>
    );
}

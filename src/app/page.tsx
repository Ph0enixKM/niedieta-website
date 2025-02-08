import Image from "next/image";
import styles from "./page.module.css";
import Jumbotron from "@/components/Jumbotron/Jumbotron";
import Store from "@/components/Store/Store";
import BlackWeekBanner from "@/components/BlackWeekBanner/BlackWeekBanner";
import ValentinesCard from "@/components/ValentinesCard/ValentinesCard";
import Offer from "@/components/Offer/Offer";

export default function Home() {
    return (
		<div className="container">
			<Jumbotron />
			<BlackWeekBanner />
			<ValentinesCard />
			<Offer />
			<Store />
		</div>
    );
}

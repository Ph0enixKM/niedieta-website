import Jumbotron from "@/components/Jumbotron/Jumbotron";
import BlackWeekBanner from "@/components/BlackWeekBanner/BlackWeekBanner";
import ValentinesCard from "@/components/ValentinesCard/ValentinesCard";
import Offer from "@/components/Offer/Offer";
import Navbar from "@/components/Navbar/Navbar";

export default function Home() {
    return (
		<div className="container">
			<Navbar />
			<Jumbotron />
			<BlackWeekBanner />
			<ValentinesCard />
			<Offer />
		</div>
    );
}

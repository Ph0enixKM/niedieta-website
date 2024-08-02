import Image from "next/image";
import styles from "./page.module.css";
import Jumbotron from "@/components/Jumbotron/Jumbotron";
import Store from "@/components/Store/Store";

export default function Home() {
    return (
		<div className="container">
			<Jumbotron />
			<Store />
		</div>
    );
}

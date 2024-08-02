import Image from "next/image";
import styles from "./page.module.css";
import Jumbotron from "@/components/Jumbotron/Jumbotron";

export default function Home() {
    return (
		<div className="container">
			<div className={styles.logo}>
				<Image src="/logo.svg" alt="Logo" width={200} height={50} />
			</div>
			<Jumbotron />
		</div>
    );
}

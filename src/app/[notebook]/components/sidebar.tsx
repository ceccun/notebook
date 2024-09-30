import React from "react";
import styles from "./sidebar.module.css";
import { Button } from "@/app/components/button";
import { PenLine, Search } from "lucide-react";
import { DropdownHolder } from "@/app/components/dropdown";
import { Alert } from "./alert";

export const LeftSidebar = () => {
	return (
		<section className={styles.sidebar}>
			<div className={styles.header}>
				<DropdownHolder label="University Notebook" />
				<div className={styles.actionStrip}>
					<Button label="Search" image={<Search size={16} />} />
					<Button label="New note" image={<PenLine size={16} />} />
				</div>
			</div>

			<Alert title="Welcome to your Notebook">
				Brainstorm, type, write, collaborate and share your ideas all from your
				Notebook across all your devices.
			</Alert>
		</section>
	);
};

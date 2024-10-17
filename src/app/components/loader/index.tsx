import React from "react";
import loader from "./loader.png";
import styles from "./loader.module.css";

export const Loader = () => {
	return (
		<div className="loader">
			<img
				className={styles.spin}
				style={{ height: 16, width: 16, display: "block" }}
				src={loader.src}
			/>
		</div>
	);
};

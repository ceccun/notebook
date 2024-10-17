import styles from "./alert.module.css";

export const Alert = ({
	title,
	children,
}: {
	title: string;
	children: string;
}) => {
	return (
		<div className={styles.container}>
			<div className={styles.glow}></div>
			<div className={styles.inner}>
				<h3>{title}</h3>
				<p>{children}</p>
			</div>
		</div>
	);
};

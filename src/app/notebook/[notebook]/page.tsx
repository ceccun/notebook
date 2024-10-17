"use client";
import React, { useEffect, useState } from "react";
import { LeftSidebar } from "../components/sidebar";

const Notebook = ({ params }: { params: { notebook: string } }) => {
	return <LeftSidebar id={params.notebook} />;
};

export default Notebook;

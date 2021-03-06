import React, { useState, useEffect } from "react";
import { getAllCompanies } from "../../services/CompanyService";

import Header from "../header/Header";
import CompanyCard from "./CompanyCard";
import Loader from "../loader/Loader";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import { getLocalStorageData, setLocalStorageData } from "../../services/AuthService";

const Companies = () => {
	const [companies, setCompanies] = useState([]);

	useEffect(() => {
		const companies = getLocalStorageData("companies");

		if (!companies) {
			console.log("Got companies from Firebase");
			getAllCompanies().then((companies) => {
				setCompanies(companies);
				setLocalStorageData("companies", companies);
			});
		} else {
			console.log("Got companies from Local Storage");
			setCompanies(companies);
		}
	}, []);

	return (
		<>
			<Header />

			<Container className="my-4">
				<Row className="">
					{companies.length !== 0 ? (
						companies.map((company, index) => (
							<CompanyCard company={company} key={company.id} delay={index * 100} />
						))
					) : (
						<Loader />
					)}
				</Row>
			</Container>
		</>
	);
};

export default Companies;

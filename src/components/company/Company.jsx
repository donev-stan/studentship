import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { getCompanyByID } from "../../services/CompanyService";
import {
	getInternshipsByCompanyID
} from "../../services/InternshipService";

import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Zoom from "@mui/material/Zoom";

import Header from "../header/Header";
import CompanyInfoCard from "./CompanyInfoCard";
import CompanyAboutCard from "./CompanyAboutCard";
import CompanyCareerCard from "./CompanyCareerCard";
import CompanyContactCard from "./CompanyContactCard";
import CompanyBenefitsCard from "./CompanyBenefitsCard";
import CompanyStackCard from "./CompanyStackCard";

import Loader from "../loader/Loader";

import InternshipCard from "../internship/InternshipCard";
import CompanySubscribeCard from "./CompanySubscribeCard";

import companyImg from "../../images/Company/company.png";
import { getLocalStorageData, getLoggedUser } from "../../services/AuthService";

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

const Company = (props) => {
	const [company, setCompany] = useState({});
	const [companyContacts, setCompanyContacts] = useState({});
	const [companyInfo, setCompanyInfo] = useState({});
	const [offers, setOffers] = useState([]);
	const [error, setError] = useState(true);

	const { id } = useParams();

	useEffect(() => {
		const companies = getLocalStorageData("companies");

		if (!companies) {
			console.log("Got company data from Firebase");
			getCompanyByID(id).then((company) => {
				setCompany(company);

				setCompanyContacts({
					PIC: company.PIC,
					address: company.address,
					telephone: company.telephone,
					websiteURL: company.websiteURL,
				});

				setCompanyInfo({
					founded: company.founded,
					employees: company.employees,
					locations: company.locations,
				});

				setError(false);
			});
		} else {
			console.log("Got company data from Local Storage");
			const company = companies.find((company) => company.id === id);

			setCompany(company);

			setCompanyContacts({
				PIC: company.PIC,
				address: company.address,
				telephone: company.telephone,
				websiteURL: company.websiteURL,
			});

			setCompanyInfo({
				founded: company.founded,
				employees: company.employees,
				locations: company.locations,
			});

			setError(false);
		}

		const internships = getLocalStorageData("internships");
		const companyInternships = internships?.filter(
			(offer) => offer.companyID === company.PIC
		);

		if (!companyInternships) {
			console.log("Got Internships from Firebase");
			getInternshipsByCompanyID(company.PIC).then((offers) => {
				setOffers(offers);
			});
		} else {
			console.log("Got Internships from Local Storage");
			setOffers(companyInternships);
		}
	}, [props.company, id, company.id]);

	const [value, setValue] = useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<>
			<Header />
			<Container className="my-4 text-center">
				{Object.entries(company).length !== 0 ? (
					<>
						<Row>
							<Col>
								<img
									src={
										company.picture === "default"
											? companyImg
											: company.picture
									}
									alt="Company Logo"
									style={{ maxWidth: "100%" }}
								/>
								<h3 className="my-3"> {company.name} </h3>
							</Col>
						</Row>

						<Row className="my-4">
							<Box sx={{ width: "100%" }}>
								<Box
									sx={{
										borderBottom: 1,
										borderColor: "divider",
									}}
								>
									<Tabs
										value={value}
										onChange={handleChange}
										aria-label="basic tabs example"
									>
										<Tab
											label="About and Career"
											{...a11yProps(0)}
										/>
										<Tab
											label="Contacts and Info"
											{...a11yProps(1)}
										/>
										<Tab
											label="Benefits and Tech Stack"
											{...a11yProps(2)}
										/>
									</Tabs>
								</Box>
								<TabPanel
									value={value}
									index={0}
									onClick={window.scrollTo({
										// top: document.body.scrollHeight,
										behavior: "smooth",
									})}
								>
									<Row>
										<Col lg={6}>
											{/* About */}
											{!error && (
												<CompanyAboutCard
													name={company.name}
													about={company.about}
												/>
											)}

											{/* Career */}
											{!error && company.career && (
												<CompanyCareerCard
													career={company.career}
												/>
											)}
										</Col>
										<Col lg={6}>
											{/* Subscribe */}
											{!error &&
												getLoggedUser()?.type !==
													"company" && (
													<CompanySubscribeCard />
												)}

											{offers.length !== 0 ? (
												offers.map((offer) => (
													<>
														<Zoom
															in={true}
															style={{
																transitionDelay:
																	"10ms",
															}}
														>
															<h4>
																Internships
																Offered:
															</h4>
														</Zoom>
														<InternshipCard
															key={offer.id}
															offer={offer}
														/>
													</>
												))
											) : (
												<>
													<h4>
														Internships Offered:
													</h4>
													<h6>No Internships</h6>
												</>
											)}
										</Col>
									</Row>
								</TabPanel>
								<TabPanel value={value} index={1}>
									<Row>
										<Col lg={6}>
											{/* Contacts */}
											{!error && (
												<CompanyContactCard
													name={company.name}
													contacts={companyContacts}
												/>
											)}

											{/* Info */}
											{!error && (
												<CompanyInfoCard
													info={companyInfo}
												/>
											)}
										</Col>

										<Col lg={6}>
											{/* Subscribe */}
											{!error &&
												getLoggedUser()?.type !==
													"company" && (
													<CompanySubscribeCard
														noZoom={true}
													/>
												)}

											{offers.length !== 0 ? (
												offers.map((offer) => (
													<>
														<h4>
															Internships Offered:
														</h4>
														<InternshipCard
															key={offer.id}
															offer={offer}
															noZoom={true}
														/>
													</>
												))
											) : (
												<>
													<h4>
														Internships Offered:
													</h4>
													<h6>No Internships</h6>
												</>
											)}
										</Col>
									</Row>
								</TabPanel>
								<TabPanel value={value} index={2}>
									<Row>
										<Col lg={6}>
											{/* Benefits */}
											{!error && (
												<CompanyBenefitsCard
													benefits={company.benefits}
													key={company.PIC}
												/>
											)}

											{/* Stack */}
											{!error &&
												company.technologies.length !==
													0 && (
													<CompanyStackCard
														stack={
															company.technologies
														}
													/>
												)}
										</Col>
										<Col lg={6}>
											{/* Subscribe */}
											{!getLoggedUser()?.type !==
												"undefined" &&
												getLoggedUser()?.type !==
													"company" && (
													<CompanySubscribeCard
														noZoom={true}
													/>
												)}

											{offers.length !== 0 ? (
												offers.map((offer) => (
													<>
														<h4>
															Internships Offered:
														</h4>
														<InternshipCard
															key={offer.id}
															offer={offer}
															noZoom={true}
														/>
													</>
												))
											) : (
												<>
													<h4>
														Internships Offered:
													</h4>
													<h6>No Internships</h6>
												</>
											)}
										</Col>
									</Row>
								</TabPanel>
							</Box>
						</Row>
					</>
				) : (
					<Loader />
				)}
			</Container>
		</>
	);
};

export default Company;

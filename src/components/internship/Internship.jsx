import React, { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";

import Header from "../header/Header";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/esm/Form";
import Alert from "react-bootstrap/Alert";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import Zoom from "@mui/material/Zoom";

import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import {
	deleteInternship,
	getInternshipByID,
	returnStackWithIcons,
} from "../../services/InternshipService";
import {
	getLocalStorageData,
	getLoggedUser,
	login,
	setLocalStorageData,
} from "../../services/AuthService";
import { bookmarkInternship } from "../../services/StudentService";

import { BsBookmarks, BsFillBookmarksFill } from "react-icons/bs";
import { MdWork } from "react-icons/md";
import { ImHome } from "react-icons/im";
import { GiTemporaryShield } from "react-icons/gi";
import { SiFreelancer } from "react-icons/si";
import { AiOutlineFieldTime } from "react-icons/ai";
import { MdTimer } from "react-icons/md";
import { BiTimeFive } from "react-icons/bi";
import { VscRemoteExplorer } from "react-icons/vsc";

import InternshipApplyCard from "./InternshipApplyCard";
import InternshipCompanyCard from "./InternshipCompanyCard";

import locationImg from "../../images/Internship/location.png";
import updateImg from "../../images/Internship/update.png";
import salaryImg from "../../images/Internship/salary.png";
import Loader from "../loader/Loader";
import { getAllCompanies } from "../../services/CompanyService";
import CommentAdd from "../comment/CommentAdd";
import Comment from "../comment/Comment";

const Internship = () => {
	const { id } = useParams();

	const [offer, setOffer] = useState(null);
	const [company, setCompany] = useState(null);
	const [offerOptions, setOfferOptions] = useState({});
	const [isOwner, setIsOwner] = useState(false);
	const [error, setError] = useState(false);
	const [redirect, setRedirect] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [snackMessage, setSnackMessage] = useState("");

	const [bookmarked, setBookmarked] = useState(false);

	const handleClose = () => setShowModal(false);
	const handleShow = () => setShowModal(true);

	const [open, setOpen] = React.useState(false);

	const handleClick = () => {
		setOpen(true);
	};

	const handleSnackClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpen(false);
	};

	const action = (
		<React.Fragment>
			<IconButton
				size="small"
				aria-label="close"
				color="inherit"
				onClick={handleClose}
			>
				<CloseIcon fontSize="small" />
			</IconButton>
		</React.Fragment>
	);

	useEffect(() => {
		const internships = getLocalStorageData("internships");
		const loggedUser = getLocalStorageData("loggedUser");

		if (!internships) {
			console.log("Got Internship from Firebase");
			getInternshipByID(id)
				.then((offer) => {
					//Check if owner
					if (loggedUser) {
						if (loggedUser?.PIC === offer?.companyID)
							setIsOwner(true);
					}

					// Set Offer Data
					setOffer(offer);

					// Set Offer Options Data
					setOfferOptions(offer.options);

					//Set Company Data
					const companies = getLocalStorageData("companies");
					const company = companies.find(
						(company) => company.PIC === offer.companyID
					);
					setCompany(company);
				})
				.catch((error) => setError(error.message));
		} else {
			console.log("Got Internship from Local Storage");
			const internship = internships.find((offer) => offer.id === id);

			//Check if owner
			if (loggedUser) {
				if (loggedUser?.PIC === internship?.companyID) setIsOwner(true);
			}

			// Set Offer Data
			setOffer(internship);

			// Set Offer Options Data
			setOfferOptions(internship.options);

			//Set Company Data
			let companies = getLocalStorageData("companies");

			const company = companies.find(
				(company) => company.PIC === internship.companyID
			);
			setCompany(company);
		}

		if (
			loggedUser &&
			loggedUser.bookmarks.find((bookmarkID) => bookmarkID === id)
		) {
			setBookmarked(true);
		}
	}, [id]);

	const handleDeleteInternship = () => {
		deleteInternship(offer.id);
		setRedirect(true);
	};

	function onFormSubmit(e) {
		e.preventDefault();

		bookmarkInternship(id, getLoggedUser())
			.then((_) => {
				setBookmarked(!bookmarked);
				if (bookmarked) setSnackMessage("Bookmark Removed!");
				else setSnackMessage("Bookmark Set!");

				handleClick();
				login(getLoggedUser());
			})
			.catch((error) => setError(error.message));
	}

	return (
		<>
			{redirect && <Navigate to={"/company/jobs"} />}

			<Header />

			<Modal
				className="text-center"
				show={showModal}
				onHide={handleClose}
				size="lg"
				aria-labelledby="contained-modal-title-vcenter"
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title>Delete Internship</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<h3 className="text-warning"> Warning! </h3>
					<p style={{ fontSize: "larger" }}>
						You are about to delete the job you offered! <br /> This
						action is irreversible!
					</p>
				</Modal.Body>
				<Modal.Footer>
					<Stack direction="row" spacing={2}>
						<Button
							variant="outlined"
							color="secondary"
							size="large"
							onClick={handleClose}
						>
							Cancel
						</Button>

						<Button
							variant="contained"
							color="error"
							size="large"
							endIcon={<DeleteForeverIcon />}
							onClick={handleDeleteInternship}
						>
							Delete Internship
						</Button>
					</Stack>
				</Modal.Footer>
			</Modal>

			<Zoom in={true} style={{ transitionDelay: "10ms" }}>
				<Container className="my-4">
					{error && (
						<Alert
							key={3}
							variant={"danger"}
							className="text-center"
						>
							{error}
						</Alert>
					)}
					<Row>
						<Col lg={8}>
							{offer ? (
								<>
									<Stack
										direction="row"
										spacing={1}
										className="mt-2"
									>
										<h2>{offer.title} </h2>

										<h4 className="mt-1">
											{getLoggedUser()?.type ===
											"student" ? (
												bookmarked ? (
													<BsFillBookmarksFill
														width={"10px"}
													/>
												) : (
													<BsBookmarks
														width={"10px"}
													/>
												)
											) : null}
										</h4>
									</Stack>

									<hr />

									<Row>
										<Col>
											<p>{offer.description}</p>
										</Col>
									</Row>

									<Row className="mt-2 mb-4">
										<Col>
											{offerOptions.permanent && (
												<span
													style={stackspan}
													className="shadowItem"
												>
													{" "}
													<MdWork /> Permanent Job{" "}
												</span>
											)}
											{offerOptions.temporary && (
												<span
													style={stackspan}
													className="shadowItem"
												>
													{" "}
													<GiTemporaryShield />{" "}
													Temporary Job{" "}
												</span>
											)}
											{offerOptions.freelanceProject && (
												<span
													style={stackspan}
													className="shadowItem"
												>
													{" "}
													<SiFreelancer /> Freelance
													Project{" "}
												</span>
											)}
											{offerOptions.fullTime && (
												<span
													style={stackspan}
													className="shadowItem"
												>
													{" "}
													<BiTimeFive /> Full Time{" "}
												</span>
											)}
											{offerOptions.partTime && (
												<span
													style={stackspan}
													className="shadowItem"
												>
													{" "}
													<AiOutlineFieldTime /> Part
													Time{" "}
												</span>
											)}
											{offerOptions.flexibleTime && (
												<span
													style={stackspan}
													className="shadowItem"
												>
													{" "}
													<MdTimer /> Flexible Time{" "}
												</span>
											)}
											{offerOptions.homeOffice && (
												<span
													style={stackspan}
													className="shadowItem"
												>
													{" "}
													<ImHome /> Home Office{" "}
												</span>
											)}
											{offerOptions.remoteInterview && (
												<span
													style={stackspan}
													className="shadowItem"
												>
													{" "}
													<VscRemoteExplorer /> Remote
													Interview{" "}
												</span>
											)}
										</Col>
									</Row>

									<Row>
										<Col>
											<p>
												<img
													src={locationImg}
													alt="location"
													width="30px"
													height="30px"
												/>{" "}
												&nbsp; Office Location:{" "}
												<strong>
													{" "}
													{offer.officeLocation}{" "}
												</strong>
											</p>
											<p>
												<img
													src={salaryImg}
													alt="salary"
													width="30px"
													height="30px"
												/>{" "}
												&nbsp; Salary from{" "}
												<strong>
													{" "}
													{offer.salaryMin}{" "}
												</strong>{" "}
												to{" "}
												<strong>
													{" "}
													{offer.salaryMax}{" "}
												</strong>{" "}
												(gross)
											</p>
										</Col>
									</Row>

									<Row className="mt-2 mb-4">
										<Col>
											<h5 className="mb-3">
												Technologies:
											</h5>
											{offer?.technologies?.map((tech) =>
												returnStackWithIcons(tech)
											)}
										</Col>
									</Row>

									<Row>
										<Col className="mt-2">
											<p>
												{" "}
												<img
													src={updateImg}
													alt="update"
													width="20px"
													height="20px"
												/>{" "}
												&nbsp; Last Update:{" "}
												{/* {returnReadableDate(offer.lastUpdate)} */}
												{offer.lastUpdate}
											</p>
										</Col>
									</Row>

									<Row className="mt-4">
										<CommentAdd internshipID={id} />
									</Row>
								</>
							) : (
								<Loader />
							)}
						</Col>

						<Col lg={4}>
							{company ? (
								<InternshipCompanyCard companyData={company} />
							) : (
								<Loader />
							)}

							{getLoggedUser()?.type != "undefined" ? (
								getLoggedUser()?.type !== "company" && (
									<InternshipApplyCard />
								)
							) : (
								<Loader />
							)}

							<Row className="text-center mt-4">
								{isOwner && (
									<>
										<Col>
											<Link
												to={`edit`}
												className="decorationNone"
											>
												<Button
													color="warning"
													variant="contained"
													size="large"
													startIcon={<EditIcon />}
													className="shadowItem"
												>
													Edit Offer
												</Button>
											</Link>
										</Col>
										<Col>
											<Button
												color="error"
												variant="contained"
												size="large"
												startIcon={
													<DeleteForeverIcon />
												}
												className="shadowItem"
												onClick={handleShow}
											>
												Delete Offer
											</Button>
										</Col>
									</>
								)}
							</Row>

							{getLoggedUser()?.type === "student" && (
								<Row className="text-center mt-2">
									<Col>
										<Form onSubmit={onFormSubmit}>
											<Button
												className="shadowItem mt-2"
												variant="outlined"
												startIcon={
													bookmarked ? (
														<BookmarkRemoveIcon />
													) : (
														<BookmarkAddIcon />
													)
												}
												size="large"
												color="success"
												type="submit"
											>
												{bookmarked
													? "Remove Bookmark"
													: "Bookmark Job Offer"}
											</Button>
										</Form>
									</Col>
								</Row>
							)}
						</Col>
					</Row>
				</Container>
			</Zoom>

			<Snackbar
				open={open}
				autoHideDuration={2000}
				onClose={handleSnackClose}
				message={snackMessage}
				action={action}
			/>
		</>
	);
};

export default Internship;

const stackspan = {
	marginTop: "5px",
	marginLeft: "5px",
	borderRadius: "16px",
	border: "1px solid #e0e0e0",
	backgroundColor: "#fff",
	padding: "9px",
};

const imgStyles = {
	width: "60px",
	height: "60px",
};

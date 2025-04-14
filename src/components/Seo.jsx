import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";

function Seo({ title, pathSlug, crawl, coverImg, keywords, descriptions }) {
	const updatedKeywords = keywords || descriptions;
	const isIndex = crawl === "no" ? "noindex, nofollow" : "index, follow";
	const isCoverImg = coverImg || "/cover.png";
	const currentURL = window.location.href;
	
	return (
		<Helmet htmlAttributes={{ lang: 'en' }}>
			<title>{title} | Watch HD Movies & TV Shows For Free</title>
			<meta name="robots" content={isIndex} />
			<link rel="canonical" href={currentURL} />
			<meta name="description" content={descriptions} />
			<meta name="keywords" content={updatedKeywords} />

			<meta property="og:type" content="website" />
			<meta property="og:url" content={currentURL} />
			<meta property="og:title" content={`${title} | Watch HD Movies & TV Shows For Free`} />
			<meta property="og:description" content={descriptions} />
			<meta property="og:image" content={isCoverImg} />

			<meta property="twitter:card" content="summary_large_image" />
			<meta property="twitter:url" content={currentURL} />
			<meta property="twitter:title" content={`${title} | Watch HD Movies & TV Shows For Free`} />
			<meta property="twitter:description" content={descriptions} />
			<meta property="twitter:image" content={isCoverImg} />
		</Helmet>
	);
}

Seo.propTypes = {
	title: PropTypes.string.isRequired,
	pathSlug: PropTypes.string,
	crawl: PropTypes.string,
	coverImg: PropTypes.string,
	keywords: PropTypes.string,
	descriptions: PropTypes.string.isRequired
};

Seo.defaultProps = {
	pathSlug: "",
	crawl: "yes",
	coverImg: "",
	keywords: ""
};

export default Seo;

export const seo = ({
	title,
	description,
	keywords,
	image = "https://res.cloudinary.com/duhemkmvl/image/upload/v1762727482/Screenshot_2025-11-10_040319_blnl1g.png",
	url = "http://localhost:3000/",
}: {
	title: string;
	description?: string;
	image?: string;
	url?: string;
	keywords?: string;
}) => {
	const tags = [
		{ title },
		{ name: "description", content: description },
		{ name: "keywords", content: keywords },

		{ name: "twitter:title", content: title },
		{ name: "twitter:description", content: description },
		{ name: "twitter:creator", content: "@tannerlinsley" },
		{ name: "twitter:site", content: "@tannerlinsley" },

		{ name: "twitter:url", content: url },

		{ name: "og:type", content: "website" },
		{ name: "og:title", content: title },
		{ name: "og:description", content: description },
		{ name: "og:url", content: url },

		...(image
			? [
					{ name: "twitter:image", content: image },
					{ name: "twitter:card", content: "summary_large_image" },
					{ name: "og:image", content: image },
				]
			: []),
	];

	return tags;
};

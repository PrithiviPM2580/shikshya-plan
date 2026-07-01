type SEOProps = {
	title: string;
	description?: string;
	keywords?: string;
	image?: string;
	url?: string;
};

export const seoRoot = ({
	title,
	description,
	keywords,
	image = "https://res.cloudinary.com/duhemkmvl/image/upload/v1762727482/Screenshot_2025-11-10_040319_blnl1g.png",
	url = "http://localhost:3000/",
}: SEOProps) => [
	// Title
	{ title },

	// Basic SEO
	{ name: "description", content: description },
	{ name: "keywords", content: keywords },

	// Open Graph
	{ property: "og:type", content: "website" },
	{ property: "og:title", content: title },
	{ property: "og:description", content: description },
	{ property: "og:url", content: url },

	...(image ? [{ property: "og:image", content: image }] : []),

	// Twitter
	{ name: "twitter:card", content: "summary_large_image" },
	{ name: "twitter:title", content: title },
	{ name: "twitter:description", content: description },
	{ name: "twitter:creator", content: "@tannerlinsley" },
	{ name: "twitter:site", content: "@tannerlinsley" },
	{ name: "twitter:url", content: url },

	...(image ? [{ name: "twitter:image", content: image }] : []),
];

export const seo = (props: SEOProps) => ({
	meta: seoRoot(props),

	links: [
		{
			rel: "canonical",
			href: props.url ?? "http://localhost:3000/",
		},
	],
});

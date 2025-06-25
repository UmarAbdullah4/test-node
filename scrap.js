// const prompt = `**You are an SEO expert tasked with analyzing competitor website content for SEO purposes. Your goal is to thoroughly clean and evaluate the content by removing any extraneous elements (e.g., navigation menus, ads, boilerplate language) so that its core SEO value is clearly exposed.**

// ### **Tasks:**

// 1. **Raw Content:**

//    - Remove or mask any sensitive or personally identifiable information (e.g., names, emails, addresses, phone numbers) without changing the overall meaning.
//    - Provide a clean formated version of the content that is friendly for large language models (LLMs).

// 2. **Key Insights:**

//    - List the most critical SEO insights and strategies discussed in the competitor’s content regarding “[{keyword}]”.
//    - Identify the subtopics that appear most frequently.
//    - Note the tone, keywords, and phrases used throughout the content.
//    - Analyze the structure of the content (headings, lists, paragraphs) and note any common patterns.

// 3. **Keyword Extraction:**

//    - Extract and list all significant SEO keywords and phrases present in the content.
//    - Highlight any keywords or phrases used in meta titles and meta descriptions, noting their exact length, structure, and word choice.
//    - Observe the tone, CTA, and keywords in the meta descriptions.

// 4. **Gaps and Unique Angles:**

//    - Identify any gaps or areas for improvement in the competitor’s content.
//    - Highlight any unique angles or conversion-driving elements (CTAs, USPs) that they emphasize.
//    - List what information is covered and note any areas that are missing or can be further developed.
//    - Identify patterns and areas for improvement to maximize click-through rates (CTR).

// 5. **Additional Analysis:**
//    - Evaluate the overall text structure, including the length, structure, and word choice used in the content.
//    - Note how blog posts or articles are structured (e.g., use of headings, lists, paragraphs) and how this may affect user engagement.
//    - Assess what CTAs, conversion-driving elements, and USPs are highlighted and suggest opportunities for improvement.

// ### **Output Format:**

// Present your results in a structured format with clear headings for each section:

// - **Raw Content**
// - **Key Insights**
// - **Frequent Subtopics**
// - **Important Keywords**
// - **Gaps/Unique Angles**
// - **Tone, CTAs, and Meta Analysis** (including details on meta titles and meta descriptions)

// **URL:**
// \n\n${urls.join("\n")}`;

const OpenAI = require("openai");
require("dotenv").config({ path: ".env" });

const client = new OpenAI({
  apiKey: process.env.API_KEY_OPENAI,
});

// const prompt = `Scrape the following sites and return each and every detail in this sites in raw:\n\n${urls.join(
//   "\n"
// )}`;

// const prompt = `You are an expert web analyst, skilled at extracting key information from websites and presenting it in a concise and readable Markdown format.

// You will be provided with the website URL:
// https://nike.com

// Your task is to create an "About Snapshot" in Markdown format based on the information found on the given website. Adhere to the following instructions:

// 1. Visit the website at the provided URL.

// 2. Extract information for each item in the Extraction Checklist below. Prioritize content from suggested sources (About page, /company, /team, footer, etc.), but use any page on the site if necessary.

// 3. Populate the provided Markdown template with the extracted information.

// 4. Keep each section's content under 60 words unless a list is required. If information is not available, skip the section.

// 5. Ensure all links start with "http://" or "https://". If a link is invalid, do not include it.

// 6. Maintain the exact formatting (bold, italics, blockquotes) and heading hierarchy (##, ###, bullet list) of the template.

// **Extraction Checklist:**

// - Brand story / founding tale
// - Mission statement
// - Vision statement
// - Unique value proposition (UVP)
// - Team (name – role – 1-line bio)
// - Social proof (testimonial / review / case study: 1-sentence quote + source)
// - Visual highlights (describe noteworthy image or video in 1 line)
// - Primary call to action (CTA text)
// - Social links (Facebook, Instagram, LinkedIn, X/Twitter, YouTube, other)
// - Behind-the-scenes insight (production, culture, or process)
// `;

// const urls = [
//   "https://aurisestetic.se",
//   "https://www.ikea.com/",
//   "https://www.azdesign.se/",
// ];

const url = `https://www.azdesign.se/`;

// const prompt = `You are an expert web scraper specializing in structured data extraction from websites. Your role is to accurately and efficiently extract verified top-level navigation links from a user-provided website. You must ensure all collected data is clean, validated, and follows strict output formatting requirements.

// **Visit the user-provided root domain:** [${url}](${url})

// **Instructions:**

// 1. Scrape all **top-level pages** listed in the site's **main navigation menu** (i.e., the primary menu or navigation bar).
// 2. For **each top-level page**, collect the following:

//    - **Page Title**
//    - **Full Absolute URL**

// 3. Visit each page and verify if its actually exist with data or not if it show something "Sidan kunde inte hittas" means url is not valid.
// 4. **Exclude** any URLs that do not return a valid response.

// **Output Format (Required):**

// - Present each verified URL in the following format:
//   "[Page Title](Full URL) brief description of the URL"

// **Rules:**

// - Do **not** include any extra content, metadata, headers, footers, or explanatory notes.
// - Only return the verified, live URLs that meet the above criteria.
// - Remove any invalid or unreachable URLs from the final output (e.g., URLs returning 404, 500, or timeout errors).
// `;

// const prompt = `**Get all top-level pages meta title from this site:** [${url}](${url})`;
const prompt = `Scrape the following site and return all nav bar and header top-level links:\n\n${url}`;
(async () => {
  const response = await client.responses.create({
    model: "o3",
    // tools: [
    //   {
    //     type: "web_search_preview",
    //   },
    // ],
    input: prompt,
  });
  console.log(response.output_text);

  // const completion = await client.chat.completions.create({
  //   model: "gpt-4o-search-preview",
  //   // web_search_options: { search_context_size: "high" },
  //   messages: [
  //     {
  //       role: "user",
  //       content: prompt,
  //     },
  //   ],
  // });

  // console.log(completion.choices[0].message.content);
})();

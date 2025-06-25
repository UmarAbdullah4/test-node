// const content_validation = {
//   category_page: {
//     words: {
//       max: 500,
//       min: 300,
//     },
//     headings: {
//       max: 4,
//       min: 1,
//     },
//     paragraphs: {
//       min: 1,
//     },
//   },
//   pdp: {
//     words: {
//       max: 300,
//       min: 150,
//     },
//     headings: {
//       max: 3,
//       min: 1,
//     },
//     paragraphs: {
//       min: 2,
//     },
//   },
//   article: {
//     words: {
//       max: 1500,
//       min: 800,
//     },
//     headings: {
//       max: 8,
//       min: 1,
//     },
//     paragraphs: {
//       min: 5,
//     },
//   },
//   blog_post: {
//     words: {
//       max: 1200,
//       min: 800,
//     },
//     headings: {
//       max: 10,
//       min: 1,
//     },
//     paragraphs: {
//       min: 5,
//     },
//   },
//   press_release: {
//     words: {
//       max: 800,
//       min: 300,
//     },
//     headings: {
//       max: 2,
//       min: 1,
//     },
//     paragraphs: {
//       min: 3,
//     },
//   },
//   youtube_brief: {
//     words: {
//       max: 500,
//       min: 220,
//     },
//     headings: {
//       max: 2,
//       min: 1,
//     },
//     paragraphs: {
//       min: 1,
//     },
//   },
// };

// function analyzeCount(markdown, content_type) {
//   const validate = content_validation[content_type];

//   // Compute raw counts
//   const words = markdown.trim().split(/\s+/).filter(Boolean).length;

//   const paragraphs = markdown
//     .split(/\n\s*\n+/)
//     .filter((p) => p.trim().length).length;

//   const headings = (markdown.match(/^#+\s+/gm) || []).length;

//   const { min: wordMin, max: wordMax } = validate.words;
//   const wordPass = words >= wordMin && words <= wordMax;

//   const { min: headMin, max: headMax } = validate.headings;
//   const headPass = headings >= headMin && headings <= headMax;

//   // Paragraph count validation (no max in some types → treat as unbounded)
//   const { min: paraMin, max: paraMax = Infinity } = validate.paragraphs;
//   const paraPass = paragraphs >= paraMin && paragraphs <= paraMax;

//   return {
//     word: {
//       min: wordMin,
//       max: wordMax,
//       pass: wordPass,
//       words: words,
//     },
//     heading: {
//       min: headMin,
//       max: headMax,
//       pass: headPass,
//       headings: headings,
//     },
//     paragraph: {
//       min: paraMin,
//       max: Number.isFinite(paraMax) ? paraMax : null,
//       pass: paraPass,
//       paragraphs: paragraphs,
//     },
//   };
// }

// const resss = analyzeCount(
//   `Stol James R – Valet för restauranger och caféer med stil

// När du söker möbler till restaurang, café eller hotell är det ofta detaljerna som avgör helhetsintrycket. Stol James R har vuxit fram som ett självklart val för många inom branschen, inte minst tack vare dess karaktäristiska design och slitstarka material. För dig som driver en verksamhet där många gäster passerar varje dag gäller det att hitta sittmöbler som både klarar vardagens påfrestningar och samtidigt bidrar till en trivsam atmosfär. Just här fyller Stol James R en viktig funktion.

// Stol James R kombinerar en klassisk silhuett med praktiska materialval. Stommen består av massivt bokträ med en diskret bets i wenge, vilket ger ett varmt men ändå sobert uttryck. Sitsen är klädd i konstläder och finns som standard i både svart och brunt. Det konstläder som används är särskilt framtaget för att tåla kontinuerlig användning i offentliga miljöer, samtidigt som det är lätt att underhålla. Till skillnad från traditionellt läder kräver det ingen särskild behandling utan kan enkelt torkas av, vilket underlättar den dagliga städningen. När matsalen fylls av gäster vill du kunna lita på att varje möbel fungerar lika bra dag efter dag.

// En aspekt som ofta tas för given vid val av restaurangstol är proportionerna. Måtten på Stol James R ligger helt i linje med vad som rekommenderas för publika miljöer. Sitthöjden är cirka 49 centimeter, vilket ger bekvämt stöd även under längre sittningar. Bredd och djup är väl avvägda för att få in tillräckligt många platser vid ett bord utan att det känns trångt. Att stolen väger tillräckligt för att vara stadig men ändå lätt nog att hantera märks särskilt när personalen snabbt ska möblera om mellan lunch och kvällsservering.

// Färgvalen gör att Stol James R passar in i både moderna och klassiska rum. För den som har mer exakta krav på nyans eller material finns det möjlighet att beställa stolen med andra färger eller klädslar. Många arkitekter och inredare uppskattar den friheten, särskilt i projekt där egen profil eller branding är central. Med den här stolen är det lättare att hitta en lösning som harmonierar med övrig inredning eller synliga teman. De som vill skapa sin egen unika kombination kan genom projekt & offert hos AZ Design få hjälp med rätt specifikationer och rådgivning.

// När du planerar att investera i ny restauranginredning kan det vara svårt att visualisera känslan i rummet utifrån bilder på en skärm. Hos AZ Design erbjuds möjligheten att besöka showroomet i södra Stockholm. Där går det att provsitta och inspektera Stol James R tillsammans med ett brett sortiment av andra restaurangmöbler. Många uppskattar att faktiskt få känna på materialen i verkligheten innan beslutet tas. Det gör det också lättare att jämföra komforten i olika modeller och att bolla idéer med experterna på plats.

// Hållbarhet och daglig skötsel är också viktiga faktorer. Det är inte ovanligt att möbler för offentlig miljö med tiden får repor, fläckar eller andra skador, men bokträstommen i Stol James R är framtagen för att stå emot dagligt slitage. Ytan kan enkelt hållas ren med vanlig torkning och det konstläder som används står emot vätskor och spill på ett stabilt sätt. Även om de flesta stolar för restaurangbruk är skapade för att klara mycket upplever många att det finns skillnader i hur snabbt de tappar form eller slitage uppstår. Här har Stol James R blivit omtalad hos exempelvis caféägare och hotellchefer som ett exempel på en stol som inte tappar i intryck även efter flera år av intensiv användning.

// För dig som vill göra ett tryggt köp och där service är avgörande om något ändå skulle hända finns det alltid vägar till personlig kontakt. AZ Design lägger stor vikt vid engagerad och professionell service, och genom att använda kontakta oss kan du som företagskund få vägledning både före och efter ett köp. För större verksamheter eller när det rör sig om omfattande projekt finns dessutom möjlighet till företagsleasing, vilket uppskattas av både nyetablerade och rutinerade aktörer som vill vara flexibla med sina investeringar.

// När det gäller leveranser och logistik är det en fördel att stolmodellen finns i lager i flera olika färgställningar, vilket minimerar väntetiden från beställning till leverans i de flesta fall. I vissa situationer kan speciella önskemål eller större ordervolymer medföra anpassad leveranstid. All information kring sådana frågor går smidigt att få genom företagets kundservice, där professionalism och transparens präglar dialogen. Inför köp kan det också ge trygghet att läsa om andra kunders erfarenheter. Omdömet "Fantastisk kundservice: Engagerad och professionell hjälp" på Trustpilot visar att det inte bara är produktens egenskaper som uppskattas utan även stödet längs hela vägen.

// För dig som söker inspiration och praktiska tips kring restaurang och caféinredning kan sidan inredningshjälp på AZ Design ge nya idéer. Att se hur en tidlös stol som Stol James R kan användas i både nischade koncept och bredare miljöer kan väcka tankar om helheten i rummet. Många restaurangägare kombinerar gärna flera olika modeller för att skapa dynamik, ibland räcker det att byta ut några stolar vid varje bord för att förändringen ska märkas.

// Att välja rätt sittmöbel är inte bara en fråga om estetik utan påverkar också hur gäster trivs och återkommer. Med Stol James R har du en stabil utgångspunkt som möter både funktionella och visuella behov. Kombinationen av robust bokträ, tåligt konstläder och möjligheten att skräddarsy uttrycket har gjort modellen till en återkommande del inom svensk restauranginredning. Oavsett om du planerar ett helt nytt koncept eller vill lyfta en befintlig matsal är det värt att lägga lite extra omtanke vid valet av stol och den upplevelse du vill ge dina gäster.`,
//   "article"
// );

// console.log({ resss });

const getSingleSuggestion = ({
  min = "",
  max = "",
  value = "",
  keyword = "",
  interlinks = "",
  linksCount = "",
  issue = "",
  partialmatch = "",
  type,
}) => {
  const suggestions = {
    keyword: {
      h1: issue
        ? `Ensure the exact keyword "${keyword}" is present in the H1 tag.`
        : `Replace the partial keyword "${partialmatch}" in the H1 tag with the exact keyword "${keyword}". Do not use partial matches.`,
      first100Words: issue
        ? `Ensure the exact keyword "${keyword}" appears within the first 100 words of the content.`
        : `Replace the partial keyword "${partialmatch}" in the first 100 words with the exact keyword "${keyword}". Do not use partial matches.`,
      // metaDescription: issue
      //   ? `Ensure the exact keyword "${keyword}" is included in the meta description.`
      //   : `Replace the partial keyword "${partialmatch}" in the meta description with the exact keyword "${keyword}". Do not use partial matches.`,
      internalLinks: issue
        ? `Add internal links so the total is between 4 and 5. Currently, there are ${linksCount} links. Use links from the following list: ${interlinks}.`
        : `Trim the number of internal links to 4 or 5. Remove any additional links beyond this range.`,
    },
    count: {
      word: issue
        ? `The total word count must be between ${min} and ${max}. Current count: ${value}. Add approximately ${
            min - value + 10
          } more words.`
        : `The word count exceeds the maximum limit. Reduce it to fall between ${min} and ${max} words.`,
      heading: issue
        ? `The content must have between ${min} and ${max} headings. Current count: ${value}. Add approximately ${
            min - value
          } more headings.`
        : `Too many headings. Reduce the count to between ${min} and ${max}.`,
      paragraph: issue
        ? `The number of paragraphs should be minimum ${
            min + 1
          }. Current count: ${value}. Add approximately ${
            min - value
          } more paragraphs.`
        : `Too many paragraphs (${value}). Reduce the count to minimum ${
            min + 1
          }.`,
    },
  };

  const [section, key] = type.split(".");
  return suggestions?.[section]?.[key];
};

const optt = {
  keyword: {
    h1: { good: "Keyword in H1." },
    first100Words: { good: "Keyword in first 100 words." },
    metaDescription: null,
    internalLinks: { count: 5, good: "5 links (OK)" },
  },
  count: {
    word: { min: 800, max: 1500, good: true, value: 926 },
    heading: { min: 1, max: 8, issue: true, value: 1 },
    paragraph: { min: 5, max: null, refinement: true, value: 10 },
  },
};

const propMap = {
  count: "good",
  keyword: "good",
};

const failureDetails = Object.entries(propMap).flatMap(([group, prop]) =>
  Object.entries(optt[group] || {})
    .filter(([, cfg]) => !cfg?.[prop])
    .map(([key, cfg]) => ({ [group]: { [key]: cfg } }))
);

if (failureDetails.length) {
  console.log(failureDetails);

  const output = failureDetails.map((obj) => {
    const [outerKey] = Object.keys(obj);
    const inner = obj[outerKey];
    const [innerKey] = Object.keys(inner);
    const values = inner[innerKey];

    return {
      type: `${outerKey}.${innerKey}`,
      ...values,
    };
  });
  // console.log({ output });

  const messages = output
    ?.map((item) => {
      return getSingleSuggestion({
        ...item,
        keyword: "example-keyword",
      });
    })
    ?.filter((f) => f);

  console.log({ messages });

  // console.log(
  //   failureDetails?.map((f) => {
  //     return { type: f.count };
  //   })
  // );
  // console.log(failureDetails?.map((f) => f.keyword));
}

const data = {
  prompt: "Translate to Arabic\n",
  text: '🔍 YouTube Analysis: Topp 5 videor för "Chatbots"',
  html: "<p>🔍 YouTube <u>Analysis</u><s>: </s>Topp 5 videor <s>för </s>&quot;Chatbots&quot;</p>",
  content:
    "<h1>🔍 YouTube Analysis: Topp 5 videor för &quot;Chatbots&quot;</h1>\n" +
    "<ol>\n" +
    "<li><p><strong>&quot;Top AI Chatbots in 2025: ChatGPT, Copilot, Claude, Gemini &amp; More!&quot; (7:15)</strong><br><em>Titel använder framtidsinriktade termer och konkreta chatbot-namn. Innehållet fokuserar på att jämföra populära AI-chatbots med korta beskrivningar av deras användningsområden.</em></p>\n" +
    "</li>\n" +
    "<li><p><strong>&quot;5 Best AI Chatbots in 2024&quot; (5:45)</strong><br><em>En lista med fem utvalda chatbotlösningar. Titeln är direkt och säljande, med fokus på att ge tittarna snabba rekommendationer inom ett tidsmässigt relevant årtal.</em></p>\n" +
    "</li>\n" +
    "<li><p><strong>&quot;What are AI Chatbots?&quot; (3:22)</strong><br><em>Videons titel är grundläggande och förklarande, vilket attraherar nyfikna tittare. Innehållet ger en översiktlig introduktion till vad AI-chatbots är och hur de fungerar.</em></p>\n" +
    "</li>\n" +
    "<li><p><strong>&quot;Generative vs Rules-Based Chatbots&quot; (7:25)</strong><br><em>Titeln betonar jämförelsen mellan två chatbottyper. Innehållet är uppdelat i sektioner som tydligt förklarar skillnaderna och fördelarna med de olika metoderna.</em></p>\n" +
    "</li>\n" +
    "<li><p><strong>&quot;Chatbots vs AI Assistants: Key Differences&quot; (6:33)</strong><br><em>Videon fokuserar på att skilja på begreppen och teknologierna bakom chatbots och AI-assistenter. Den riktar sig till tittare som vill förstå djupare tekniska och praktiska skillnader.</em></p>\n" +
    "</li>\n" +
    "</ol>\n" +
    "<h1>🎬 Recommended Video to Rank High on YouTube</h1>\n" +
    "<ul>\n" +
    "<li><strong>Title:</strong> &quot;Chatbots i Fokus: Så Transformeras Utbildning, Forskning och Affärsvärlden med AI&quot;  </li>\n" +
    "<li><strong>Video Length:</strong> 12–15 minuter  </li>\n" +
    "<li><strong>Content Structure:</strong><ul>\n" +
    "<li><strong>Intro:</strong>  <ul>\n" +
    "<li>Inled med en kort, engagerande presentation (10–20 sekunder) där du ställer en fråga: &quot;Hur förändrar AI-chatbots din arbetsplats, ditt klassrum och din forskning?&quot;  </li>\n" +
    "<li>Visa snabba klipp av chatbot-applikationer inom utbildning, forskning och affärsvärlden.</li>\n" +
    "</ul>\n" +
    "</li>\n" +
    "<li><strong>Main Content:</strong>  <ul>\n" +
    "<li>Dela in videon i tydliga sektioner:<ol>\n" +
    "<li><em>Översikt &amp; Definition:</em> Förklara vad chatbots är, med fokus på både traditionella och AI-drivna lösningar.</li>\n" +
    "<li><em>Tillämpningsområden:</em> Presentera konkreta exempel och case-studier (t.ex. inom utbildning, affärer och forskning).</li>\n" +
    "<li><em>Jämförelse &amp; Analys:</em> Jämför olika typer av chatbots (generativ vs regelbaserad) och diskutera deras för- och nackdelar.</li>\n" +
    "<li><em>Framtid och Innovation:</em> Diskutera kommande trender och hur de kan påverka målgrupperna.</li>\n" +
    "</ol>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</li>\n" +
    "<li><strong>CTA:</strong>  <ul>\n" +
    "<li>Uppmana tittarna att prenumerera och kommentera om hur de använder chatbots i sin verksamhet eller utbildning.  </li>\n" +
    "<li>Ge dem en länk till en fördjupad guide eller resurs på din webbplats för ytterligare information.</li>\n" +
    "</ul>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</li>\n" +
    "<li><strong>Thumbnail:</strong>  <ul>\n" +
    "<li>Designa en professionell och högkontrast-thumbnail med:<ul>\n" +
    "<li>Stor, tydlig text: &quot;Chatbots i Fokus&quot; med undertitel &quot;Utbildning, Forskning &amp; Affärer&quot;.  </li>\n" +
    "<li>Ikoner eller symboler för AI och teknologi.  </li>\n" +
    "<li>Färger som blått och vitt för att inge förtroende och professionalism.</li>\n" +
    "</ul>\n" +
    "</li>\n" +
    "</ul>\n" +
    "</li>\n" +
    "<li><strong>Format:</strong>  <ul>\n" +
    "<li>En mix av informativ dokumentär och intervjubaserad guide med inslag av grafik och dataanalyser.</li>\n" +
    "</ul>\n" +
    "</li>\n" +
    "<li><strong>Tactics to Beat Competitors:</strong>  <ul>\n" +
    "<li>Använd konkreta case-studier och siffror som stöds av trovärdiga källor för att framhäva auktoritet (E-E-A-T).  </li>\n" +
    "<li>Strukturera innehållet med tydliga segment och visuella stöd som diagram och grafik för att hålla tittarnas engagemang högt.  </li>\n" +
    "<li>Inkludera expertintervjuer eller citat från kända forskare/affärsprofiler för att öka förtroendet hos målgruppen.  </li>\n" +
    "<li>Testa olika CTA-format och analysera tittardata för att optimera videons engagemang och konvertering.</li>\n" +
    "</ul>\n" +
    "</li>\n" +
    "</ul>\n",
  content_id: "68066143a8245f0b283a52c5",
};

var TurndownService = require("turndown");

const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  emDelimiter: "_",
  strongDelimiter: "***",
  bulletListMarker: "-",
});

var markdown = turndownService.turndown(data?.content);

console.log({ markdown });

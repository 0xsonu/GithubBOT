export const detectLanguageOld = (codeSnippet: string): string | null => {
  const languageRegexMap: { [key: string]: RegExp } = {
    python3: /(^|\s|\W)(python|py)(\W|$)/i,
    nodejs: /(^|\s|\W)(javascript|js)(\W|$)/i,
    java: /(^|\s|\W)(java)(\W|$)/i,
    c: /(^|\s|\W)(c)(\W|$)/i,
    cpp: /(^|\s|\W)(cpp)(\W|$)/i,
    // Add more language mappings as needed
  };

  for (const language in languageRegexMap) {
    if (languageRegexMap[language].test(codeSnippet)) {
      return language;
    }
  }

  return null; // Language not detected
};

export interface ExtractedCodeWithLanguage {
  language: string;
  code: string;
}

export default function detectLanguage(
  codeSnippet: string
): ExtractedCodeWithLanguage[] {
  // language map

  const LanguageMap: { [key: string]: string } = {
    python: "python3",
    py: "python3",
    python3: "python3",
    js: "nodejs",
    javascript: "nodejs",
    c: "c",
    "c++": "cpp",
    cpp: "cpp",
    // add more language
  };

  const pattern = /```(\w+)[\s\S]*?```/g; // Updated regex pattern
  const codeSnippets: ExtractedCodeWithLanguage[] = [];
  let match;
  while ((match = pattern.exec(codeSnippet)) !== null) {
    const language = match[1];
    const code = match[0].replace(/^```[\s\S]+?[\r\n]+|```$/g, "");
    codeSnippets.push({ language: LanguageMap[language], code });
  }
  return codeSnippets;
}

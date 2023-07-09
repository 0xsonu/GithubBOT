import axios from "axios";
import detectLanguage, { ExtractedCodeWithLanguage } from "./languageDetector";

// data for testing
// import fakeResponse from "../data/fakeResponse.json";
// import wrongCodeResponse from "../data/wrongCodeResponse.json";

export default async function executeCode(
  codeSnippet: string
): Promise<string> {
  const codes: ExtractedCodeWithLanguage[] = detectLanguage(codeSnippet);

  if (!codes.length) {
    throw new Error("Failed to detect the programming language");
  }

  try {
    const options = codes.map((code) => {
      const option = {
        method: "POST",
        url: "https://online-code-compiler.p.rapidapi.com/v1/",
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": process.env.RAPID_API_KEY,
          "X-RapidAPI-Host": "online-code-compiler.p.rapidapi.com",
        },
        data: {
          language: code.language,
          version: "latest",
          code: code.code,
          input: null,
        },
      };
      return option;
    });

    const { data: response } = await axios.request(options[0]); // we can use here for multiple execution in parallel with promiss.all in future
    // const response = fakeResponse || wrongCodeResponse;
    const output = `
### Code Execution Result:

* CPU Time :  ${response?.cpuTime}
* Memory Uses : ${response?.memory}
* Output :
\`\`\`
${response?.output}
\`\`\`

**Compiler Information :**
* Language : ${response?.language?.id}
* version: ${response?.language?.version_name}
    `;
    console.log(response);
    return output;
  } catch (error) {
    throw new Error("An Error occurs while executing your code.");
  }
}

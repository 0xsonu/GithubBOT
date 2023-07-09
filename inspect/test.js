function extractCodeSnippets(markdownText) {
  const pattern = /```(\w+)[\s\S]*?```/g; // Updated regex pattern
  const codeSnippets = [];
  let match;
  while ((match = pattern.exec(markdownText)) !== null) {
    const language = match[1];
    const code = match[0].replace(/^```[\s\S]+?[\r\n]+|```$/g, "");
    codeSnippets.push({ language, code });
  }
  return codeSnippets;
}

// Example usage
const markdownText = `
# My Markdown File

Here is a code snippet:

\`\`\`python
print("Hello, World!");
\`\`\`

And another one:

\`\`\`javascript
console.log("Hello, World!");
\`\`\`

\`\`\`js\r\nconsole.log("Hello World");\r\n\`\`\`
`;

const snippets = extractCodeSnippets(markdownText);
snippets.forEach((snippet) => {
  const { language, code } = snippet;
  console.log("Language:", language);
  console.log("Code:", code);
});

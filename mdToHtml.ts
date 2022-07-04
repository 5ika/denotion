import { Marked } from "https://deno.land/x/markdown@v2.0.0/mod.ts";

export const convertDirectory = async (
  inputPath: string,
  outputPath: string
) => {
  for await (const dirEntry of Deno.readDir(inputPath)) {
    if (dirEntry.isDirectory)
      await convertDirectory(
        `${inputPath}/${dirEntry.name}`,
        `${outputPath}/${dirEntry.name}`
      );
    else if (dirEntry.isFile)
      await convertFile(dirEntry.name, inputPath, outputPath);
  }
};

export const convertFile = async (
  mdFileName: string,
  inputPath: string,
  outputPath: string
) => {
  const decoder = new TextDecoder("utf-8");
  const markdown = decoder.decode(
    await Deno.readFile(`${inputPath}/${mdFileName}`)
  );
  const markup = Marked.parse(replaceMdLinks(markdown));
  const pageTitle = mdFileName.replace(/\.md$/, "");
  const htmlContent = markup.content;
  const htmlDocument = applyHtmlTemplate(pageTitle, htmlContent);

  await Deno.mkdir(outputPath, { recursive: true });
  await Deno.writeTextFile(`${outputPath}/${pageTitle}.html`, htmlDocument);
  console.log(`Save ${outputPath}/${pageTitle}.html`);
};

const replaceMdLinks = (mdContent: string) =>
  mdContent.replaceAll(".md", ".html");

const applyHtmlTemplate = (pageTitle: string, htmlContent: string) => `
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <title>${pageTitle}</title>
    <style>
      body { font-family: sans; }
    </style>
  </head>
  <body>
    ${htmlContent}
  </body>
</html>
`;

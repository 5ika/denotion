import "https://deno.land/x/dotenv/load.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";
import { Client } from "https://deno.land/x/notion_sdk@v1.0.4/src/mod.ts";
import { convertDirectory } from "./mdToHtml.ts";
import NotionToMarkdown from "./notionToMd.ts";

const DIRECTORY_MD = "./md";
const DIRECTORY_HTML = "./html";
const args = parse(Deno.args);
const NOTION_SECRET = args.notionSecret || Deno.env.get("NOTION_SECRET");
const ENTRYPOINT_PAGEID =
  args.pageId || Deno.env.get("ENTRYPOINT_PAGEID") || "";

const notion = new Client({
  auth: NOTION_SECRET,
});
const n2m = NotionToMarkdown(notion);

const savePage = async (
  pageId: string,
  path: string,
  fixedFileName?: string
) => {
  const notionPage = await notion.blocks.retrieve({ block_id: pageId });
  const pageTitle = notionPage.child_page.title;

  let mdBlocks = await n2m.pageToMarkdown(pageId);
  // Do not display sub-page content
  mdBlocks = mdBlocks.map(mdBlock => ({ ...mdBlock, children: [] }));
  // Add page title
  mdBlocks = [{ parent: `# ${pageTitle}`, children: [] }, ...mdBlocks];

  // Write page file
  const mdPage = n2m.toMarkdownString(mdBlocks);
  const fileName = fixedFileName ?? `${path}/${pageTitle}.md`;
  await Deno.mkdir(path, { recursive: true });
  await Deno.writeTextFile(fileName, mdPage);
  console.log(`Save ${fileName}`);

  // Save child pages
  const { results: blocks = [] } = await notion.blocks.children.list({
    block_id: pageId,
  });
  const childPages = blocks.filter(block => block.type === "child_page");
  await Promise.all(
    childPages.map(page => savePage(page.id, `${path}/${pageTitle}`))
  );
};

if (!args.html) {
  await Deno.mkdir(`${DIRECTORY_MD}/_images`, { recursive: true });
  await savePage(ENTRYPOINT_PAGEID, DIRECTORY_MD, `${DIRECTORY_MD}/index.md`);
}

if (!args.md) {
  await Deno.mkdir(`${DIRECTORY_HTML}/_images`, { recursive: true });
  await convertDirectory(DIRECTORY_MD, DIRECTORY_HTML);
}

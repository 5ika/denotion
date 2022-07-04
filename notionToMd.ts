import { Client } from "https://deno.land/x/notion_sdk@v1.0.4/src/mod.ts";
import {
  copy,
  readerFromStreamReader,
} from "https://deno.land/std@0.146.0/streams/conversion.ts";
import { NotionToMarkdown } from "https://deno.land/x/notion_to_md@v2.5.0/mod.ts";

export default (notionClient: Client) => {
  const n2m = new NotionToMarkdown({ notionClient });

  // Format sub-page link
  n2m.setCustomTransformer("child_page", async block => {
    const childPageTitle = block.child_page.title;
    const parentPage = await notionClient.blocks.retrieve({
      block_id: block.parent.page_id,
    });
    const uri =
      `./${parentPage?.child_page.title}/${childPageTitle}.md`.replaceAll(
        " ",
        "%20"
      );
    return `=> [${childPageTitle}](${uri})`;
  });

  // Download an format image
  n2m.setCustomTransformer("image", block => {
    const fileName = `md/_images/${block.id}.png`;
    downloadFile(fileName, block.image.file.url);
    return Promise.resolve(`![${fileName}](${fileName})`);
  });

  return n2m;
};

const downloadFile = async (fileName: string, url: string) => {
  const rsp = await fetch(url);
  const rdr = rsp.body?.getReader();
  if (rdr) {
    const r = readerFromStreamReader(rdr);
    const f = await Deno.open(fileName, {
      create: true,
      write: true,
    });
    await copy(r, f);
    f.close();
  }
};

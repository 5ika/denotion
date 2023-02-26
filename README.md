> MOVED TO ssh://5ika.ch:1917/denotion

# Denotion

Notion is useful but our data are locked in the service.
Denotion is a tool to download Notion's content and publish it easily as HTML content.

## Usage
```bash
deno run --allow-net --allow-write  --allow-read=.env,.env.defaults,md --allow-env \
    https://raw.githubusercontent.com/5ika/denotion/main/mod.ts --notionSecret <secret> --pageId <page ID>
```

### Options
- `--notionSecret`: Provide Notion secret for authentication
- `--pageId`: Targeted Notion's page UUID
- `--md`: Generate only MD content
- `--html`: Generate HTML from existant `md` directory

Notion secret and page ID could be provided through environment variables with `NOTION_SECRET` and `ENTRYPOINT_PAGEID`.

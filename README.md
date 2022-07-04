# Denotion

Notion is useful but our data are locked in the service.
Denotion is a tool to download Notion's content and publish it easily as HTML content.

## Usage
```bash
cp .env.example .env
edit .env
deno run --allow-net --allow-write  --allow-read=.env,.env.defaults,md --allow-env https://raw.githubusercontent.com/5ika/denotion/main/mod.ts
```

### Options
- `--md`: Generate only MD content
- `--html`: Generate HTML from existant `md` directory

## TODO

- [ ] Set README
- [ ] Throw error message when env vars are missing

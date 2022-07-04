# Denotion
## Usage
```bash
deno run --allow-net --allow-write  --allow-read=.env,.env.defaults,md --allow-env   https://raw.githubusercontent.com/5ika/notion-to-md-deno/raw/master/mode.ts
```

### Options
- `--md`: Generate only MD content
- `--html`: Generate HTML from existant `md` directory

## TODO

- [ ] Set README
- [ ] Throw error message when env vars are missing

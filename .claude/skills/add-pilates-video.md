# add-pilates-video

Add a new video clip to the Pilates workout library.

## Usage

`/add-pilates-video <url>`

## Steps

1. **Fetch the page content** using WebFetch on the provided URL. Capture the title, description, visible exercise text, and any timestamp markers.

2. **Analyze the content** to determine:
   - `title`: Concise descriptive name (e.g. "Core with Pilates ball — oblique series")
   - `tags`: Select ALL that apply from: `core`, `legs`, `ball`, `ring`, `obliques`, `glutes`, `arms`, `stretch`, `hips`, `back`, `full-body`. Add a new tag only if clearly warranted.
   - `type`: `"carousel"` if the URL contains `img_index` or page shows multiple slides; otherwise `"video"`
   - `source`: `"instagram"` if URL contains `instagram.com`; `"youtube"` if `youtube.com` or `youtu.be`
   - `movements`: Integer count of distinct exercises ONLY if explicitly stated in description or timestamps (e.g. "5 moves", or 5 numbered timestamps). Omit entirely if not clearly stated.
   - `id`: Extract the shortcode or video ID from the URL:
     - Instagram `/p/SHORTCODE/` or `/reel/SHORTCODE/` → use SHORTCODE
     - YouTube `/shorts/VIDEO_ID` or `watch?v=VIDEO_ID` → use VIDEO_ID

3. **Read `clips.json`**. If the `id` already exists, report "Clip already exists" and stop.

4. **Append** the new clip object to the array in `clips.json`. Set `added` to today's date as `YYYY-MM-DD`.

5. **Validate** the JSON: `node -e "JSON.parse(require('fs').readFileSync('clips.json','utf8')); console.log('valid')"`

6. **Commit and push**:
   ```bash
   git add clips.json
   git commit -m "feat: add clip — <title>"
   git push
   ```

7. **Confirm** by reporting the title, tags assigned, movements (if detected), and the GitHub Pages URL.

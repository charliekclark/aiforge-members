# Add your card to AI Forge

Your card is one small JSON file plus one photo. You'll add them on your own branch in your own fork and open a pull request. Nobody else's files are touched, so pull requests don't conflict.

## Steps

1. **Fork the repo.** Click **Fork** at the top right of this page on GitHub.

2. **Clone your fork.** Replace `your-username` with your GitHub username:

   ```bash
   git clone https://github.com/your-username/aiforge-members.git
   cd aiforge-members
   ```

3. **Make a branch.**

   ```bash
   git switch -c add-first-last
   ```

4. **Copy the template** to a file named after you (lowercase, dashes):

   ```bash
   cp templates/card.template.json cards/first-last.json
   ```

   On Windows PowerShell: `copy templates\card.template.json cards\first-last.json`

5. **Fill in your card** (fields below) and save your photo as `photos/first-last.jpg`.

6. **Commit and push.**

   ```bash
   git add cards/first-last.json photos/first-last.jpg
   git commit -m "Add First Last"
   git push -u origin add-first-last
   ```

7. **Open a pull request.** GitHub shows a **Compare & pull request** button on your fork. Click it, then **Create pull request**.

Once your pull request is merged, your card appears on the page.

## Card fields

| Field | Required | Example |
| --- | --- | --- |
| `name` | yes | `"Jordan Rivera"` |
| `year` | yes | `"Junior"` |
| `major` | yes | `"Finance and Computer Science"` |
| `hometown` | yes | `"Green Bay, WI"` |
| `photo` | yes | `"photos/jordan-rivera.jpg"` |
| `linkedin` | yes | `"https://www.linkedin.com/in/your-handle"` |
| `title` | no | `"Events lead"` |

Leave `title` as `""` or delete the line if you don't have one.

## Photo

- Square works best, about 600 by 600 pixels.
- `.jpg`, `.jpeg`, `.png` or `.webp`, under 1 MB.
- The `photo` value must match the file name in `photos/` exactly.

## Check your card before you push (optional)

If you have Node installed, this tells you what's wrong with your card:

```bash
node scripts/build.mjs --check
```

To see your card on the page, run `node scripts/build.mjs`, then `python3 -m http.server` and open <http://localhost:8000>. Don't commit `cards.json`. It's rebuilt automatically after merges.

## Rules

- Only add your own `cards/` file and your own photo.
- Don't edit `cards.json` or anyone else's card.
- If the check on your pull request fails, open the failed check. It names the file and the problem. Fix it, commit, and push again. The pull request updates itself.

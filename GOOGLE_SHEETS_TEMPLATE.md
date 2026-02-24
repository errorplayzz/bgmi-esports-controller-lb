# Google Sheets Template for BGMI Tournament

## Column Structure

Create a Google Sheet with exactly these columns in this order:

| Column | Header Name | Data Type | Description |
|--------|-------------|-----------|-------------|
| A | Team Name | Text | Name of the team |
| B | Match1 Placement | Number (1-25) | Placement in Match 1 |
| C | Match1 Kills | Number (0-99) | Kills in Match 1 |
| D | Match2 Placement | Number (1-25) | Placement in Match 2 |
| E | Match2 Kills | Number (0-99) | Kills in Match 2 |
| F | Match3 Placement | Number (1-25) | Placement in Match 3 |
| G | Match3 Kills | Number (0-99) | Kills in Match 3 |

## Sample Data

```
Team Name,Match1 Placement,Match1 Kills,Match2 Placement,Match2 Kills,Match3 Placement,Match3 Kills
Team Alpha,1,12,3,8,2,10
Team Beta,2,10,1,15,1,13
Team Gamma,3,8,2,11,4,7
Team Delta,4,6,5,5,3,9
Team Epsilon,5,7,4,8,5,6
Team Zeta,6,5,6,6,6,5
Team Eta,7,4,7,4,7,4
Team Theta,8,3,8,3,8,3
Team Iota,9,2,9,2,9,2
Team Kappa,10,1,10,1,10,1
Team Lambda,11,0,11,0,11,0
Team Mu,12,0,12,0,12,0
Team Nu,13,0,13,0,13,0
Team Xi,14,0,14,0,14,0
Team Omicron,15,0,15,0,15,0
```

## Instructions

1. **Create the spreadsheet:**
   - Go to [Google Sheets](https://sheets.google.com)
   - Create a new blank spreadsheet
   - Name it (e.g., "BGMI Tournament Leaderboard")

2. **Add the headers:**
   - Copy the column names above into Row 1
   - Make headers bold and centered for clarity

3. **Add team data:**
   - Start from Row 2
   - Enter team names and match data
   - Use 0 for kills if team was eliminated early
   - Leave cells empty if match hasn't been played yet

4. **Make it public:**
   - Click "Share" button (top right)
   - Change from "Restricted" to "Anyone with the link"
   - Set permission to "Viewer"
   - Click "Copy link"

5. **Get the Sheet ID:**
   - Your link looks like: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
   - Copy the SHEET_ID_HERE part
   - Paste it in your `.env` file as `GOOGLE_SHEET_ID`

## Point Calculation (Automatic)

The system will automatically calculate points based on:

**Placement Points:**
- 1st: 15 points
- 2nd: 12 points
- 3rd: 10 points
- 4th: 8 points
- 5th: 6 points
- 6th: 4 points
- 7th: 2 points
- 8th-16th: 0 points

**Kill Points:**
- 1 kill = 1 point

**Example:**
- Team finishes 1st with 12 kills = 15 + 12 = 27 points

## Tips

1. **Keep it simple:** Only update placement and kills, the system handles the rest
2. **Update after each match:** Add new match data as the tournament progresses
3. **Use consistent team names:** Exact spelling matters for tracking
4. **Backup your data:** Download as CSV/Excel periodically
5. **Test before event:** Try with sample data first

## Troubleshooting

**Data not updating?**
- Verify the sheet is publicly accessible
- Check the Sheet ID in .env is correct
- Ensure column order matches exactly
- Refresh the data from Control Center

**Wrong calculations?**
- Check all values are numbers (not text)
- Verify placement values are 1-20
- Ensure no empty cells in active rows
- Check for extra spaces in team names

## Example Google Sheet

You can create a copy of this example sheet:
[Sample Tournament Sheet](https://docs.google.com/spreadsheets/d/your_sheet_id/copy)

Or create your own following the template above.

---

**Note:** The first row must be headers. Data starts from row 2.

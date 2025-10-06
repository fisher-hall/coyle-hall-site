# Instagram Feed Implementation

## Overview
This implementation adds an Instagram feed at the bottom of every page, displaying the most recent posts from @realcoylehall.

## Implementation Details

### Files Modified
1. **themes/hugoplate/layouts/partials/essentials/footer.html**
   - Added Instagram feed partial inclusion at the top of the footer

2. **themes/hugoplate/layouts/partials/essentials/style.html**
   - Added DNS prefetch for Instagram domain to improve loading performance

### Files Created
1. **themes/hugoplate/layouts/partials/instagram-feed.html**
   - New partial containing the Instagram embed widget
   - Uses Instagram's official embed API
   - Displays the Instagram profile feed for @realcoylehall
   - Responsive design that works on mobile and desktop

## How It Works

The implementation uses Instagram's official embed widget, which:
- Automatically displays the most recent posts from the Instagram profile
- Is responsive and mobile-friendly
- Works without requiring API keys or authentication
- Loads asynchronously to avoid blocking page rendering
- Automatically updates when new posts are published

## Technical Details

### Instagram Embed Widget
- Uses Instagram's official `embed.js` script
- The blockquote element with `class="instagram-media"` is transformed by Instagram's script
- The `data-instgrm-permalink` attribute points to the Instagram profile URL
- The script loads asynchronously to avoid blocking page rendering

### Styling
- The feed section matches the site's existing design with `bg-light` and `dark:bg-darkmode-light` classes
- Centered layout with responsive sizing
- Maximum width of 540px for optimal Instagram post display

## Maintenance

No maintenance is required for this implementation. The feed will automatically:
- Display new posts as they are published to @realcoylehall
- Handle deleted or archived posts
- Adapt to Instagram's embed widget updates

## Troubleshooting

If the Instagram feed is not displaying:
1. Check that the Instagram account @realcoylehall is public
2. Verify that the Instagram embed script is loading (check browser console)
3. Ensure ad blockers or privacy extensions aren't blocking Instagram content
4. Check that the Instagram profile URL in `instagram-feed.html` is correct

## Alternative Implementations

If Instagram's embed widget needs to be replaced in the future, consider:
- **Instagram Basic Display API**: Requires authentication but provides more control
- **Third-party services**: Various services like EmbedSocial, Juicer, or Flockler
- **Manual curation**: A simple image gallery updated manually

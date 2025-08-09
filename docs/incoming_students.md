<p align="center"><img src="assets/images/favicon.png"></img></p>
<h1 align="center">Coyle Hall's Website</h1>

<h3 align="center"><a href="https://www.coylehallnd.com">www.coylehallnd.com</a></h3>

<hr>

## Editing Incoming Students information

### Adjusting the Welcome Weekend countdown

Within the <code>./static/Countdown.js</code> file, the date for the countdown is set. Line 2 shows how to format the date, and line 3 is where it can be edited.

```js
// Set your target date here (YYYY-MM-DD HH:MM:SS)
var targetDate = new Date("2025-08-22T09:00:00").getTime();
```

<em>Note: be sure to put a capital T in between the day and the hour</em>


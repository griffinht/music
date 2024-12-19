const { serve } = require('@hono/node-server')
const { Hono } = require('hono')
const fs = require('fs')
const path = require('path')

const app = new Hono()

// Serve the CSS file
app.get('/styles.css', (c) => {
  const cssContent = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8')
  return c.text(cssContent, 200, { 'Content-Type': 'text/css' })
})

// Base page with username input form
app.get('/', (c) => {
  const formHtml = `
    <html>
      <head>
        <title>Enter Your Last.fm and Spotify usernames</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <form onsubmit="event.preventDefault(); 
          const lastfm = document.getElementById('lastfm').value; 
          const spotifyUrl = document.getElementById('spotify').value;
          const spotifyMatch = spotifyUrl.match(/user\\/([^?]+)/);
          const spotify = spotifyMatch ? spotifyMatch[1] : '';
          window.location.href='/' + lastfm + (spotify ? '?spotify=' + spotify : '');">
          <h2>Your custom music page!</h2>
          <div class="input-group">
            <label for="lastfm"><a href="https://www.last.fm" class="lastfm-link">Last.fm</a> Username <span class="required">*</span></label>
            <input type="text" id="lastfm" placeholder="username" required>
          </div>
          <div class="input-group">
            <label for="spotify"><a href="https://www.spotify.com" class="spotify-link">Spotify</a> Profile URL <span class="optional">(optional)</span></label>
            <input type="text" id="spotify" placeholder="https://open.spotify.com/user/your-spotify-id">
          </div>
          <button type="submit">Generate Widget</button>
        </form>
      </body>
    </html>
  `
  return c.html(formHtml)
})

// Widget page that uses the username from the URL
app.get('/:username', (c) => {
  const username = c.req.param('username')
  const spotifyUsername = c.req.query('spotify')
  
  const widgetHtml = `
    <html>
      <head>
        <title>${username}'s Music Profile</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <div class="container">
          <iframe src="https://descent.live/${username}"></iframe>
          <div class="button-group">
            ${spotifyUsername ? `
              <a href="https://open.spotify.com/user/${spotifyUsername}" class="button spotify">Spotify Profile</a>
            ` : ''}
            <a href="https://www.last.fm/user/${username}" class="button lastfm">Last.fm Profile</a>
            <a href="https://lastfmstats.com/user/${username}/general" class="button stats">View Stats</a>
            <a href="https://scatterfm.markhansen.co.nz/graph.html#/user/${username}" class="button scatter">Scatter.FM Graph</a>
            <a href="https://receiptify.herokuapp.com" class="button receiptify">Create Your Receiptify</a>
          </div>
          <a href="https://www.last.fm/user/${username}">
            <iframe src="https://lastfm-recently-played.vercel.app/api?user=${username}&show_user=always&count=10" alt="Recently played tracks"></iframe>
          </a>
        </div>
      </body>
    </html>
  `
  return c.html(widgetHtml)
})

const port = parseInt(process.env.PORT || "8080", 10);
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})

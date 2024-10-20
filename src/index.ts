import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

// Base page with username input form
app.get('/', (c) => {
  const formHtml = `
    <html>
      <head>
        <title>Enter Your Last.fm Username</title>
        <style>
          body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f0f0f0; }
          form { background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          input { padding: 10px; margin: 10px 0; width: 200px; }
          button { padding: 10px 20px; background-color: #d51007; color: white; border: none; border-radius: 5px; cursor: pointer; }
        </style>
      </head>
      <body>
        <form onsubmit="event.preventDefault(); window.location.href='/' + document.getElementById('username').value;">
          <h2>Enter Your Last.fm Username</h2>
          <input type="text" id="username" placeholder="Your Last.fm username" required>
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
  
  const widgetHtml = `
    <div style="display: flex; flex-direction: column; align-items: center;">
      <a href="https://www.last.fm/user/${username}">
        <img src="https://lastfm-recently-played.vercel.app/api?user=${username}" height="auto" width="350px"/>
      </a>
      <div style="margin-top: 10px;">
        <img src="https://img.shields.io/endpoint?color=blueviolet&url=https://lastfm-last-played.biancarosa.com.br/${username}/latest-song?format=shields.io" alt="Now Playing" />
      </div>
      <div style="display: flex; gap: 10px; margin-top: 10px;">
        <a href="https://open.spotify.com/user/${username}" style="padding: 10px 20px; background-color: #1DB954; color: white; text-decoration: none; border-radius: 5px; font-family: Arial, sans-serif;">
          Spotify Profile
        </a>
        <a href="https://www.last.fm/user/${username}" style="padding: 10px 20px; background-color: #d51007; color: white; text-decoration: none; border-radius: 5px; font-family: Arial, sans-serif;">
          Last.fm Profile
        </a>
        <a href="https://lastfmstats.com/user/${username}/general" style="padding: 10px 20px; background-color: #4A76A8; color: white; text-decoration: none; border-radius: 5px; font-family: Arial, sans-serif;">
          View Stats
        </a>
      </div>
      <a href="https://receiptify.herokuapp.com" style="margin-top: 15px; padding: 10px 20px; background-color: #FF69B4; color: white; text-decoration: none; border-radius: 5px; font-family: Arial, sans-serif;">
        Create Your Receiptify
      </a>
      <iframe src="https://descent.live/${username}" style="width: 100%; height: 500px; border: none; margin-top: 20px;"></iframe>
    </div>
  `
  return c.html(widgetHtml)
})

const port = parseInt(process.env.PORT || "8080", 10);
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})

import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()
//https://github.com/biancarosa/lastfm-last-played?tab=readme-ov-file
app.get('/', (c) => {
  const username = 'griffin_ht'
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
      <iframe src="https://descent.live/griffin_ht" style="width: 100%; height: 500px; border: none; margin-top: 20px;"></iframe>
    </div>
  `
  return c.html(widgetHtml)
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})

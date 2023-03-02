import { getMultiProfilesByHandles } from "lib/did/link3"

export default async function handler(req, res) {
  const { profileIDs } = req.body
  if (req.method === 'POST') {
    if (profileIDs) {
      const handles = []

      for (const id of profileIDs) {
        const response = await fetch(`https://link3.to/id/${id}`, {
          method: 'GET',
        })
        const resString = await response.text()
        const regx = /(?<=<script.*?id="__NEXT_DATA__".*?>)(.*?)(?=<\/script>)/g
        const matched = JSON.parse(resString.match(regx)[0])

        if (matched?.props?.pageProps?.handle) {
          handles.push(matched.props.pageProps.handle)
        }
      }

      const profiles = await getMultiProfilesByHandles(handles)

      if (!profiles) {
        res.status(400).end()
      }

      res.json({
        profiles
      })
    } else {
      res.status(400).end()
    }
  } else {
    res.end()
  }
}

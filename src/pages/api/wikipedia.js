import { getImageFromWikipedia, getThumbnailFromWikipedia } from "../../../libs/image_search";

export default async function handle(req, res) {
    if (req.method === 'GET' && req.query.plantimage) {
        //`/api/wikipedia?plantimage=Rhododendron&size=thumbnail`
        //return an object with "width" (integer), "height" (integer), and "source" (url string, can be hotlinked directly)
        try {switch (req.query.size) {
            case "original": {
                const image = await getImageFromWikipedia(req.query.plantimage);
                // console.log("ORIGINAL IMAGE API")
                // console.log(image)
                return res.json(image.original);
            }
            case "thumbnail": {
                const image = await getThumbnailFromWikipedia(req.query.plantimage);
                // console.log("THUMBNAIL API")
                // console.log(image)
                return res.json(image.thumbnail);
            }
            default: {
                break
            }
        }}
        catch (error) {
            console.error(error)
            return res.status(error.status || 500).end(error.message)
          }

      } else {
        return res.status(400).json({ message: 'Missing plant name' })
      }
  }
  
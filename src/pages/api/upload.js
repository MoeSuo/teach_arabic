// api/upload.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const upload = multer({ dest: 'public/useravatar/' });

export default async function handle(req, res) {
  try {
    if (req.method === 'POST') {
      upload.single('image')(req, res, async (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to upload image.' });
        }

        const imageFile = req.file;
        const imagePath = path.join('/useravatar/', imageFile.filename);

        // Rename the file to maintain the original file extension
        const newImagePath = path.join('public', imagePath + path.extname(imageFile.originalname));
        fs.renameSync(imageFile.path, newImagePath);

        return res.status(200).json(imagePath);
      });
    } else {
      return res.status(405).end(); // Method Not Allowed
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

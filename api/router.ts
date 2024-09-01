import { VercelRequest, VercelResponse } from '@vercel/node';
import { registerFont } from 'canvas';
import path from 'path';
import generateImage from '../utils/getImage';
// Font kayıtları
registerFont(path.join(process.cwd(), 'public', 'fonts', 'NewAmsterdam-Regular.ttf'), { family: "NewAmsterdam" });
registerFont(path.join(process.cwd(), 'public', 'fonts', 'PixelifySans-Bold.ttf'), { family: "PixelifySans", weight: 'bold' });
registerFont(path.join(process.cwd(), 'public', 'fonts', 'Roboto-Regular.ttf'), { family: "Roboto" });
registerFont(path.join(process.cwd(), 'public', 'fonts', 'Roboto-Bold.ttf'), { family: "Roboto", weight: 'bold' });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { losses } = req.query;

  if (!losses || typeof losses !== 'string') {
    return res.status(400).json({ message: 'Invalid losses parameter' });
  }

  try {
    const parsedLosses = JSON.parse(decodeURIComponent(losses));
    if (!Array.isArray(parsedLosses)) {
      throw new Error('Losses must be an array');
    }

    const canvas = await generateImage(parsedLosses);
    const buffer = canvas.toBuffer('image/png');
    res.setHeader('Content-Type', 'image/png');
    res.send(buffer);
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(400).json({ message: 'Invalid losses data' });
  }
}
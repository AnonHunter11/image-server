import { createCanvas, loadImage } from 'canvas';
interface Loss {
    image: string; // URL or path to the image
    amount: string;
  }

interface LossItem {
  loss: string;
  item: string;
}

export default async function getImage(losses: Array<{loss: string, item: string}>) {
  const sortedLosses = losses.sort((a, b) => parseFloat(b.loss) - parseFloat(a.loss));
  const totalLoss = sortedLosses.reduce((sum, loss) => sum + parseFloat(loss.loss), 0);
  // Set up the canvas
  const width = 400;
  const height = 400;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.font = '24px "Roboto"';

  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Header
  ctx.fillStyle = '#0000FF';
  ctx.fillRect(0, 0, width, 60);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px "PixelifySans"';
  ctx.fillText('REKT', 25, 45);

  // Main text
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 28px "Roboto"';
  ctx.fillText('You got rekt!', 25, 100);
  ctx.font = '20px "Roboto"';
  ctx.fillText(`You could have been ${totalLoss.toFixed(2)} SOL richer.`, 25, 130);

  // Top 3 Losses

  ctx.font = 'bold 24px "NewAmsterdam"';
  ctx.fillText(`Top ${Math.min(sortedLosses.length, 3)} Losses`, 25, 180);

  // Draw loss images and amounts
  for (let i = 0; i < Math.min(sortedLosses.length, 3); i++) {
    const los = sortedLosses[i];
    const img = await loadImage(los.item);
    const imageX = 25 + i * 125;
    ctx.drawImage(img, imageX, 200, 100, 100*img.naturalHeight/img.naturalWidth);
    ctx.fillStyle = '#FF0000';
    ctx.font = 'bold 14px "NewAmsterdam"';
    const metrics = ctx.measureText(`-${Number(los.loss).toFixed(2)} SOL`);
    const textWidth = metrics.width;
    const centerX = imageX + (width - textWidth) / 2 - 150;
    ctx.fillText(`-${Number(los.loss).toFixed(2)} SOL`, centerX, 100*img.naturalHeight/img.naturalWidth + 215);
  }
  return canvas;
}



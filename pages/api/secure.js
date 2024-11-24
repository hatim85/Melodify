import { Buffer } from 'buffer';

export default async (req, res) => {
  const projectId = process.env.PINATA_API_KEY;
  const projectSecret = process.env.PINATA_API_SECRET;
  const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString('base64')}`;

  res.status(200).json({ data: auth });
};

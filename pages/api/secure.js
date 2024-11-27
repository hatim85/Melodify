import { Buffer } from 'buffer';

export default async (req, res) => {
  const projectId = process.env.NEXT_PUBLIC_PINATA_API_KEY;
  const projectSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET;
  const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString('base64')}`;
  // console.log("secure.js auth: ",auth)
  res.status(200).json({ data: auth });
};

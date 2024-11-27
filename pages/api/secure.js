import { Buffer } from 'buffer';

export default async (req, res) => {
  const projectId = "ed92658ec886e7f4e3d9";
  const projectSecret = "b7f0734e47a9d27cb7cb2295d9cc9cfb8969dee4a64ff704a1ba116762614674";
  const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString('base64')}`;
  // console.log("secure.js auth: ",auth)
  res.status(200).json({ data: auth });
};

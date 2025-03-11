import axios from 'axios';
import cheerio from 'cheerio';

export default async (req, res) => {
  const { url } = req.body;
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const data = $('h1').text(); // Extract data (customize this)
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: 'Scraping failed' });
  }
};
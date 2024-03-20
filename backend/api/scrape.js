import Scraper from "../models/scraper.js";

export const post = async (req, res) => { 
  try {      
    let url = req.body.scrapeDetails.url
          let recipe = await Scraper.getRecipe(url)
          return res.status(200).json({recipe})
      
  } catch (error) {
      return res.status(400).json({error})
  }
}
const ApiScrape = {
  post
}

export default ApiScrape 
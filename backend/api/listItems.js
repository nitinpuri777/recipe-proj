import ListItem from "../models/listItem.js";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function get(req, res, next) {
  try {
    console.log(`api-get: ${req.params.listId}`)
    const listItems = await ListItem.getListItems(req.params.listId)
    res.status(200).json({listItems})
  } catch (error) {
    console.error(error)
    next(error)
  }
}
async function add(req, res, next) {
  try {
    console.log(`api-add: ${req.params.listId} - ${req.body}`)
    let listItems = await ListItem.addListItem(req.params.listId, req.body.itemDetails) 
    res.status(200).json({listItems}) 
  } catch (error) {
    console.log(error)
    next(error)
  }
}
async function delete_(req, res, next) {
  try {
    await ListItem.deleteListItem(req.params.listId, req.params.listItemId)
    res.status(200).json({message:'Successfully deleted.'})
  } catch (error) {
    console.error(error)
    next(error)
  }
}

async function update(req, res, next) {
  try {
    console.log(req.body.itemDetails)
    await ListItem.updateListItem(req.body.itemDetails)
    res.status(200).json({message:'Successfully updated.'})
  } catch (error) {
    console.error(error)
    next(error)
  }
}

async function categorize(req, res, next) {
  try {
    const items = req.body.items;
    const batchSize = 10; // Define a suitable batch size
    const categorizedItems = {};

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const prompt = `Please categorize these grocery items by store section/aisle. 
      Return only a JSON object where the keys are the item names and the values are their categories. Make sure to include every single item I send you and return the item name identically including all punctuation and spacing.
      Use these categories only: Produce, Meat & Seafood, Dairy & Eggs, Pantry, Frozen, Beverages, Bakery, Snacks, Condiments, Spices & Seasonings, Other.
      
      Items to categorize:
      ${batch.map(item => item.ingredientName).join(', ')}`;

      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        max_tokens: 1000 // Adjust max_tokens as needed
      });

      const responseContent = completion.choices[0].message.content;
      console.log('OpenAI Response:', responseContent);

      if (!responseContent.trim().endsWith('}')) {
        console.error('Incomplete JSON response');
        return res.status(500).json({ error: 'Incomplete JSON response from OpenAI' });
      }

      try {
        const batchCategorizedItems = JSON.parse(responseContent);
        Object.assign(categorizedItems, batchCategorizedItems);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return res.status(500).json({ error: 'Failed to parse categorization response' });
      }
    }

    res.status(200).json({ categorizedItems });
  } catch (error) {
    console.error('Categorization error:', error);
    next(error);
  }
}

const ApiListItems = {
  get,
  add,
  update,
  delete_,
  categorize
}

export default ApiListItems
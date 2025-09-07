import ListItem from "../models/listItem.js";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

function simplifyIngredientName(name) {
  // Extract the main ingredient by removing parenthetical descriptions and detailed prep instructions
  let simplified = name
    .replace(/\([^)]*\)/g, '') // Remove everything in parentheses
    .replace(/,.*$/, '') // Remove everything after the first comma
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  // If we removed too much and got empty, use original but clean it up
  if (!simplified) {
    simplified = name.replace(/\s+/g, ' ').trim();
  }
  
  return simplified;
}

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
    const batchSize = 8; // Smaller batch size for complex items
    const categorizedItems = {};
    
    console.log(`Starting categorization for ${items.length} items`);

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i/batchSize) + 1} with ${batch.length} items`);
      
      // Create a mapping of simplified names to original names
      const nameMapping = {};
      const simplifiedNames = [];
      
      batch.forEach(item => {
        const simplified = simplifyIngredientName(item.ingredientName);
        nameMapping[simplified] = item.ingredientName;
        simplifiedNames.push(simplified);
        console.log(`Simplified: "${item.ingredientName}" -> "${simplified}"`);
      });

      const prompt = `Categorize these grocery items by store section. Return ONLY a valid JSON object with no additional text or formatting.

Categories: Produce, Meat & Seafood, Dairy & Eggs, Pantry, Frozen, Beverages, Bakery, Snacks, Condiments, Spices & Seasonings, Canned Goods, Other

Items: ${simplifiedNames.join(', ')}

Format: {"item": "category", "item2": "category2"}`;

      try {
        const completion = await openai.chat.completions.create({
          messages: [{ 
            role: "system", 
            content: "You are a grocery categorization assistant. Return only valid JSON with no additional text or explanation."
          }, { 
            role: "user", 
            content: prompt 
          }],
          model: "gpt-3.5-turbo",
          temperature: 0.3,
          max_tokens: 800,
          timeout: 15000
        });

        let responseContent = completion.choices[0].message.content.trim();
        console.log('OpenAI Response:', responseContent);

        // Clean up the response - remove any markdown code blocks or extra text
        responseContent = responseContent.replace(/```json/g, '').replace(/```/g, '').trim();
        
        // Find the JSON object in the response
        const jsonStart = responseContent.indexOf('{');
        const jsonEnd = responseContent.lastIndexOf('}') + 1;
        
        if (jsonStart === -1 || jsonEnd === 0) {
          console.error('No JSON object found in response:', responseContent);
          continue; // Skip this batch
        }
        
        const jsonString = responseContent.substring(jsonStart, jsonEnd);
        console.log('Extracted JSON:', jsonString);

        try {
          const batchCategorizedItems = JSON.parse(jsonString);
          
          // Map simplified names back to original names
          Object.keys(batchCategorizedItems).forEach(simplifiedName => {
            const originalName = nameMapping[simplifiedName];
            if (originalName) {
              categorizedItems[originalName] = batchCategorizedItems[simplifiedName];
              console.log(`Mapped: "${simplifiedName}" -> "${originalName}" = ${batchCategorizedItems[simplifiedName]}`);
            }
          });
          
        } catch (parseError) {
          console.error('JSON parse error for batch:', parseError, 'Attempted to parse:', jsonString);
          // Continue with other batches instead of failing completely
          continue;
        }
      } catch (openaiError) {
        console.error('OpenAI API error for batch:', openaiError);
        // Continue with other batches rather than failing completely
        continue;
      }
    }

    console.log(`Categorization completed. Returning ${Object.keys(categorizedItems).length} categorized items`);
    
    // Ensure we always return a valid response
    const response = { categorizedItems };
    res.status(200).json(response);
    
  } catch (error) {
    console.error('Categorization error:', error);
    // Ensure we return a proper error response instead of letting it bubble up
    res.status(500).json({ 
      error: 'Failed to categorize items', 
      categorizedItems: {} 
    });
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
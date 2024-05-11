import ListItem from "../models/listItem.js";


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

const ApiListItems = {
  get,
  add,
  update,
  delete_
}

export default ApiListItems
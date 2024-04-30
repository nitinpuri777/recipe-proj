import ListItem from "../models/listItem.js";


async function get(req, res, next) {
  try {
    console.log(`api: ${req.params.listId}`)
    const response = await ListItem.getListItems(req.params.listId)
    res.status(200).json({response})
  } catch (error) {
    console.error(error)
    next(error)
  }
}
async function add(req, res, next) {
  try {
    console.log(`api ${req.params.listId}`)
    let response = await ListItem.addListItem(req.params.listId, req.body.itemDetails) 
    res.status(200).json({response}) 
  } catch (error) {
    console.error(error)
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

const ApiListItems = {
  get,
  add,
  delete_
}

export default ApiListItems
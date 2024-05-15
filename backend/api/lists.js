import List from "../models/list.js";

async function find(req,res,next) {
  try {
    let userId = req.user.id
    let lists = await List.findAllListsForUser(userId)
    res.status(200).json({lists})
  } catch (error) {
    next(error)
  }
}

async function delete_(req,res, next) {
  try {
    console.log(`line 15 -- lists.js -- ${req.params.id}`)
    await List.deleteList(req.params.id)
    res.status(200).send('Succesfully deleted list.')
  } catch (error) {
    next(error)
  }
}

async function create(req,res, next) {
  try {
    let userId = req.user.id
    let listName = ""
    if(req.body.name) {
      listName = req.body.name
    }
    console.log(`got line 25 lists.js ${userId}`)
    let list = await List.createListForUser(userId, listName)
    res.status(200).json({list})
  } catch (error) {
    next(error)
  }
}

const ApiLists = {
  find,
  create,
  delete_
}

export default ApiLists


import { Model, DataTypes } from 'sequelize';

class ListItem extends Model {
  static async initModel(sequelize) {
    ListItem.init({
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      listId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'lists',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      ingredientName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      quantity: {
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      unitOfMeasure: {
        type: DataTypes.STRING,
        allowNull: false
      },
      category: {
        type: DataTypes.STRING
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, { sequelize, modelName: 'listItem', tableName: 'list_items' });
  }

  static async getListItems(listId) {
    try {
      return await ListItem.findAll({
        where:{
          listId
        }
      })
    } catch (error) {
      throw new Error('COULD_NOT_GET_LIST_ITEMS')
    }
  }
  
  static async addListItem(listId, itemDetails) {
    try {
      console.log(`model: ${listId} ${itemDetails}`)
      return await ListItem.create({
        listId: listId,
        ingredientName: itemDetails.ingredientName,
        quantity: itemDetails.quantity,
        unitOfMeasure: itemDetails.unitOfMeasure
      })
    } catch (error) {
      console.error(`error: ${error}`)
      throw new Error('COULD_NOT_CREATE_LIST_ITEM')
    }
    
  }

  static async updateListItem(listItemId, updatedlistItem){
    try {
      let itemToUpdate = ListItem.findByPk(listItemId)
      itemToUpdate.update(updatedlistItem)
    } catch (error) {
      throw new Error('COULD_NOT_UPDATE_ITEM')
    }
    

  }

  static async deleteListItem(listId, listItemId) {
    try {
      let itemToDelete = await ListItem.findByPk(listItemId)
      if (itemToDelete.listId == listId) {
        itemToDelete.destroy()
      }
      else {
        throw new Error('ITEM_NOT_PART_OF_LIST')
      }
    } catch (error) {
      console.error(`error: ${error}`)
      throw new Error('COULD_NOT_DELETE')
    }
    
  }
}

export default ListItem
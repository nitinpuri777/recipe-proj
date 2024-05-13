import { Model, DataTypes } from 'sequelize';

class List extends Model {
  static async initModel(sequelize) {
    List.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        defaultValue: () => `Shopping List ${new Date().toLocaleDateString()}`,
        allowNull: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Ensure this matches your users table name (usually pluralized)
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      // Add any other fields as needed here, for example:
      // name: DataTypes.STRING,
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW // Sequelize handles the timestamp creation
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW // Sequelize handles the timestamp creation
      }
    }, { sequelize, modelName: 'list' });
  }

  static async createListForUser(userId) {
    try {
      return await List.create({
        userId: userId
      })
    } catch (error) {
      console.error(`error: ${error}`)
      throw new Error('COULD_NOT_CREATE_LIST')
    }
    
  }
  static async findAllListsForUser(userId) {
    try {
      return await List.findAll({
        where: {
          userId
        }
      })
    } catch (error) {
      console.error(`error: ${error}`)
      throw new error('COULD_NOT_FIND_LISTS_FOR_USER')
    }
   
  }
  static async deleteList(listId) {
    try {
      console.log(`line 63 -- list.js ${listId}`)
      let listToDelete = await List.findByPk(listId)
      console.log(`line 65 -- list.js ${listToDelete}`)
      listToDelete.destroy()
    } catch (error) {
      console.error(`error: ${error}`)
      throw new error('COULD_NOT_DELETE')
    }
    
  }
}

export default List
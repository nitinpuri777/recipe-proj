import MealPlan from "../models/mealPlan.js";

export const create = async (req, res) => {
  try {
    console.log('Received request to create meal plan:', req.body);
    const userId = req.user.id;
    const mealPlanData = { ...req.body, user_id: userId };
    const mealPlan = await MealPlan.createMealPlan(mealPlanData);
    console.log('Meal plan created successfully:', mealPlan);
    res.status(201).json({ mealPlan });
  } catch (error) {
    console.error('Error in creating meal plan:', error);
    res.status(400).json({ error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const mealPlan = await MealPlan.updateMealPlan(req.params.id, req.body);
    res.status(200).json({ mealPlan });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const delete_ = async (req, res) => {
  try {
    await MealPlan.deleteMealPlan(req.params.id);
    res.status(200).json({ message: 'Successfully deleted meal plan.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const ApiMealPlans = {
  create,
  update,
  delete_
};

export default ApiMealPlans; 
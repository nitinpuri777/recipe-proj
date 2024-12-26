import MealPlan from "../models/mealPlan.js";

export const create = async (req, res) => {
  try {
    const userId = req.user.id;
    const mealPlanData = { ...req.body, user_id: userId };
    const mealPlan = await MealPlan.createMealPlan(mealPlanData);
    res.status(201).json({ mealPlan });
  } catch (error) {
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

export const get = async (req, res) => {
  try {
    const mealPlans = await MealPlan.getMealPlans(req.user.id);
    res.status(200).json({ mealPlans });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meal plans' });
  }
};

const ApiMealPlans = {
  create,
  update,
  delete_,
  get
};

export default ApiMealPlans; 
Drop view if exists heroku_52b3caaac7494c9.recipe_ingredients_view;

Create or replace view heroku_52b3caaac7494c9.recipe_ingredients_view as
  select r.*,
  i.name as ingredient_name, i.tier, i.tag_names as ingredient_tag_names, i.category_ids,
  ri.ingredient_id,
  np.saturated_fats, np.sodium
  from heroku_52b3caaac7494c9.recipes r
  join heroku_52b3caaac7494c9.recipeingredients ri on ri.recipe_id = r.id
  join heroku_52b3caaac7494c9.ingredients i on ri.ingredient_id= i.id
  join heroku_52b3caaac7494c9.nutritionalprofiles np on np.id = r.nutritional_profile_id;
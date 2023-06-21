Drop view if exists thedinne_backend.recipe_ingredients_view;

Create or replace view thedinne_backend.recipe_ingredients_view as
  select r.*,
  i.name as ingredient_name, i.tier, i.tag_names as ingredient_tag_names, i.category_ids,
  ri.ingredient_id,
  np.saturated_fats, np.sodium
  from thedinne_backend.recipes r
  join thedinne_backend.recipeingredients ri on ri.recipe_id = r.id
  join thedinne_backend.ingredients i on ri.ingredient_id= i.id
  join thedinne_backend.nutritionalprofiles np on np.id = r.nutritional_profile_id;
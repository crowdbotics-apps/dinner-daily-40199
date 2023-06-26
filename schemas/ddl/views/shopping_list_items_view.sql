Drop view if exists heroku_52b3caaac7494c9.shopping_list_items_view;

Create or replace view heroku_52b3caaac7494c9.shopping_list_items_view as
  select sli.*, sc.name, i.search_term, uwm.user_id, uwm.start_date from
  heroku_52b3caaac7494c9.shoppinglistitems sli
  join heroku_52b3caaac7494c9.shoppingcategories sc on sc.id = sli.shopping_category
  join heroku_52b3caaac7494c9.shoppinglists sl on sl.id = sli.shopping_list_id
  join heroku_52b3caaac7494c9.userweekmenus uwm on uwm.id = sl.user_week_menu_id
  left join heroku_52b3caaac7494c9.ingredients i on i.id = sli.ingredient_id;
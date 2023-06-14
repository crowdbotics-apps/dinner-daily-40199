Drop view if exists thedinne_backend.shopping_list_items_view;

Create or replace view thedinne_backend.shopping_list_items_view as
  select sli.*, sc.name, i.search_term, uwm.user_id from
  thedinne_backend.shoppinglistitems sli
  join thedinne_backend.shoppingcategories sc on sc.id = sli.shopping_category
  join thedinne_backend.shoppinglists sl on sl.id = sli.shopping_list_id
  join thedinne_backend.userweekmenus uwm on uwm.id = sl.user_week_menu_id
  left join thedinne_backend.ingredients i on i.id = sli.ingredient_id;
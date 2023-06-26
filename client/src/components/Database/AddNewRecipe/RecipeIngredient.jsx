import React,{useEffect, useState} from "react"
import { Table} from "antd"
import {Button,Row,Image } from "react-bootstrap"
import svg from "../../../assets/images/svg/index"
import AddIngredients from "../AddIngredients"
import DeleteIngredient from "../AddIngredients/DeleteIngredient"
import { ingredientsColumns} from "../../../utils/tableColumn"
import { IS_STAPLE_NO, IS_STAPLE_YES } from "../../../utils/constants"

const RecipeIngredient = (props)=>{
  const {measurmentlist} = props;
  const [showAddIngredient, setshowAddIngredient] = useState(false)
  const [showDeleteIngredient, setshowDeleteIngredient] = useState(false)
  const [ingredientData,setIngredientData] = useState([]);
  const [alterData,setalterData] = useState({});

  useEffect(()=>{
    if(props?.ingredients.length){
      ingredientsRow(props?.ingredients)
    }
  },[props?.ingredients])

  useEffect(()=>{
    if(ingredientData?.length){
      props?.ingredientdata(ingredientData)
    }
  },[ingredientData])

  const handleAdd = ()=>{
    setalterData(null);
    setshowAddIngredient(true)
  }

  const handleIngredientDelete = data => {
      setshowDeleteIngredient(true)
      setalterData(data)
  }

  const handleIngredientEdit = data => {
       setalterData(data);
       setshowAddIngredient(true)
  }

  const hideModal = (type, data, cond)=>{
    if(type === 'add' && data) showAddedIngredientData(data);
    if(type === 'delete'){
       switch(cond){
        case 'new':
          const Index = ingredientData.findIndex((item) =>item.sno  === data);
          deleteSuccess(Index)
          break;
        case 'old':
          const index = ingredientData.findIndex((item) =>item.rid  === data);
          deleteSuccess(index);
          props?.isdelete(true);
          break;
        default:
          return
       }
    }
    setshowAddIngredient(false)
    setalterData(null); 
    setshowDeleteIngredient(false)
  }

  function deleteSuccess(index){
    const ingredient = [...ingredientData];
    ingredient.splice(index, 1);
    setIngredientData(ingredient.map((item,ele)=>{
       return {
           ...item,
           key:ele+1,
       }
    }))
  }

  const RenderAction = (element)=>{
    return( 
    <div className="edit-del-cont">
          <div className="edit-img cursor-pointer">
            <img
              src={svg?.editicon}
              className="edit-icon"
              onClick={() =>handleIngredientEdit(element)}
              alt="edit icon NP"
            />
          </div>
          <div className="edit-img cursor-pointer">
            <img
              src={svg?.deleteicon}
              className="delete-icon"
              onClick={() =>handleIngredientDelete(element)}
              alt="delete icon NP"
            />
          </div>
        </div>
    )
  }

const ingredientsRow = (res)=>{
  let data = [];
  for (let i = 0; i < res?.length; i++) {
    data?.push({
      ...res[i],
      sno:i+1,
      key:i+1,
      name: res[i]?.name,
      measurement_name:res[i]?.measurement_name,
      amount:res[i]?.amount,
      preparation:res[i]?.preparation || "",
      is_optional:res[i]?.is_optional ? IS_STAPLE_YES : IS_STAPLE_NO,
      is_round_up_for_half_family_size:res[i]?.is_round_up_for_half_family_size? IS_STAPLE_YES : IS_STAPLE_NO,
      actions: RenderAction(res[i])
    })
  }
  setIngredientData(data);
}

function showAddedIngredientData (data){
  const ingredient = [...ingredientData];
    if(data?.sno){
      const Index = ingredient.findIndex((item) =>item.sno  === data?.sno);
      ingredient[Index] = {
         sno:data.sno,
         key:data.key ? data.key:Index+1,
        ...updateObject(data),
        actions:RenderAction(data)
      }
      setIngredientData(ingredient);
    }else if(data?.rid){
      const Index = ingredient.findIndex((item) =>item.rid  === data?.rid);
      ingredient[Index] = {
         rid:data?.rid,
         key:Index+1,
        ...updateObject(data),
        actions:RenderAction(data)
      }
       setIngredientData(ingredient);
    }else{
      const listData = {
        sno:data?.sno ? data?.sno: ingredientData.length + 1,
        key:data?.key ? data?.key: ingredientData.length + 1,
        ...updateObject(data)
      }
      listData['actions']= RenderAction({...data,sno:listData.sno});
      setIngredientData((prev)=>[...prev, listData]);
    }  
}

function updateObject (data){
 return {
  name: data?.ingredients?.label,
  ingredientId:data?.ingredients?.value,
  measurement_name:measurmentlist?.find((item)=>item.id === parseInt(data?.measurmentId))?.name,
  amount:data?.amount,
  measurmentId:data?.measurmentId,
  preparation:data?.preparation,
  is_optional:parseInt(data?.is_optional) === 1? IS_STAPLE_YES: IS_STAPLE_NO,
  is_round_up_for_half_family_size:parseInt(data?.is_round_up_for_half_family_size) === 1 ? IS_STAPLE_YES: IS_STAPLE_NO,
  }
}

    return(
      <>
      <Row className="ingredient-row mt-4">
              <div className="body-heading1-wrapper">
                <span className="body-heading1 d-flex">Ingredient</span>
                <Button
                  variant="primary"
                  className="add-user-btn"
                  onClick={handleAdd}
                >
                  <Image
                    src={svg?.plusicon}
                    alt="Button image"
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                  />
                  Add Ingredient
                </Button>
              </div>
              <div className="ingredient-listing mt-3">
                  <Table
                    className="ingredients-table w-100"
                    columns={ingredientsColumns}
                    dataSource={ingredientData}
                    row={record => ({
                      style: { paddingTop: "20px" }
                    })}
                  />
              </div>
            </Row>
            {showAddIngredient && (
            <AddIngredients
              show={showAddIngredient}
              onHide={hideModal}
              alterdata={alterData}
              measurmentlist={measurmentlist}
            />
        )}
        {showDeleteIngredient && (
          <DeleteIngredient
            show={showDeleteIngredient}
            onHide={hideModal}
            deletedata={alterData}
          />
        )}
     </>
            
    )
}

export default RecipeIngredient
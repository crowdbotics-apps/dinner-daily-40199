import React,{useEffect, useState} from "react"
import { Table} from "antd"
import {Button,Row,Image } from "react-bootstrap"
import svg from "../../../assets/images/svg/index"
import AddSides from "../AddSides"
import DeleteSide from "../AddSides/DeleteSide"
import { sidesColumns2,sidesColumns1} from "../../../utils/tableColumn"
// let _ = require("lodash");

const RecipeSide = (props)=>{
  const [sideData, setSideData] = useState(null);
  const [sideList, setSideList] = useState([]);
  const [showAddSide, setshowAddSide] = useState(false);
  const [showDeleteSide, setshowDeleteSide] = useState(false)

  useEffect(()=>{
   if(props?.sides.length){
      formatSideData(props?.sides)
   }
  },[props.sides])

  useEffect(()=>{
    if(sideList?.length){
      props?.sidedata(sideList)
    }
  },[sideList])

  const handleAdd = ()=>{
    setSideData(null);
    setshowAddSide(true);
  }

  const handleSideEdit = data => {
    setSideData(data);
    setshowAddSide(true);
  }

  const handleSideDelete = data => {
    setSideData(data)
    setshowDeleteSide(true)
  }

  const hideModal = (type, data, cond)=>{
    if(type === 'add' && data) showAddedSideData(data);
    if(type === 'delete'){
       switch(cond){
        case 'new':
          const Index = sideList.findIndex((item) =>item.sno === data);
          deleteSuccess(Index)
          break;
        case 'old':
          const index = sideList.findIndex((item) =>item.rsid  === data);
          deleteSuccess(index);
          break;
        default:
          return
       }
    }
    setSideData(null)
    setshowAddSide(false) 
    setshowDeleteSide(false)
  }


  function deleteSuccess(index){
    const side = [...sideList];
    side.splice(index, 1);
    setSideList(side.map((item,ele)=>{
       return {
           ...item,
           key:ele+1,
       }
    }))
  }

  function formatSideData (sidesList){
    const resultArray = sidesList.reduce((outKey, inputKey) => {
      let key = inputKey.recipe_side_combination_id
      outKey[key] = outKey[key] || [];
      outKey[key].push(inputKey);
      return outKey;
  }, Object.create(null));
  const updateArray = Object.values(resultArray)
    sideRows(updateArray);
  }

  

  const RenderAction = (element)=>{

    return( 
      <div className="edit-del-cont">
      <div className="edit-img cursor-pointer">
        <img
          src={svg?.editicon}
          className="edit-icon"
          onClick={() =>handleSideEdit(element)}
          alt="edit icon NP"
        />
      </div>
      <div className="edit-img cursor-pointer">
        <img
          src={svg?.deleteicon}
          className="delete-icon"
          onClick={() =>handleSideDelete(element)}
          alt="delete icon NP"
        />
      </div>
    </div>
    )
  }

  const sideRows = (updateArray)=>{
    let data = []
     for(let i=0; i< updateArray.length;i++){
      const side_0 = updateArray[i]?.filter((item)=>item.side ===0);
      const ArrayData ={
        key:i+1,
        rsid:updateArray[i][0]?.recipe_side_combination_id,
        firstSideids:side_0.map((side)=>side.hash_tag_id),
        firstSides:side_0?.map((item)=>{
            return{
              value:item?.hash_tag_id,
              label:item?.name
            }
        }),
        firstSide:side_0?.map((side)=>side.name).join(', '),
        }
        if(parseInt(props?.totalside) === 2){
          const side_1 = updateArray[i]?.filter((item)=>item.side ===1);
          ArrayData.secondSides=side_1?.map((item)=>{
                  return{
                        value:item?.hash_tag_id,
                        label:item?.name
                    }
                  });
          ArrayData.secondSideids=side_1.map((side)=>side.hash_tag_id);
          ArrayData.secondSide= side_1?.map((side)=>side.name).join(', ');
        }    
      data.push(ArrayData)
    }
  setSideList(data?.map((item)=>{
     return {
        ...item,
       actions:RenderAction(item)
      }
  }));
  }

  function showAddedSideData (data){
    const sides = [...sideList];
      if(data?.sno){
        const Index = sides.findIndex((item) =>item?.sno === data?.sno);
        sides[Index] = {
           sno:data.sno,
           key:data.key ? data.key:Index+1,
          ...updateObject(data),
          actions:RenderAction(data)
        }
        setSideList(sides);
      }else if(data?.rsid){
        const Index = sides.findIndex((item) =>item?.rsid  === data?.rsid);
        sides[Index] = {
           rsid:data?.rsid,
           key:data?.key,
          ...updateObject(data),
          actions:RenderAction(data)
        }
        setSideList(sides);
      }else{
        const listData = {
          sno:data?.sno ? data?.sno: sideList.length + 1,
          key:data?.key ? data?.key: sideList.length + 1,
          ...updateObject(data)
        }
        listData['actions']= RenderAction({...data,sno:listData.sno});
        setSideList((prev)=>[...prev, listData]);
      }  
  }

  function updateObject (res){
    const newList = {
      firstSide:res?.firstSide.map((side)=>side.label).join(', '),
      firstSideids:res?.firstSide.map((side)=>side.value),
    }
    if(parseInt(props?.totalside) === 2) {
      newList.secondSide = res?.secondSide.length > 0 ? res?.secondSide.map((side)=>side.label).join(", "):"";
      newList.secondSideids=res?.secondSide.map((side)=>side.value);
    }
      return {...newList}
  }

    return (
      <>
        <Row className="edit-sides-row">
        <div className="body-heading1-wrapper">
          <span className="body-heading1 d-flex">Sides</span>
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
            Add Side
          </Button>
        </div>
        <div className="ingredient-listing mt-3">
            <Table
              className="ingredients-table w-100"
              columns={parseInt(props?.totalside) === 2 ? sidesColumns2:sidesColumns1}
              dataSource={sideList}
              row={record => ({
                style: { paddingTop: "20px" }
              })}
            />
        </div>
      </Row>
      {showAddSide && (
          <AddSides 
           show={showAddSide} 
           onHide={hideModal} 
           tags={props?.tags} 
           totalside={parseInt(props?.totalside)}
           alterdata={sideData} 
          />
        )}
        {showDeleteSide && (
          <DeleteSide
            show={showDeleteSide}
            onHide={hideModal}
            alterdata={sideData}
          />
        )}
      </>
    )
}
export default RecipeSide
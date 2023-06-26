import React, { useState, useEffect } from "react"
import Loader from "../../../customComponents/Spinner"
import { Table, Input, Space } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import svg from "../../../assets/images/svg/index"
import "./ingredients.scss"
import { Button, Image } from "react-bootstrap"
import AddNew from "./AddNew.jsx"
import DeleteIngredient from "./DeleteIngredient"
import CategoriesHierarchy from "../CategoriesHierarchy"
import { adminIngredients,ingredientCategory,shoppingCategory,ingredientMeausurment, tags } from "../../../api/request"
import { IS_STAPLE_YES, STATUS_PENDING, STATUS_PUBLIC, IS_STAPLE_NO } from "../../../utils/constants"

const Ingredients = () => {
  const [showAddpopup, setShowAddpopup] = useState(false);
  const [showEditpopup, setShowEditpopup] = useState(false);
  const [showDeletepopup, setShowDeletepopup] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [alterData, setAlterData] = useState(null);
  const [Loading, setLoading] = useState(false);
  const [shoppingCategories,setShoppingCategories] = useState([]);
  const [ingredientCategories,setIngredientCategories] = useState([]);
  const [ingredientMeausurments,setIngredientMeausurments] = useState([]);
  const [tagList,setTagList] = useState([]);
  const [showCategoriesDiv, setShowCategoriesDiv] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    sortField:"id",
    sortValue:"asc",
    total: 0
  });
  
  useEffect(() => {
    fetchIngredients(pagination);
  }, [pagination.current,pagination.pageSize,pagination.sortField,pagination.sortValue])

  useEffect(()=>{
      getShoppingCategories()
      getIngredientMeausurments()
      getIngredientCategories()
      getTags()
  },[])
  
  async function getTags(){
    let resp = await tags();
    if(resp?.status){
      setTagList(resp?.data)
    }
  }

  async function getShoppingCategories(){
    let resp = await shoppingCategory();
    if(resp?.status){
      setShoppingCategories(resp?.data)
    }
  }

  async function getIngredientCategories(){
    let resp = await ingredientCategory();
    if(resp?.status){
      setIngredientCategories(resp?.data)
    }
  }

  async function getIngredientMeausurments(){
    let resp = await ingredientMeausurment();
    if(resp?.status){
      setIngredientMeausurments(resp?.data)
    }
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name - b.name,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Name"
            value={selectedKeys[0]}
            onChange={e =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters()}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      )
    },
    {
      title: "Plural name",
      dataIndex: "plural_name",
      sorter: (a, b) => a.plural_name - b.plural_name,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Plural Name"
            value={selectedKeys[0]}
            onChange={e =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters()}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      )
    },
    {
      title: "Status",
      dataIndex: "status",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Status"
            value={selectedKeys[0]}
            onChange={e =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters()}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      )
    },
    {
      title: "Tier",
      dataIndex: "tier",
      sorter: (a, b) => a.tier - b.tier,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Tier"
            value={selectedKeys[0]}
            onChange={e =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters()}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      )
    },
    {
      title: "Is Staple",
      dataIndex: "isStaple",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Staple"
            value={selectedKeys[0]}
            onChange={e =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters()}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      )
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Tags",
      dataIndex: "tags"
    },
    {
      title: "Actions",
      dataIndex: "actions"
    }
  ]

  const handleCategories = () => {
    console.log("inside handleCategories function")
    setShowCategoriesDiv(true)
  }

  const closeCategories = () => {
    setShowCategoriesDiv(false)
  }

  const fetchIngredients = async (pagination ) => {
    setLoading(true)
    const payload = {
      ...pagination,
      page: pagination?.current,
    }
    try {
      const response = await adminIngredients(payload);
      if(response?.status){
      const res = response?.data
      const data = []
      for (let i = 0; i < res?.length; i++) {
        data?.push({
          id: res[i]?.id,
          key:i+1,
          name: res[i]?.name,
          plural_name: res[i]?.plural_name,
          status: res[i]?.status ? STATUS_PUBLIC : STATUS_PENDING,
          tier: res[i]?.tier,
          isStaple: res[i]?.is_staple ? IS_STAPLE_YES: IS_STAPLE_NO,
          category: res[i]?.categoryName,
          tags: res[i]?.tag_names,
          actions: (
            <div className="edit-del-wrapper">
              <div className="edit-img cursor-pointer">
                <img
                  src={svg?.editicon}
                  className="edit-icon"
                  onClick={() => handleEdit(res[i])}
                  alt="edit icon NP"
                />
              </div>
              <div className="edit-img cursor-pointer">
                <img
                  src={svg?.deleteicon}
                  className="delete-icon"
                  onClick={() => handleDelete(res[i])}
                  alt="delete icon NP"
                />
              </div>
            </div>
          )
        })
      }
      setFilteredData(data)
      setPagination({
        ...pagination,
        total: response?.total_items
      })
      }
    } catch (error) {
      console.error(error)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const handleTableChange = (paginationData, filters, sorter) => {
     const paginationUpdate = {
      current: paginationData.current,
      pageSize: paginationData.pageSize,
      total: paginationData.total
     }
     if(sorter?.field) paginationUpdate.sortField = sorter.field;
     else paginationUpdate.sortField = pagination.sortField;
     if(sorter?.order) paginationUpdate.sortValue = sorter.order === "ascend" ? "asc" : "desc";
     else paginationUpdate.sortValue = pagination.sortValue;
     setPagination({...paginationUpdate});
  }


  const handleDelete = (data) => {
    setAlterData(data)
    setShowDeletepopup(true)
    setShowEditpopup(false)
    setShowAddpopup(false)
  }

  const handleEdit = (data) => {
    setAlterData(data)
    setShowEditpopup(true)
    setShowAddpopup(false)
    setShowDeletepopup(false)
  }
  const hideModal = (data) => {
    if(data){
      fetchIngredients(pagination);
    }
    setAlterData(null)
    setShowAddpopup(false)
    setShowEditpopup(false)
    setShowDeletepopup(false)
  }

  return (
    <>
      <div className="Ingredients-container">
        <>
          <div className="table-heading">Listing</div>
          <div className="table-heading-wrapper">
            <div className="category-listing-wrapper">
              <div className="category-listing">Categories hierarchy</div>
              <>
                {showCategoriesDiv === false ? (
                  <img
                    src={svg?.downarrow}
                    className="downarrow"
                    alt="down arrow NP"
                    onClick={() => handleCategories()}
                  />
                ) : (
                  <img
                    src={svg?.uparrow}
                    className="downarrow"
                    alt="down arrow NP"
                    onClick={() => closeCategories()}
                  />
                )}
              </>
            </div>

            <Button
              variant="primary"
              className="add-user-btn"
              onClick={() => setShowAddpopup(true)}
            >
              <Image
                src={svg?.plusicon}
                alt="Button image"
                width="30"
                height="30"
                className="d-inline-block align-top"
              />
              Add New
            </Button>
          </div>
          <>{showCategoriesDiv && <CategoriesHierarchy ingredcate={ingredientCategories} changecategory={getIngredientCategories}/>}</>
          {Loading === true ? (
            <Loader loadingMsg="Data is Loading... Please Wait" />
          ) : (
            <Table
              className="ingredients-table w-100"
              columns={columns}
              dataSource={filteredData}
              pagination={pagination}
              onChange={handleTableChange}
              row={record => ({
                style: { paddingTop: "20px" }
              })}
            />
          )}
        </>
      </div>
      <>
        {showAddpopup && (
          <AddNew show={showAddpopup} onHide={hideModal} shopcate={shoppingCategories} ingredcate={ingredientCategories} ingrdmeas={ingredientMeausurments} tagdata={tagList}/>
        )}
      </>
      <>
        {showEditpopup && alterData && (
          <AddNew show={showEditpopup} onHide={hideModal} alterdata={alterData} shopcate={shoppingCategories} ingredcate={ingredientCategories} ingrdmeas={ingredientMeausurments} tagdata={tagList}/>
        )}
      </>
      <>
        {showDeletepopup && alterData &&(
          <DeleteIngredient show={showDeletepopup} onHide={hideModal} alterdata={alterData}/>
        )}
      </>
    </>
  )
}

export default Ingredients

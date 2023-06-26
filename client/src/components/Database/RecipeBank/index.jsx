import React, { useEffect, useState } from "react"
import Loader from "../../../customComponents/Spinner"
import { Table, Input, Space } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import svg from "../../../assets/images/svg/index"
import { Button, Image, Form } from "react-bootstrap"
import EditRecipeBank from "./EditRecipeBank.jsx"
import DeleteRecipeBank from "./DeleteRecipeBank.jsx"

const RecipeBank = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })
  const [userData, setData] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [filteredData, setFilteredData] = useState(userData)
  const [Loading, setLoading] = useState(false)
  const [showEditPopup, setShowEditPopup] = useState(false)
  const [showDeletepopup, setshowDeletepopup]= useState(false);
  const [editdata, seteditdata] = useState({})

  const columns = [
    {
      title: "Bank",
      dataIndex: "bank",
    },
    {
      title: "Sort Order",
      dataIndex: "sortorder",
    },
    {
      title: "Recipe",
      dataIndex: "recipe",
    },
    {
      title: "Actions",
      dataIndex: "actions"
    }
  ]

  useEffect(() => {
    fetchUsers(pagination.current, pagination.pageSize)
  }, [pagination.current, pagination.pageSize])

  const fetchUsers = async (page, pageSize, searchTxt = "") => {
    setLoading(true)
    console.log("searchedText inside fetch users", searchTxt)
    console.log("page inside fetch users", page)
    const payload = {
      page: page,
      user_type: 2, //for customer user_type=1
      search: searchTxt
    }
    try {
      // const response = await adminusers(payload)
      // console.log("response from adminusers", response)
      // let res = response?.results
      const res = [
        {
          id: 859,
          bank: "Bank A",
          sortorder:2,
          recipe:'Chopped Iceberg & Tomatoes'
        },
        {
          id: 859,
          bank: "Bank A",
          sortorder:2,
          recipe:'Chopped Iceberg & Tomatoes'
        },
        {
          id: 859,
          bank: "Bank A",
          sortorder:2,
          recipe:'Chopped Iceberg & Tomatoes'
        },
        {
          id: 859,
          bank: "Bank A",
          sortorder:2,
          recipe:'Chopped Iceberg & Tomatoes'
        },
        {
          id: 859,
          bank: "Bank A",
          sortorder:2,
          recipe:'Chopped Iceberg & Tomatoes'
        },
        {
          id: 859,
          bank: "Bank A",
          sortorder:2,
          recipe:'Chopped Iceberg & Tomatoes'
        },
        {
          id: 859,
          bank: "Bank A",
          sortorder:2,
          recipe:'Chopped Iceberg & Tomatoes'
        },
        {
          id: 859,
          bank: "Bank A",
          sortorder:2,
          recipe:'Chopped Iceberg & Tomatoes'
        },
      ]
      const data = []
      for (let i = 0; i < res?.length; i++) {
        data?.push({
          bank: res[i]?.bank,
          sortorder: res[i]?.sortorder,
          recipe: res[i]?.recipe,
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
                  onClick={() => handleDelete()}
                  alt="delete icon NP"
                />
              </div>
            </div>
          )
        })
      }
      setData(data)
      setFilteredData(data)
      setTotalCount(res?.length)
      setPagination({
        current: page,
        pageSize: 10,
        total: res?.length
      })
    } catch (error) {
      console.error(error)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const handleTableChange = ({ current, pageSize }) => {
    setPagination({ ...pagination, current, pageSize })
  }

  const handleEdit = data => {
    setShowEditPopup(true)
    seteditdata({
      bankname: data?.bank,
      sortorder: data?.sortorder,
      recipe: data?.recipe
    })
  }

  const handleDelete = () => {
    setShowEditPopup(false)
    setshowDeletepopup(true)
  }

  const hideModal = () => {
    setShowEditPopup(false)
    setshowDeletepopup(false);
  }

  return (
    <div className="RecipeBank-listing">
      <>
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

      <>
        {showEditPopup === true && (
          <EditRecipeBank
            editdata={editdata}
            show={showEditPopup}
            onHide={hideModal}
          />
        )}
      </>
      <>
        {showDeletepopup === true && (
          <DeleteRecipeBank show={showDeletepopup} onHide={hideModal} />
        )}
      </>
    </div>
  )
}

export default RecipeBank

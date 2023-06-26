import React, { useEffect, useState } from "react"
import Loader from "../../../customComponents/Spinner"
import { Table, Input, Space } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import svg from "../../../assets/images/svg/index"
import { Button, Image, Form } from "react-bootstrap"
import EditRecipeGroup from "./EditRecipeGroup.jsx"
import DeleteRecipeGroup from "./DeleteRecipeGroup.jsx"

const RecipeGroup = () => {
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
  const [editdata, seteditdata] = useState("")

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
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
          Name: "Easy Pork Tenderloin/Roast"
        },
        {
          id: 859,
          Name: "Easy Pork Tenderloin/Roast"
        },
        {
          id: 859,
          Name: "Easy Pork Tenderloin/Roast"
        },
        {
          id: 859,
          Name: "Easy Pork Tenderloin/Roast"
        },
        {
          id: 859,
          Name: "Easy Pork Tenderloin/Roast"
        },
        {
          id: 859,
          Name: "Easy Pork Tenderloin/Roast"
        }
      ]
      const data = []
      for (let i = 0; i < res?.length; i++) {
        data?.push({
          name: res[i]?.Name,
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
    seteditdata(data?.Name)
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
    <div className="RecipeGroup-listing">
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
          <EditRecipeGroup
            editdata={editdata}
            show={showEditPopup}
            onHide={hideModal}
          />
        )}
      </>
      <>
        {showDeletepopup === true && (
          <DeleteRecipeGroup show={showDeletepopup} onHide={hideModal} />
        )}
      </>
    </div>
  )
}

export default RecipeGroup

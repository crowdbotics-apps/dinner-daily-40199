import React, { useEffect, useState } from "react"
import Loader from "../../../customComponents/Spinner"
import { Table } from "antd"

const StoresPrevEndWeek = props => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })
  const [userData, setData] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [filteredData, setFilteredData] = useState(userData)
  const [Loading, setLoading] = useState(false)
  const columns = [
    {
      title: "Store",
      dataIndex: "store"
    },
    {
      title: "Current week (week start date)",
      dataIndex: "currentweekdate"
    },
    {
      title: "Previous week (week start date)",
      dataIndex: "previousweekdate"
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
          store: "Kroger Ohio Cincinnati-Miami Valley",
          currentweekdate: "04/07/2023 08:00 AM EDT (04/03/2023)",
          previousweekdate: "03/31/2023 08:00 AM EDT (03/27/2023)"
        },
        {
          store: "Kroger Ohio Cincinnati-Miami Valley",
          currentweekdate: "04/07/2023 08:00 AM EDT (04/03/2023)",
          previousweekdate: "03/31/2023 08:00 AM EDT (03/27/2023)"
        },
        {
          store: "Kroger Ohio Cincinnati-Miami Valley",
          currentweekdate: "04/07/2023 08:00 AM EDT (04/03/2023)",
          previousweekdate: "03/31/2023 08:00 AM EDT (03/27/2023)"
        },
        {
          store: "Kroger Ohio Cincinnati-Miami Valley",
          currentweekdate: "04/07/2023 08:00 AM EDT (04/03/2023)",
          previousweekdate: "03/31/2023 08:00 AM EDT (03/27/2023)"
        },
        {
          store: "Kroger Ohio Cincinnati-Miami Valley",
          currentweekdate: "04/07/2023 08:00 AM EDT (04/03/2023)",
          previousweekdate: "03/31/2023 08:00 AM EDT (03/27/2023)"
        },
        {
          store: "Kroger Ohio Cincinnati-Miami Valley",
          currentweekdate: "04/07/2023 08:00 AM EDT (04/03/2023)",
          previousweekdate: "03/31/2023 08:00 AM EDT (03/27/2023)"
        }
      ]
      const data = []
      for (let i = 0; i < res?.length; i++) {
        data?.push({
          store: res[i]?.store,
          currentweekdate: res[i]?.currentweekdate,
          previousweekdate: res[i]?.previousweekdate
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

  return (
    <div className="StoresPrevEndWeek-wrapper">
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
    </div>
  )
}

export default StoresPrevEndWeek

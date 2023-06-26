import React, { useState, useEffect } from "react"
import Select from "react-select"
import { Modal, Button, Form } from "react-bootstrap"
import Loader from "../../../customComponents/Spinner"
import { Table, Input, Space } from "antd"
import { useFormik } from "formik"
import "./recipecomp.scss"

const options = [
  { value: "option1", label: "Boneless Chicken Breast" },
  { value: "option2", label: "(5) Breaded Parmesan Ranch Chicken " },
  { value: "option3", label: "(5) Breaded Parmesan Ranch" },
  { value: "option4", label: "Mango Salad" },
  { value: "option5", label: "Boneless Chicken Breast" },
  { value: "option6", label: "(5) Breaded Parmesan Ranch Chicken " },
  { value: "option7", label: "(5) Breaded Parmesan Ranch" },
  { value: "option8", label: "Mango Salad" }
]

const RecipeComparision = () => {
  const [selectedOptions, setSelectedOptions] = useState([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })
  const [userData, setData] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [filteredData, setFilteredData] = useState(userData)
  const [Loading, setLoading] = useState(false)
  const handleSelect = selected => {
    setSelectedOptions(selected)
  }

  const columns = [
    {
      title: "Recipe",
      dataIndex: "recipe"
    },
    {
      title: "Matching ingredients",
      dataIndex: "matchingredients"
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
          recipe:
            "1813. (PUBLISH-need bulb of garlic and edit NV's ) White Bean Stew with Garlic",
          matchingredients: "1. boneless chicken breast (39)"
        },
        {
          recipe:
            "1813. (PUBLISH-need bulb of garlic and edit NV's ) White Bean Stew with Garlic",
          matchingredients: "1. boneless chicken breast (39)"
        },
        {
          recipe:
            "1813. (PUBLISH-need bulb of garlic and edit NV's ) White Bean Stew with Garlic",
          matchingredients: "1. boneless chicken breast (39)"
        },
        {
          recipe:
            "1813. (PUBLISH-need bulb of garlic and edit NV's ) White Bean Stew with Garlic",
          matchingredients: "1. boneless chicken breast (39)"
        },
        {
          recipe:
            "1813. (PUBLISH-need bulb of garlic and edit NV's ) White Bean Stew with Garlic",
          matchingredients: "1. boneless chicken breast (39)"
        },
        {
          recipe:
            "1813. (PUBLISH-need bulb of garlic and edit NV's ) White Bean Stew with Garlic",
          matchingredients: "1. boneless chicken breast (39)"
        },
        {
          recipe:
            "1813. (PUBLISH-need bulb of garlic and edit NV's ) White Bean Stew with Garlic",
          matchingredients: "1. boneless chicken breast (39)"
        },
        {
          recipe:
            "1813. (PUBLISH-need bulb of garlic and edit NV's ) White Bean Stew with Garlic",
          matchingredients: "1. boneless chicken breast (39)"
        }
      ]
      const data = []
      for (let i = 0; i < res?.length; i++) {
        data?.push({
          recipe: res[i]?.recipe,
          matchingredients: res[i]?.matchingredients
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
    <div className="recipe-comparision-container">
      <div className="choose-recipe-wrapper mt-2">
        <div className="text-label">Choose Recipe: </div>
        <Form.Select
          required
          label={"Please choose a Recipe"}
          name={"bankname"}
          // value={showSelectedBank}
          // onChange={e => handleBankdropdownChange(e)}
          className={`form-control choose-recipe-select`}
        >
          <option value="" className="role-item">
            Choose Recipe
          </option>
          <option value="Bank A" className="role-item">
            Bank A
          </option>
          <option value="Bank B" className="role-item">
            Bank B
          </option>
          <option value="Bank C" className="role-item">
            Bank C
          </option>
        </Form.Select>
      </div>

      <div className="exclude-ingredients-wrapper mt-4">
        <div className="text-label">Exclude Ingredients</div>
        <Select
          isMulti
          options={options}
          value={selectedOptions}
          onChange={handleSelect}
          placeholder="Start typing name of ingredients"
          className="exclude-ing-select"
        />
      </div>

      <div className="recipe-com-listing mt-4">
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
    </div>
  )
}

export default RecipeComparision

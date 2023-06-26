import React, { useState, useEffect } from "react";
import Loader from "../../../customComponents/Spinner";
import { Table, Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { debounce } from "lodash";
import svg from "../../../assets/images/svg/index";
import { Button, Image, Form } from "react-bootstrap";
import RecipeGroup from "../RecipeGroup";
import AsyncSelect from "react-select/async";
import "./recipies.scss";
import AddRecipeGroup from "../RecipeGroup/AddRecipeGroup";
import AddRecipeBank from "../RecipeBank/AddRecipeBank";
import RecipeBank from "../RecipeBank";
import RecipeComparision from "../RecipeComparision";
import { adminRecipes, tags, adminIngredients } from "../../../api/request";
import {
    multiSelectValue,
    formatDishtype,
    formatStatus,
    formateDateTime,
} from "../../../utils/helpers";
import { IS_STAPLE_NO, IS_STAPLE_YES } from "../../../utils/constants";
import AddNewRecipe from "../AddNewRecipe";
import { ingredientMeausurment } from "../../../api/request";
import DeleteRecipe from "./DeleteRecipe";

const Recipies = () => {
    const [tagList, setTagList] = useState([]);
    const [measurmentList, setMeasurmentList] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        sortField: "id",
        sortValue: "asc",
        total: 0,
    });
    const [filteredData, setFilteredData] = useState([]);
    const [Loading, setLoading] = useState(false);
    const [getError, setError] = useState(false);
    const [showRecipeGroup, setShowRecipeGroup] = useState(false);
    const [showSelectedValue, setSelectedValue] = useState("");
    const [showAddRecGroup, setshowAddRecGroup] = useState(false);
    const [showAddRecBank, setshowAddRecBank] = useState(false);
    const [showRecipeBank, setShowRecipeBank] = useState(false);
    const [showRecipeComp, setShowRecipeComp] = useState(false);
    const [showAddpopup, setShowAddpopup] = useState(false);
    const [deletePopup, showDeletepopup] = useState(false);
    const [alterData, setAlterData] = useState({});
    const [filters, setFilters] = useState({
        tags: "",
        ingredients: "",
        hierearchy: "",
    });
    const [defaultOptions, setDefaultOptions] = useState([]);
    const paginations = {
        page: 1,
        pageSize: 10,
        sortField: "id",
        sortValue: "asc",
    };

    useEffect(() => {
        fetchRecipes(pagination);
    }, [
        pagination.current,
        pagination.pageSize,
        pagination.sortField,
        pagination.sortValue,
    ]);

    useEffect(() => {
        fetchIngredients();
    }, []);

    const handleDelete = (data) => {
        setAlterData(data);
        showDeletepopup(true);
    };

    const handleEdit = (data) => {
        setAlterData(data);
        setShowAddpopup(true);
    };

    const fetchIngredients = async () => {
        try {
            const response = await adminIngredients(paginations);
            if (response?.status) {
                setDefaultOptions(multiSelectValue(response?.data));
            }
        } catch (error) {
            setError(error?.message);
        }
    };

    const handleNewRecipe = () => {
        setAlterData(null);
        setShowAddpopup(true);
    };

    useEffect(() => {
        getTags();
        getIngredientMeasurment();
    }, []);

    async function getTags() {
        let resp = await tags(true);
        if (resp?.status) {
            setTagList(resp?.data);
        }
    }

    async function getIngredientMeasurment() {
        let resp = await ingredientMeausurment();
        if (resp?.status) {
            setMeasurmentList(resp?.data);
        }
    }

    const hideModal = (data) => {
        if (data) {
            fetchRecipes(pagination);
        }
        setshowAddRecGroup(false);
        setAlterData(null);
        setshowAddRecBank(false);
        setShowAddpopup(false);
        showDeletepopup(false);
    };

    // Debounce function with a delay of 3 milliseconds
    const delayedSearch = debounce(async (searchTerm) => {
        const searchQuery = {
            ...paginations,
            searchTerm,
        };
        const response = await adminIngredients(searchQuery);
        if (response?.status) {
            return multiSelectValue(response?.data);
        }
    }, 300);

    const promiseOptions = (inputValue) =>
        new Promise((resolve) => {
            setTimeout(() => {
                resolve(delayedSearch(inputValue));
            }, 1000);
        });

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            filterDropdown: ({
                setSelectedKeys,
                selectedKeys,
                confirm,
                clearFilters,
            }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Search ID"
                        value={selectedKeys[0]}
                        onChange={(e) =>
                            setSelectedKeys(
                                e.target.value ? [e.target.value] : []
                            )
                        }
                        onPressEnter={() => confirm()}
                        style={{
                            width: 188,
                            marginBottom: 8,
                            display: "block",
                        }}
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
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
            filterDropdown: ({
                setSelectedKeys,
                selectedKeys,
                confirm,
                clearFilters,
            }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Search name"
                        value={selectedKeys[0]}
                        onChange={(e) =>
                            setSelectedKeys(
                                e.target.value ? [e.target.value] : []
                            )
                        }
                        onPressEnter={() => confirm()}
                        style={{
                            width: 188,
                            marginBottom: 8,
                            display: "block",
                        }}
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
            ),
        },
        {
            title: "Dish Type",
            dataIndex: "dishtype",
            filterDropdown: ({
                setSelectedKeys,
                selectedKeys,
                confirm,
                clearFilters,
            }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Search Dish type"
                        value={selectedKeys[0]}
                        onChange={(e) =>
                            setSelectedKeys(
                                e.target.value ? [e.target.value] : []
                            )
                        }
                        onPressEnter={() => confirm()}
                        style={{
                            width: 188,
                            marginBottom: 8,
                            display: "block",
                        }}
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
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            filterDropdown: ({
                setSelectedKeys,
                selectedKeys,
                confirm,
                clearFilters,
            }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Search Status"
                        value={selectedKeys[0]}
                        onChange={(e) =>
                            setSelectedKeys(
                                e.target.value ? [e.target.value] : []
                            )
                        }
                        onPressEnter={() => confirm()}
                        style={{
                            width: 188,
                            marginBottom: 8,
                            display: "block",
                        }}
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
            ),
        },
        {
            title: "Tested",
            dataIndex: "tested",
            filterDropdown: ({
                setSelectedKeys,
                selectedKeys,
                confirm,
                clearFilters,
            }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder="Search Tested"
                        value={selectedKeys[0]}
                        onChange={(e) =>
                            setSelectedKeys(
                                e.target.value ? [e.target.value] : []
                            )
                        }
                        onPressEnter={() => confirm()}
                        style={{
                            width: 188,
                            marginBottom: 8,
                            display: "block",
                        }}
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
            ),
        },
        {
            title: "Date Created",
            dataIndex: "datecreated",
            filterDropdown: ({
                setSelectedKeys,
                selectedKeys,
                confirm,
                clearFilters,
            }) => (
                <div style={{ padding: 8 }}>
                    <input
                        type="date"
                        id="datepicker"
                        className="form-control"
                    />
                </div>
            ),
        },
        {
            title: "Date Updated",
            dataIndex: "dateupdated",
            filterDropdown: ({
                setSelectedKeys,
                selectedKeys,
                confirm,
                clearFilters,
            }) => (
                <div style={{ padding: 8 }}>
                    <input
                        type="date"
                        id="datepicker"
                        className="form-control"
                    />
                </div>
            ),
        },
        {
            title: "Actions",
            dataIndex: "actions",
        },
    ];

    const fetchRecipes = async (pagination) => {
        setLoading(true);
        const payload = {
            page: pagination?.current,
            pageSize: pagination?.pageSize,
            sortField: pagination?.sortField,
            sortValue: pagination?.sortValue,
        };
        try {
            const response = await adminRecipes(payload);
            if (response?.status) {
                let res = response?.data;
                const data = [];
                for (let i = 0; i < res?.length; i++) {
                    data?.push({
                        ...res[i],
                        key: i + 1,
                        id: res[i]?.id,
                        name: res[i]?.name,
                        dishtype: formatDishtype(res[i]?.dish_type),
                        status: formatStatus(res[i]?.status),
                        tested:
                            res[i]?.is_tested === 1
                                ? IS_STAPLE_YES
                                : IS_STAPLE_NO,
                        datecreated: formateDateTime(res[i]?.created),
                        dateupdated: formateDateTime(res[i]?.updated),
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
                                <div className="edit-img cursor-pointer">
                                    <img
                                        src={svg?.duplicateicon}
                                        className="duplicate-icon"
                                        //onClick={() => handleDelete()}
                                        alt="delete icon NP"
                                    />
                                </div>
                                <div className="edit-img cursor-pointer">
                                    <img
                                        src={svg?.printicon}
                                        className="print-icon"
                                        //   onClick={() => handleDelete()}
                                        alt="delete icon NP"
                                    />
                                </div>
                            </div>
                        ),
                    });
                }
                setFilteredData(data);
                setPagination({
                    current: pagination?.current,
                    pageSize: pagination?.pageSize,
                    sortField: pagination?.sortField,
                    sortValue: pagination?.sortValue,
                    total: response?.total_items,
                });
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const renderRecipeComponent = () => {
        if (showSelectedValue === "Recipe Groups") {
            // setShowRecipeGroup(true);
            return <RecipeGroup />;
        } else if (showSelectedValue === "Recipe Banks") {
            return <RecipeBank />;
        } else if (showSelectedValue === "Recipe Comparision") {
            return <RecipeComparision />;
        }
    };

    const handleTableChange = ({ current, pageSize }) => {
        setPagination({ ...pagination, current, pageSize });
    };

    const handleDropdownReset = () => {
        setSelectedValue("");
        setShowRecipeBank(false);
        setShowRecipeGroup(false);
        setShowRecipeComp(false);
    };

    const handledropdownChange = (e) => {
        console.log("inside handledropdownChange", e?.target?.value);
        setSelectedValue(e?.target?.value);
        if (e?.target?.value === "Recipe Groups") {
            setShowRecipeGroup(true);
            setShowRecipeBank(false);
            setShowRecipeComp(false);
        } else if (e?.target?.value === "Recipe Banks") {
            setShowRecipeGroup(false);
            setShowRecipeBank(true);
            setShowRecipeComp(false);
        } else if (e?.target?.value === "Recipe Comparision") {
            setShowRecipeGroup(false);
            setShowRecipeBank(false);
            setShowRecipeComp(true);
        }
    };

    return (
        <>
            <div className="Recipies-container">
                <>
                    <div className="table-heading-wrapper">
                        <div className="left-side-wrapper d-flex">
                            <div className="table-heading">
                                <>
                                    {showRecipeGroup === true
                                        ? "Recipe Group"
                                        : showRecipeBank === true
                                        ? "Recipe Bank"
                                        : showRecipeComp === true &&
                                          "Recipe Comparison"}
                                </>{" "}
                                Listing
                            </div>

                            {/* <span className="dropdown-heading">Select a Recipie</span> */}
                            <Form.Select
                                required
                                label={"Please select a Status"}
                                name={"Status"}
                                value={showSelectedValue}
                                onChange={(e) => handledropdownChange(e)}
                                className={`mt-2 form-control role-edit-select recipe-select`}
                            >
                                <option value="" className="role-item">
                                    Select Recipe
                                </option>
                                <option
                                    value="Recipe Groups"
                                    className="role-item"
                                >
                                    Recipe Groups
                                </option>
                                <option
                                    value="Recipe Banks"
                                    className="role-item"
                                >
                                    Recipe Banks
                                </option>
                                <option
                                    value="Recipe Comparision"
                                    className="role-item"
                                >
                                    Recipe Comparision
                                </option>
                            </Form.Select>
                            {/* <img src={svg?.refreshicon} className="reset-icon" alt="reset-icon-np" /> */}
                            <span
                                className="reset"
                                onClick={() => handleDropdownReset()}
                            >
                                Reset
                            </span>
                        </div>

                        <div className="table-btn-wrapper">
                            <>
                                {showRecipeGroup === true ? (
                                    <Button
                                        variant="primary"
                                        className="add-user-btn"
                                        onClick={() => setshowAddRecGroup(true)}
                                    >
                                        <Image
                                            src={svg?.plusicon}
                                            alt="Button image"
                                            width="30"
                                            height="30"
                                            className="d-inline-block align-top"
                                        />
                                        Add New Recipe Group
                                    </Button>
                                ) : showRecipeBank === true ? (
                                    <Button
                                        variant="primary"
                                        className="add-user-btn"
                                        onClick={() => setshowAddRecBank(true)}
                                    >
                                        <Image
                                            src={svg?.plusicon}
                                            alt="Button image"
                                            width="30"
                                            height="30"
                                            className="d-inline-block align-top"
                                        />
                                        Add New Recipe Bank
                                    </Button>
                                ) : (
                                    showRecipeComp === false && (
                                        <Button
                                            variant="primary"
                                            className="add-user-btn"
                                            onClick={handleNewRecipe}
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
                                    )
                                )}
                            </>
                        </div>
                    </div>

                    <>
                        {showSelectedValue?.length > 0 ? (
                            renderRecipeComponent()
                        ) : (
                            <>
                                <div className="recipe-filters-wrapper">
                                    <Form.Select
                                        required
                                        label={"Print"}
                                        name={"Status"}
                                        // value={values.Status}
                                        className={`mt-2 form-control print-select recipe-select`}
                                    >
                                        <option
                                            value="role"
                                            className="role-item"
                                        >
                                            Print
                                        </option>
                                        <option value="1" className="role-item">
                                            Print full
                                        </option>
                                        <option value="2" className="role-item">
                                            Print halved
                                        </option>
                                    </Form.Select>
                                    <AsyncSelect
                                        className="reactive-select print-select"
                                        cacheOptions
                                        loadOptions={promiseOptions}
                                        defaultOptions={defaultOptions}
                                        value={filters?.ingredients}
                                        onChange={(e) =>
                                            setFilters({
                                                ...filters,
                                                ingredients: e,
                                            })
                                        }
                                    />
                                    <Form.Select
                                        label={"Filter by tag..."}
                                        name={"tags"}
                                        value={filters?.tags}
                                        onChange={(e) =>
                                            setFilters({
                                                ...filters,
                                                tags: e.target.value,
                                            })
                                        }
                                        className={`mt-2 form-control print-select recipe-select`}
                                    >
                                        <option
                                            value=""
                                            disabled
                                            className="role-item"
                                        >
                                            Filter by tag...
                                        </option>
                                        {tagList.map((item, index) => {
                                            return (
                                                <option
                                                    key={index + 1}
                                                    value={item?.id}
                                                    className="role-item"
                                                >
                                                    {item?.name}
                                                </option>
                                            );
                                        })}
                                    </Form.Select>

                                    <Form.Select
                                        required
                                        label={"Filter by hierearchy..."}
                                        name={"hierearchy"}
                                        value={filters.hierearchy}
                                        onChange={(e) =>
                                            setFilters({
                                                ...filters,
                                                hierearchy: e.target.value,
                                            })
                                        }
                                        className={`mt-2 form-control print-select recipe-select`}
                                    >
                                        <option
                                            value=""
                                            disabled
                                            className="role-item"
                                        >
                                            Filter by hierearchy...
                                        </option>
                                    </Form.Select>
                                    {/* 
                  <Button
                    variant="primary"
                    className="add-user-btn"
                    // onClick={() => setShowAddpopup(true)}
                  >
                    Upload Nutrition
                  </Button> */}
                                </div>
                                {Loading === true ? (
                                    <Loader loadingMsg="Data is Loading... Please Wait" />
                                ) : (
                                    <Table
                                        className="ingredients-table w-100"
                                        columns={columns}
                                        dataSource={filteredData}
                                        pagination={pagination}
                                        onChange={handleTableChange}
                                        row={(record) => ({
                                            style: { paddingTop: "20px" },
                                        })}
                                    />
                                )}
                            </>
                        )}
                    </>
                </>
                <>
                    {showAddpopup && (
                        <AddNewRecipe
                            show={showAddpopup}
                            onHide={hideModal}
                            alterdata={alterData}
                            taglist={tagList}
                            measurmentlist={measurmentList}
                        />
                    )}
                </>
                <>
                    {showAddRecGroup && (
                        <AddRecipeGroup
                            show={showAddRecGroup}
                            onHide={hideModal}
                        />
                    )}
                </>
                <>
                    {deletePopup && (
                        <DeleteRecipe
                            show={deletePopup}
                            onHide={hideModal}
                            delete={alterData}
                        />
                    )}
                </>

                <>
                    {showAddRecBank && (
                        <AddRecipeBank
                            show={showAddRecBank}
                            onHide={hideModal}
                        />
                    )}
                </>
            </div>
        </>
    );
};
export default Recipies;

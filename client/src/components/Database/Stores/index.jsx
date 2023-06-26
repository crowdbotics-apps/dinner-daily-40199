import React, { useState, useEffect } from "react";
import Loader from "../../../customComponents/Spinner";
import { Table, Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import svg from "../../../assets/images/svg/index";
import { Button, Image, Form } from "react-bootstrap";
import StoresScheduleListing from "../StoresScheduleListing";
import StoresPrevEndWeek from "../StoresPrevEndWeek";
import UploadSpecial from "../UploadSpecial";
import EditStoreSpecial from "../EditStoreSpecial";

import AddNewStore from "./AddNewStore";
import "./stores.scss";
import DeleteNewStore from "./DeleteNewStore";
import { adminStores, states } from "../../../api/request";
import { formatDay, formatTime } from "../../../utils/helpers";

const Stores = () => {
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        sortField: "id",
        sortValue: "asc",
        total: 0,
    });
    const [Loading, setLoading] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [showStoreSchedule, setshowStoreSchedule] = useState(false);
    const [showStoreCurrPrevWeek, setshowStoreCurrPrevWeek] = useState(false);
    const [showSelectedValue, setSelectedValue] = useState("");
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showSpecialPopup, setShowSpecialPopup] = useState(false);
    const [showEditSpecial, setShowEditSpecial] = useState(false);
    const [showEditSpecialData, setEditSpecialData] = useState(null);
    const [updateSpecialModal, toggleUpdateSpecialModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [stateList, setStateList] = useState([]);

    useEffect(() => {
        if (showEditSpecialData) {
            if (updateSpecialModal) {
                setShowEditSpecial(true);
            }
        }
    }, [showEditSpecialData]);

    useEffect(() => {
        fetchStores(pagination);
    }, [
        pagination.current,
        pagination.pageSize,
        pagination.sortField,
        pagination.sortValue,
    ]);

    useEffect(() => {
        getStates();
    }, []);

    async function getStates() {
        let resp = await states();
        if (resp?.status) {
            setStateList(resp?.data);
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
            title: "Create menu...",
            dataIndex: "createmenu",
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
            title: "Create me...",
            dataIndex: "createme",
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
            title: "Publish me...",
            dataIndex: "publishmenu",
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
            title: "Publish me...",
            dataIndex: "publishme",
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
            title: "Sale Period Start",
            dataIndex: "saleperiodstart",
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
            title: "Sale Period End",
            dataIndex: "saleperiodend",
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
            title: "Specials",
            dataIndex: "specials",
        },
        {
            title: "Actions",
            dataIndex: "actions",
        },
    ];

    const fetchStores = async (pagination) => {
        setLoading(true);
        const payload = {
            page: pagination?.current,
            pageSize: pagination?.pageSize,
            sortField: pagination?.sortField,
            sortValue: pagination?.sortValue,
        };
        try {
            const response = await adminStores(payload);
            if (response?.status) {
                let res = response?.data;
                const data = [];
                for (let i = 0; i < res?.length; i++) {
                    data?.push({
                        key: i + 1,
                        id: res[i]?.id,
                        name: res[i]?.name,
                        specials: (
                            <div className="edit-img cursor-pointer">
                                <img
                                    style={{ marginRight: "5px" }}
                                    src={svg?.knifefork}
                                    onClick={() => {
                                        setEditSpecialData(res[i]?.id);
                                        toggleUpdateSpecialModal(true);
                                    }}
                                    alt="delete icon NP"
                                />
                                <span>{res[i]?.specials}</span>
                            </div>
                        ),
                        createmenu: formatDay(res[i]?.week_menu_generation_day),
                        createme: formatTime(res[i]?.week_menu_generation_time),
                        publishmenu: formatDay(
                            res[i]?.week_menu_publishing_day
                        ),
                        publishme: formatTime(
                            res[i]?.week_menu_publishing_time
                        ),
                        saleperiodstart: formatDay(res[i]?.sale_period_start),
                        saleperiodend: formatDay(res[i]?.sale_period_end),
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
                        ),
                    });
                }
                console.log("dddaattaa", data);
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

    const handleTableChange = (paginationData, filters, sorter) => {
        const paginationUpdate = {
            current: paginationData.current,
            pageSize: paginationData.pageSize,
            total: paginationData.total,
        };
        if (sorter?.field) paginationUpdate.sortField = sorter.field;
        else paginationUpdate.sortField = pagination.sortField;
        if (sorter?.order)
            paginationUpdate.sortValue =
                sorter.order === "ascend" ? "asc" : "desc";
        else paginationUpdate.sortValue = pagination.sortValue;
        setPagination({ ...paginationUpdate });
    };

    const renderRecipeComponent = () => {
        if (showSelectedValue === "Schedule") {
            return <StoresScheduleListing />;
        } else if (showSelectedValue === "Current/Previous Week") {
            return <StoresPrevEndWeek />;
        }
    };

    const handleDropdownReset = () => {
        setSelectedValue("");
        setshowStoreCurrPrevWeek(false);
        setshowStoreSchedule(false);
    };

    const handledropdownChange = (e) => {
        setSelectedValue(e?.target?.value);
        if (e?.target?.value === "Schedule") {
            setshowStoreSchedule(true);
            setshowStoreCurrPrevWeek(false);
        } else if (e?.target?.value === "Current/Previous Week") {
            setshowStoreSchedule(false);
            setshowStoreCurrPrevWeek(true);
        }
    };

    const handleEdit = (data) => {
        setShowEditPopup(true);
        const eddata = {
            ...data,
            week_menu_generation_time: formatTime(
                data?.week_menu_generation_time,
                true
            ),
            week_menu_publishing_time: formatTime(
                data?.week_menu_publishing_time,
                true
            ),
        };
        setEditData(eddata);
    };

    const handleDelete = (data) => {
        setShowDeletePopup(true);
        setEditData(data);
    };

    const hideModal = (data) => {
        if (data) {
            fetchStores(pagination);
        }
        setEditData(null);
        setShowAddPopup(false);
        setShowEditPopup(false);
        setShowDeletePopup(false);
        setShowSpecialPopup(false);
        setShowEditSpecial(false);
    };

    return (
        <>
            <div className="stores-wrapper">
                <div className="table-heading-wrapper">
                    <div className="left-side-wrapper d-flex">
                        <div className="table-heading">
                            Listing
                            <>
                                {showStoreSchedule === true
                                    ? "- Schedule"
                                    : showStoreCurrPrevWeek === true &&
                                      "- Current/Previous Week"}
                            </>{" "}
                        </div>
                        <Form.Select
                            required
                            label={"Please select a Store"}
                            name={"dropdown"}
                            value={showSelectedValue}
                            onChange={(e) => handledropdownChange(e)}
                            className={`mt-2 form-control role-edit-select recipe-select`}
                        >
                            <option value="" className="role-item">
                                Select Store
                            </option>
                            <option value="Schedule" className="role-item">
                                Schedule
                            </option>
                            <option
                                value="Current/Previous Week"
                                className="role-item"
                            >
                                Current/Previous Week
                            </option>
                        </Form.Select>
                        <span
                            className="reset"
                            onClick={() => handleDropdownReset()}
                        >
                            Reset
                        </span>
                    </div>

                    <div className="table-btn-wrapper">
                        <>
                            {showStoreSchedule === false &&
                                showStoreCurrPrevWeek === false && (
                                    <div className="store-btn-wrapper">
                                        <Button
                                            variant="primary"
                                            className="add-user-btn"
                                            onClick={() =>
                                                setShowAddPopup(true)
                                            }
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
                                        <Button
                                            variant="primary"
                                            className="add-user-btn"
                                            onClick={() =>
                                                setShowSpecialPopup(true)
                                            }
                                        >
                                            <Image
                                                src={svg?.plusicon}
                                                alt="Button image"
                                                width="30"
                                                height="30"
                                                className="d-inline-block align-top"
                                            />
                                            Upload Special
                                        </Button>
                                    </div>
                                )}
                        </>
                    </div>
                </div>

                <>
                    {showSelectedValue?.length > 0 ? (
                        renderRecipeComponent()
                    ) : (
                        <>
                            {Loading ? (
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
            </div>
            <>
                {showAddPopup && (
                    <AddNewStore
                        show={showAddPopup}
                        onHide={hideModal}
                        statedata={stateList}
                    />
                )}
                {showEditPopup && editData && (
                    <AddNewStore
                        show={showEditPopup}
                        onHide={hideModal}
                        editdata={editData}
                        statedata={stateList}
                    />
                )}
                {showDeletePopup && editData && (
                    <DeleteNewStore
                        show={showDeletePopup}
                        onHide={hideModal}
                        editdata={editData}
                    />
                )}
                {showSpecialPopup === true && (
                    <UploadSpecial show={showSpecialPopup} onHide={hideModal} />
                )}
                {showEditSpecial === true && (
                    <EditStoreSpecial
                        show={showEditSpecial}
                        onHide={hideModal}
                        data={showEditSpecialData}
                    />
                )}
            </>
        </>
    );
};

export default Stores;

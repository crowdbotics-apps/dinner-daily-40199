import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useFormik } from "formik";
import ErrorMsg from "../../../customComponents/ErrorMsg";
import { Table, Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "./styles.scss";
import { request } from "../../../api/request";
import EndPoints from "../../../api/endPoints";
import moment from "moment";
import { Form } from "react-bootstrap";

const EditStoreSpecial = (props) => {
    const [showAddSuccess, setshowAddSuccess] = useState(false);
    const [isLoading, setisLoading] = useState(false);
    const [getError, setError] = useState(false);
    const [userData, setData] = useState([]);
    const [storeSelect, setStoreSelect] = useState([]);

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
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
            title: "Date Added",
            dataIndex: "dateAdded",
        },
        {
            title: "Actions",
            dataIndex: "actions",
        },
    ];

    const handleStoreChange = (e) => {
        console.log(e.target.value);
        if (e.target.checked) {
            setStoreSelect((prev) => {
                return prev.map((el) => {
                    if (el.id == e.target.value) {
                        el = { ...el, is_on_sale: 1 };
                    }
                    return el;
                });
            });
        } else {
            setStoreSelect((prev) => {
                return prev.map((el) => {
                    if (el.id == e.target.value) {
                        el = { ...el, is_on_sale: 0 };
                    }
                    return el;
                });
            });
        }
    };

    useEffect(() => {
        console.log(props.data);
        const data = [];
        request(
            EndPoints.getSpecial.replace("{id}", props.data),
            "GET",
            undefined,
            true
        ).then((response) => {
            const res = response.data;
            const storeData = [];
            for (let i = 0; i < res?.length; i++) {
                storeData.push({
                    id: res[i]?.id,
                    is_on_sale: res[i]?.is_on_sale,
                });
                data?.push({
                    id: res[i]?.ingredient_id,
                    name: res[i]?.name,
                    dateAdded: moment(res[i]?.created).format("DD/MM/YYYY"),
                    actions: (
                        <div className="checkbox-wrapper">
                            <Form.Check
                                className="role-items"
                                type="checkbox"
                                defaultChecked={Boolean(res[i]?.is_on_sale)}
                                key={res[i]?.id}
                                value={res[i]?.id}
                                onChange={handleStoreChange}
                                id={res[i]?.id}
                            />
                        </div>
                    ),
                });
            }
            setData(data);
            setStoreSelect(storeData);
        });
    }, [props.data]);

    const {
        resetForm,
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        errors,
        isSubmitting,
    } = useFormik({
        initialValues: {
            username: "",
        },
        onSubmit: async () => {
            console.log(storeSelect);
            setisLoading(true);
            //const body = { ids: storeSelect };
            request(
                EndPoints.getSpecial.replace("{id}", props.data),
                "PUT",
                storeSelect
            )
                .then((res) => {
                    setshowAddSuccess(true);
                    setTimeout(() => {
                        props.onHide(res);
                    }, 2000);
                })
                .catch((err) => {
                    setisLoading(false);
                    setError(true);
                    setTimeout(() => {
                        setError(false);
                    }, 2000);
                });

            // console.log("adduserbody", addUserbody)
            // let resp = await addUser(addUserbody)
            // console.log("resp from adduserbody", resp)
            // if (resp?.status === true) {
            //   setshowAddSuccess(true)
            //   setisLoading(false)
            //   setError(false)
            // } else {
            //   setshowAddSuccess(false)
            //   setisLoading(false)
            //   setError(true)
            // }
        },
    });
    return (
        <div className="EditStoreSpecial-wrapper">
            <Modal
                {...props}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                className="add-new-modal root-modal EditStoreSpecial-modal"
                centered
            >
                <Modal.Header className="heading border-bottom-0 p-0 font-semi-bold-20 text-center">
                    Store Special- {props?.data}
                </Modal.Header>
                <Modal.Body className="change-password-body p-0 pt-2  text-center">
                    <form onSubmit={handleSubmit} className="w-100">
                        <Table
                            style={{ overflowY: "scroll", height: "60vh" }}
                            className="ingredients-table w-100"
                            columns={columns}
                            dataSource={userData}
                            pagination={false}
                            row={(record) => ({
                                style: { paddingTop: "20px" },
                            })}
                        />
                        <div className="btn-wrapper mt-3">
                            <Button
                                className="cancel-btn w-25"
                                variant="outline-primary rounded-pill"
                                onClick={() => props?.onHide()}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="save-btn w-25"
                                variant="primary rounded-pill"
                                type="submit"
                                disabled={isLoading}
                            >
                                Update
                            </Button>
                        </div>
                    </form>

                    <>
                        {getError === true && (
                            <ErrorMsg errormsg={"Error in uploading"} />
                        )}
                        {showAddSuccess === true && (
                            <span className="rstPassSuccessMsg text-center font-medium-20 mt-3 d-flex justify-content-center align-items-center">
                                Special has been updated successfully
                            </span>
                        )}
                    </>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default EditStoreSpecial;

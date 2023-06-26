import React, { useState, useEffect, useRef } from "react";
import { Button, Image, Row, Col, Dropdown, Form } from "react-bootstrap";
import { useFormik } from "formik";
import ErrorMessage from "../../customComponents/ErrorMessage";
import TextInput from "../../customComponents/TextInput";
import { noticationSchema } from "../../utils/noticationFormvalidations";
import Addnew from "./Addnew.jsx";
import svg from "../../assets/images/svg/index";
import "./notifications.scss";
import { NotifiedDaysArray, UserType } from "../../utils/constants";
import { notificationInitialValue } from "../../utils/initialValues";
import {
    getNotifications,
    request,
    updateNotification,
} from "../../api/request";
import SuccessMsg from "../../customComponents/SuccessMessage";
import ErrorMsg from "../../customComponents/ErrorMsg";
import Loader from "../../customComponents/Spinner";
import Deletenotification from "./Deletenotification";
import moment from "moment";
import EndPoints from "../../api/endPoints";

const Notifications = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showEditDropdown, setShowEditDropdown] = useState(false);
    const [showCardclass, setCardclass] = useState({});
    const [selectedCardId, setSelectedCardId] = useState(null);
    const [showAddpopup, setShowAddpopup] = useState(false);
    const [showDays, setShowDays] = useState(false);
    const [notifiedDays, setNotifiedDays] = useState(NotifiedDaysArray);
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState(false);
    const [notificationList, setNotificationList] = useState([]);
    const [filterList, setFilterList] = useState([]);
    const [formData, setFormData] = useState(notificationInitialValue);
    const [showDeletepopup, setShowDeletepopup] = useState(true);
    const [deleteId, setDeleteId] = useState(null);
    const [search, setSearch] = useState("");
    const [getError, setError] = useState(false);
    const [storeList, setStoreList] = useState([]);
    const dropdownRef = useRef(null);
    const editdropdownRef = useRef(null);
    const [storeSelect, setStoreSelect] = useState([]);

    useEffect(() => {
        setLoading(true);
        getNotificationList();
        getStoreList();
    }, []);

    async function getNotificationList() {
        let resp = await getNotifications();
        if (resp?.status) {
            console.log(resp?.data.length);
            setNotificationList(resp?.data);
            setFilterList(resp?.data);
        } else {
            setError(resp?.message);
        }
        setLoading(false);
    }

    const getStoreList = async () => {
        request(EndPoints.store, "GET").then((res) => {
            setStoreList([...res.data]);
        });
    };

    useEffect(() => {
        if (selectedCardId) {
            const selectedCard = notificationList.find(
                (notif) => notif.id === selectedCardId
            );
            if (selectedCard && deleteId === null) {
                setShowDays(selectedCard?.notification_repeat ? true : false);
                selectedCard?.notification_repeat &&
                    updateNotifedDays(selectedCard?.notification_days_repeat);
                setFormData({
                    ...selectedCard,
                    title: selectedCard?.name,
                    content: selectedCard?.contents?.en,
                    notification_time: selectedCard?.delivery_time_of_day,
                });
            }
        }
    }, [selectedCardId, notificationList]);

    const {
        resetForm,
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        setFieldValue,
        touched,
        errors,
        isSubmitting,
    } = useFormik({
        initialValues: notificationInitialValue,
        onSubmit: async () => {
            setLoading(true);
            console.log("KKKKKKKK", values);
            let formObj = {
                ...values,
                notification_date: moment(
                    values.notification_date,
                    "YYYY-MM-DD"
                ).format("DD/MM/YYYY"),
            };
            if (values?.notification_repeat) {
                formObj["notification_days_repeat"] = notifiedDays
                    .filter((day) => day.added)
                    .map((day) => day.value);
            }

            formObj.store_ids = storeSelect;
            console.log("1111", formObj);
            let resp = await updateNotification(formObj, selectedCardId);
            if (resp?.status) {
                getNotificationList();
                setSuccessMsg(resp?.message);
                handleCancel();
            } else {
                setError(resp.message);
            }
            setTimeout(() => {
                setSuccessMsg(null);
                setError(null);
                setLoading(false);
            }, 2000);
        },
    });

    useEffect(() => {
        if (formData?.id) {
            const fields = Object.keys(formData);
            console.log("fields", formData);
            fields.forEach((field) => {
                //setFieldValue(field, formData[field], false);
            });
        }
    }, [formData]);

    const handleRepeatTogglechange = (e) => {
        values.notification_repeat = e.target.checked ? 1 : 0;
        setNotifiedDays(NotifiedDaysArray);
        setShowDays(!showDays);
    };
    const handleDaysBtnclick = (item, id) => {
        let days = [...notifiedDays];
        days[id] = { ...item, added: !item.added };
        setNotifiedDays(days);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                editdropdownRef.current &&
                !editdropdownRef.current.contains(event.target)
            ) {
                setShowEditDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [editdropdownRef]);

    const handleUsercardClick = (id) => {
        console.log(id);
        if (id === selectedCardId) {
            // If the user clicked on the already selected card, unselect it
            setSelectedCardId(null);
            setFormData(notificationInitialValue);
            setCardclass({});
        } else {
            // If the user clicked on a new card, update the state for that card
            setSelectedCardId(id);
            const notification = notificationList.find((ele) => ele.id == id);
            console.log(notification);
            const d = moment(
                notification?.notification_date,
                "DD/MM/YYYY"
            ).format("YYYY-MM-DD");
            // setFormData({
            //     id: notification.id,
            //     title: notification.title,
            //     content: notification.content,
            //     notification_date: d,
            // });

            setFieldValue("notification_date", d, false);
            setFieldValue("notification_time", notification.notification_time);
            setFieldValue("title", notification.title);
            setFieldValue("content", notification.content);
            setFieldValue(
                "notification_repeat",
                notification.notification_repeat
            );
            setStoreSelect(notification.store_ids.split(","));
            console.log(storeSelect);
            setCardclass({ [id]: true });
        }
    };

    const handleStoreChange = (e) => {
        if (e.target.checked) {
            setStoreSelect((prev) => [...prev, e.target.value]);
        } else {
            setStoreSelect(
                storeSelect.filter((item) => {
                    return item !== e.target.value;
                })
            );
        }
    };

    const handleUsegroupChange = (e) => {
        setFieldValue("user_group", e.target.value, false);
    };

    const notificationListSearch = (e) => {
        const search = e.target.value;
        if (search !== "") {
            const results = filterList.filter((notif) => {
                return notif.name
                    .toLowerCase()
                    .startsWith(search.toLowerCase());
            });
            setNotificationList(results);
        } else {
            setNotificationList(filterList);
        }
        setSearch(search);
    };

    function updateNotifedDays(days) {
        const dayArry = days.split(",");
        const updateArry = notifiedDays.map((days) => {
            return {
                ...days,
                added: dayArry.includes(`${days.value}`),
            };
        });
        setNotifiedDays(updateArry);
    }

    const hideModal = (data) => {
        if (data) {
            getNotificationList();
        }
        setShowDeletepopup(false);
        setDeleteId(null);
        handleCancel();
    };

    const handleCancel = () => {
        resetForm();
        setShowDays(false);
        setNotifiedDays(NotifiedDaysArray);
        setSelectedCardId(null);
        setCardclass({});
        setShowAddpopup(false);
    };

    const handleUserDelete = (id) => {
        setShowDeletepopup(true);
        setDeleteId(id);
        handleCancel();
    };

    return (
        <div className="notifications-users">
            <Row className="first-row">
                <Col className="d-flex user-heading-col" md={4}>
                    <div className="users-heading">
                        <img
                            src={svg?.notificationsicon}
                            className="internal-user-img"
                            alt="internal-user-img Np"
                        />
                        <span className="heading-txt">Notifications</span>
                    </div>

                    <div className="add-user">
                        <Button
                            variant="primary"
                            className="add-user-btn"
                            onClick={() => setShowAddpopup(true)}
                        >
                            <Image
                                src={svg?.addusericon}
                                alt="Button image"
                                width="30"
                                height="30"
                                className="d-inline-block align-top"
                            />
                            Add New
                        </Button>
                    </div>
                </Col>
            </Row>

            <Row className="second-row">
                <Col className="second-row-first-col border-right" md={4}>
                    <div className="second-row-first-col-div">
                        <div className="role-dropdown" ref={dropdownRef}>
                            <Dropdown
                                show={showDropdown}
                                onToggle={() => setShowDropdown(!showDropdown)}
                            >
                                <Dropdown.Toggle
                                    className="role-btn"
                                    // onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    User Group
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="role-menu">
                                    <Form>
                                        {UserType.map((option, index) => (
                                            <Form.Check
                                                className="role-items"
                                                type="radio"
                                                name={"user-type"}
                                                key={index}
                                                id={option.label}
                                                label={option.label}
                                            />
                                        ))}
                                    </Form>
                                    <Dropdown.Header>Store(s)</Dropdown.Header>
                                    <Form>
                                        {[
                                            "Store Name 1",
                                            "Store Name 2",
                                            "Store Name 3",
                                            "Store Name 4",
                                            "Store Name 5",
                                        ].map((option) => (
                                            <Form.Check
                                                className="role-items"
                                                type="checkbox"
                                                key={option}
                                                id={option}
                                                label={option}
                                            />
                                        ))}
                                    </Form>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="search-bar-div">
                            <div className="input-group search-bar">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search notification"
                                    value={search}
                                    onChange={notificationListSearch}
                                />
                                {/* <button
                  className="btn btn-outline-secondary search-btn"
                  type="button"
                >
                  <img
                    src={svg?.searchicon}
                    className="search-icon"
                    alt="search icon NP"
                  />
                </button> */}
                            </div>
                        </div>
                        <div className="filter">
                            <img
                                src={svg?.filtericon}
                                className="sorting-img"
                                alt="sorting Img Np"
                            />
                        </div>
                    </div>
                    {loading && <Loader loadingMsg={"loading.."} />}
                    <div className="user-data-card">
                        {notificationList?.map((item, index) => (
                            <div
                                className={`${
                                    showCardclass[item?.id] === true
                                        ? "user-card greenbg"
                                        : "user-card"
                                }`}
                                key={index}
                                onClick={() => handleUsercardClick(item?.id)}
                            >
                                <div className="user-name">
                                    <div className="user-card-first-row">
                                        <div className="child-div">
                                            <span className="notification-name">
                                                {item.title}
                                            </span>
                                            <span className="notification-date">
                                                {moment(
                                                    `${item.notification_date} ${item.notification_time}`,
                                                    "DD/MM/YYYY HH:mm"
                                                ).format(
                                                    "DD MMM YYYY, hh:mm A"
                                                )}
                                            </span>
                                        </div>
                                        <div className="user-delete">
                                            <img
                                                src={svg?.deleteuser}
                                                className="delete-user-img"
                                                alt="delete user img NP"
                                                onClick={() =>
                                                    handleUserDelete(item.id)
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="lower-child-div">
                                        {item.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Col>

                <Col className="second-row-second-col" md={4}>
                    <div className="second-row-second-col-div">
                        <div className="edit-card-heading">Details</div>
                        <form onSubmit={handleSubmit} className="w-75">
                            <div
                                className={
                                    errors.title && touched.title
                                        ? "emailredborder inputdiv"
                                        : "inputdiv"
                                }
                            >
                                <span className="text-label">
                                    Notification Title
                                </span>
                                <TextInput
                                    label={"Title"}
                                    name={"title"}
                                    type={"text"}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values?.title}
                                    className={`mt-2 form-control ${
                                        touched &&
                                        touched[values?.title] &&
                                        errors[values?.title]
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                />
                                <ErrorMessage
                                    errormsg={errors?.title}
                                    touchedmsg={touched?.title}
                                />
                            </div>

                            <div
                                className={
                                    errors.content && touched.content
                                        ? "emailredborder inputdiv"
                                        : "inputdiv"
                                }
                            >
                                <span className="text-label">Content</span>
                                <textarea
                                    placeholder={"Content"}
                                    name={"content"}
                                    rows={5}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values?.content}
                                    className={`mt-2 form-control ${
                                        touched &&
                                        touched[values?.content] &&
                                        errors[values?.content]
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                />
                                <ErrorMessage
                                    errormsg={errors?.content}
                                    touchedmsg={touched?.content}
                                />
                            </div>

                            <div
                                className={
                                    errors.user_group && touched.user_group
                                        ? "emailredborder inputdiv"
                                        : "inputdiv"
                                }
                            >
                                <span className="text-label pt-3 mb-1">
                                    User Group
                                </span>
                                <div className="role-dropdown">
                                    <Dropdown
                                        show={showEditDropdown}
                                        onToggle={() =>
                                            setShowEditDropdown(
                                                !showEditDropdown
                                            )
                                        }
                                        ref={editdropdownRef}
                                    >
                                        <Dropdown.Toggle className="role-btn">
                                            User Group
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu
                                            style={{
                                                overflowY: "scroll",
                                                height: "300px",
                                            }}
                                            className="role-menu"
                                        >
                                            <Form>
                                                {UserType.map(
                                                    (option, index) => (
                                                        <Form.Check
                                                            className="role-items"
                                                            type="radio"
                                                            name={"user-type"}
                                                            key={index}
                                                            id={option?.value}
                                                            value={
                                                                option?.value
                                                            }
                                                            onChange={
                                                                handleUsegroupChange
                                                            }
                                                            checked={
                                                                values?.user_group ===
                                                                option?.value
                                                                    ? true
                                                                    : false
                                                            }
                                                            label={
                                                                option?.label
                                                            }
                                                        />
                                                    )
                                                )}
                                            </Form>
                                            <Dropdown.Header>
                                                Store(s)
                                            </Dropdown.Header>
                                            <Form>
                                                {storeList.map(
                                                    (option, index) => (
                                                        <Form.Check
                                                            className="role-items"
                                                            type="checkbox"
                                                            key={index}
                                                            checked={storeSelect.includes(
                                                                option.id.toString()
                                                            )}
                                                            value={option.id}
                                                            defaultChecked
                                                            onChange={
                                                                handleStoreChange
                                                            }
                                                            id={option.id}
                                                            label={option.name}
                                                        />
                                                    )
                                                )}
                                            </Form>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>

                            <div className="schedule pt-3">
                                <span className="heading">Schedule</span>
                                <div className="repeat-wrapper mt-3 d-flex mb-3">
                                    <div className="repeat-cont d-flex ml-auto">
                                        <img
                                            src={svg?.feedback}
                                            className="repeat-icon"
                                            alt="repeat-icon NP"
                                        />
                                        <span className="repeast-txt">
                                            Repeat
                                        </span>
                                    </div>
                                    <Form.Check
                                        type="switch"
                                        className="repeat-switch"
                                        id="notification_repeat"
                                        name="notification_repeat"
                                        checked={
                                            values?.notification_repeat
                                                ? true
                                                : false
                                        }
                                        onChange={handleRepeatTogglechange}
                                        onBlur={handleBlur}
                                    />
                                </div>
                                <>
                                    {showDays && (
                                        <div className="days-wrapper">
                                            {notifiedDays?.map(
                                                (item, index) => (
                                                    <span
                                                        className={`day-btn ${
                                                            item.added
                                                                ? "greenbg"
                                                                : ""
                                                        }`}
                                                        key={index}
                                                        onClick={() =>
                                                            handleDaysBtnclick(
                                                                item,
                                                                index
                                                            )
                                                        }
                                                    >
                                                        {item?.Name}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    )}
                                </>
                            </div>

                            <div
                                className={
                                    errors.notification_date &&
                                    touched.notification_date
                                        ? "emailredborder inputdiv pt-2"
                                        : "inputdiv pt-2"
                                }
                            >
                                <span className="text-label">Date</span>
                                <input
                                    type="date"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name="notification_date"
                                    value={values?.notification_date}
                                    className={`mt-2 form-control date-time-cont ${
                                        touched &&
                                        touched[values?.notification_date] &&
                                        errors[values?.notification_date]
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                />
                                <ErrorMessage
                                    errormsg={errors?.notification_date}
                                    touchedmsg={touched?.notification_date}
                                />
                            </div>

                            <div
                                className={
                                    errors.notification_time &&
                                    touched.notification_time
                                        ? "emailredborder inputdiv pt-2"
                                        : "inputdiv pt-2"
                                }
                            >
                                <span className="text-label">Time</span>
                                <input
                                    type="time"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name="notification_time"
                                    value={values?.notification_time}
                                    className={`mt-2 form-control date-time-cont ${
                                        touched &&
                                        touched[values?.notification_time] &&
                                        errors[values?.notification_time]
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                />
                                <ErrorMessage
                                    errormsg={errors?.notification_time}
                                    touchedmsg={touched?.notification_time}
                                />
                            </div>
                            {isSubmitting && (
                                <Loader loadingMsg={"Updating.."} />
                            )}
                            <div className="edit-btns pt-4">
                                <Button
                                    variant=""
                                    className="w-50 rounded-pill cancel-btn"
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={isSubmitting ? true : false}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant=""
                                    className="w-50 rounded-pill save-btn"
                                    type="submit"
                                    disabled={isSubmitting ? true : false}
                                >
                                    Update
                                </Button>
                            </div>
                            {getError && <ErrorMsg errormsg={getError} />}
                            {successMsg && (
                                <SuccessMsg successmsg={successMsg} />
                            )}
                        </form>
                    </div>
                </Col>
            </Row>
            {showAddpopup && (
                <Addnew
                    store={storeList}
                    show={showAddpopup}
                    onHide={hideModal}
                />
            )}
            {showDeletepopup && deleteId && (
                <Deletenotification
                    show={showDeletepopup}
                    onHide={hideModal}
                    deleteid={deleteId}
                />
            )}
        </div>
    );
};

export default Notifications;

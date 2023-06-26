import React, { useState, useRef } from "react";
import { Button, Modal, Dropdown, Form } from "react-bootstrap";
import { useFormik } from "formik";
import ErrorMessage from "../../customComponents/ErrorMessage";
import TextInput from "../../customComponents/TextInput";
import svg from "../../assets/images/svg/index";
import "./notifications.scss";
import { NotifiedDaysArray, UserType } from "../../utils/constants";
import { addNotification } from "../../api/request";
import { notificationInitialValue } from "../../utils/initialValues";
import { noticationSchema } from "../../utils/noticationFormvalidations";
import ErrorMsg from "../../customComponents/ErrorMsg";
import SuccessMsg from "../../customComponents/SuccessMessage";
import moment from "moment";

const Addnew = (props) => {
    const editdropdownRef = useRef(null);
    const [showEditDropdown, setShowEditDropdown] = useState(false);
    const [showDays, setShowDays] = useState(false);
    const [successMsg, setSuccessMsg] = useState(false);
    const [getError, setError] = useState(false);
    const [notifiedDays, setNotifiedDays] = useState(NotifiedDaysArray);
    const [storeSelect, setStoreSelect] = useState([]);

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
        validationSchema: noticationSchema,
        onSubmit: async () => {
            console.log(values);
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

            console.log(formObj);
            let resp = await addNotification(formObj);
            if (resp?.status) {
                resetForm();
                setSuccessMsg(resp?.message);
                setTimeout(() => {
                    props.onHide(true);
                }, 2000);
            } else {
                setError(resp.message);
            }
        },
    });

    const handleRepeatTogglechange = (e) => {
        values.notification_repeat = e.target.checked ? 1 : 0;
        e.target.checked && setNotifiedDays(NotifiedDaysArray);
        setShowDays(!showDays);
    };
    const handleDaysBtnclick = (item, id) => {
        let days = [...notifiedDays];
        days[id] = { ...item, added: !item.added };
        setNotifiedDays(days);
    };

    const handleUsegroupChange = (e) => {
        setFieldValue("user_group", e.target.value, false);
    };
    const handleStoreChange = (e) => {
        console.log(e);
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

    return (
        <div className="feedback-wrapper">
            <Modal
                {...props}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                className="add-notification-modal"
                centered
                // scrollable={true}
            >
                <>
                    <Modal.Header className="heading border-bottom-0 p-0 font-semi-bold-20 text-center">
                        Add New Notification
                    </Modal.Header>
                    <Modal.Body className="change-password-body p-0 pt-2  text-center">
                        <form onSubmit={handleSubmit} className="w-100 p-2">
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
                                                {props.store.map(
                                                    (option, index) => (
                                                        <Form.Check
                                                            className="role-items"
                                                            type="checkbox"
                                                            key={index}
                                                            value={option.id}
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
                                <ErrorMessage
                                    errormsg={errors?.user_group}
                                    touchedmsg={touched?.user_group}
                                />
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

                            <div className="edit-btns pt-4">
                                <Button
                                    variant=""
                                    className="w-50 rounded-pill cancel-btn"
                                    type="button"
                                    onClick={() => {
                                        resetForm();
                                        props?.onHide();
                                    }}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant=""
                                    className="w-50 rounded-pill save-btn"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    Save
                                </Button>
                            </div>
                        </form>
                        {getError && <ErrorMsg errormsg={getError} />}
                        {successMsg && <SuccessMsg successmsg={successMsg} />}
                    </Modal.Body>
                </>
            </Modal>
        </div>
    );
};
export default Addnew;

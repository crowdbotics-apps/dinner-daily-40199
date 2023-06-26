import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import UploadContents from "./UploadContents.jsx";
import BonusContentEdit from "./BonusContentEdit.jsx";
import svg from "../../assets/images/svg/index";
import "./styles.scss";
import {
    BONUSCONTENT,
    MEMEBER_NEWS,
    TESTEMONIAL,
    WEEKLYTIP,
} from "../../utils/constants.js";
import { getUploadContent } from "../../api/request.js";
import { uploadContentFilter } from "../../utils/helpers.js";
import Bonus from "./Bonus.jsx";

const UploadContent = () => {
    const [formType, setFormType] = useState(BONUSCONTENT);
    const [isloading, setisLoading] = useState(false);
    const [dBData, setDBData] = useState([]);
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        setisLoading(true);
        getUplaoadContentData();
    }, []);

    async function getUplaoadContentData() {
        let resp = await getUploadContent();
        if (resp?.status) {
            setDBData(resp?.data);
            setFormData(uploadContentFilter(MEMEBER_NEWS, resp?.data));
            setisLoading(false);
        } else {
            setisLoading(false);
        }
    }
    const handleFormType = (type) => {
        setFormType(type);
        setFormData(uploadContentFilter(type, dBData));
    };

    const updateFormData = (data) => {
        const dbdata = [...dBData];
        const Index = dbdata.findIndex(
            (item) => item?.content_type === data?.content_type
        );
        dbdata[Index] = data;
        setDBData(dbdata);
    };

    return (
        <div className="subscription">
            <Row className="first-row">
                <Col className="d-flex user-heading-col" md={4}>
                    <div className="users-heading">
                        <span className="heading-txt">Upload Content</span>
                    </div>
                </Col>
            </Row>

            <Row className="second-row">
                <Col className="second-row-first-col border-right" md={3}>
                    <div className="upload-content-card">
                        <div
                            className={
                                formType === MEMEBER_NEWS
                                    ? `member-news showactive`
                                    : `member-news`
                            }
                            onClick={() => handleFormType(MEMEBER_NEWS)}
                        >
                            <img
                                src={svg?.membernews}
                                alt="member news NP"
                                className="member-newsicon"
                            />
                            <span className="member-newstxt">
                                {MEMEBER_NEWS}
                            </span>
                        </div>
                        <div
                            className={
                                formType === TESTEMONIAL
                                    ? `member-news showactive`
                                    : `member-news`
                            }
                            onClick={() => handleFormType(TESTEMONIAL)}
                        >
                            <img
                                src={svg?.testimonials}
                                alt="member news NP"
                                className="member-newsicon"
                            />
                            <span className="member-newstxt">
                                {TESTEMONIAL}
                            </span>
                        </div>
                        <div
                            className={
                                formType === WEEKLYTIP
                                    ? `member-news showactive`
                                    : `member-news`
                            }
                            onClick={() => handleFormType(WEEKLYTIP)}
                        >
                            <img
                                src={svg?.weeklytips}
                                alt="member news NP"
                                className="member-newsicon"
                            />
                            <span className="member-newstxt">{WEEKLYTIP}</span>
                        </div>
                        <div
                            className={
                                formType === BONUSCONTENT
                                    ? `member-news showactive`
                                    : `member-news`
                            }
                            onClick={() => setFormType(BONUSCONTENT)}
                        >
                            <img
                                src={svg?.bonuscontent}
                                alt="member news NP"
                                className="member-newsicon"
                            />
                            <span className="member-newstxt">
                                {BONUSCONTENT}
                            </span>
                        </div>
                    </div>
                </Col>
                <Col className="second-row-second-col mt-4" md={6}>
                    <div className="second-row-second-col-div">
                        <>
                            {formType === BONUSCONTENT ? (
                                <Bonus />
                            ) : (
                                formData && (
                                    <UploadContents
                                        formtype={formType}
                                        formdata={formData}
                                        updatecontent={updateFormData}
                                    />
                                )
                            )}
                        </>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default UploadContent;

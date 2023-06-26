import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import "./styles.scss";
import BonusForm from "./BonusForm";
import { MultipartRequest, request } from "../../api/request";
import EndPoints from "../../api/endPoints";
import BonusModal from "../AddNewBonusContent/BonusModal";

const Bonus = (props) => {
    const [active, setActive] = useState(undefined);
    const [bonusContentData, setBonusContentData] = useState(undefined);
    const [isModalVisible, toggleModalVisibility] = useState(false);
    const [loading, setLoading] = useState(false);

    const getBonusContent = async () => {
        try {
            const { data } = await request(EndPoints.adminBonusContent, "GET");
            console.log(data);
            if (data) {
                setBonusContentData(data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getBonusContent();
    }, []);

    useEffect(() => {
        if (bonusContentData && bonusContentData.length > 0) {
            setActive(bonusContentData[0].id);
        }
    }, [bonusContentData]);

    const resetBonusContentData = (bonusContent) => {
        setBonusContentData(() => [...bonusContent]);
    };

    const titleButtonClickHandler = (id) => {
        setActive(id);
    };

    const updateBonusContentHandler = (body) => {
        setLoading(true);
        const endPoint = EndPoints.bonusContent + active;
        MultipartRequest(endPoint, "PUT", body)
            .then((res) => {
                getBonusContent();
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
            });
    };

    return (
        <>
            <div className="BonusContentEdit-Wrapper">
                <div className="database-filters">
                    {bonusContentData &&
                        bonusContentData.map((elem) => {
                            return (
                                <Button
                                    key={elem.id}
                                    variant="primary"
                                    className={
                                        active === elem.id
                                            ? "Ingredients-btn Ingredients-btn-checked"
                                            : "Ingredients-btn"
                                    }
                                    onClick={() =>
                                        titleButtonClickHandler(elem.id)
                                    }
                                >
                                    {elem.title}
                                </Button>
                            );
                        })}

                    <Button
                        variant=""
                        className="w-20 rounded-pill add-bonus-btn"
                        onClick={() => {
                            toggleModalVisibility(true);
                        }}
                    >
                        Add New
                    </Button>
                </div>
            </div>
            <BonusForm
                loading={loading}
                updateBonusContent={updateBonusContentHandler}
                bonusData={
                    bonusContentData == undefined
                        ? bonusContentData
                        : bonusContentData.find((elem) => elem.id === active)
                }
            />
            <>
                {
                    <BonusModal
                        addBonusContentData={resetBonusContentData}
                        isVisible={isModalVisible}
                        setter={toggleModalVisibility}
                    />
                }
            </>
        </>
    );
};

export default Bonus;

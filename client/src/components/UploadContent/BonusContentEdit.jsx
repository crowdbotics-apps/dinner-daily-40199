import React, { useState } from "react";
import { Button } from "react-bootstrap";
import DinnerPartyPlans from "../DinnerPartyPlans";
import Coupons from "../Coupons";
import MakeAheadMenus from "../MakeAheadMenus";
import AddNewBonusContent from "../AddNewBonusContent";
import "./styles.scss";

const BonusContentEdit = (props) => {
    const [showIngredients, setShowIngredients] = useState(true);
    const [showRecipiesPage, setshowRecipiesPage] = useState(false);
    const [showStoresPage, setshowStoresPage] = useState(false);
    const [showAddPopup, setAddPopup] = useState(false);

    const hideModal = () => {
        setAddPopup(false);
    };

    const handleRecipieBtn = () => {
        setshowRecipiesPage(true);
        setShowIngredients(false);
        setshowStoresPage(false);
    };

    const handleIngredientsBtn = () => {
        setShowIngredients(true);
        setshowRecipiesPage(false);
        setshowStoresPage(false);
    };

    const handleStoresBtn = () => {
        setshowStoresPage(true);
        setShowIngredients(false);
        setshowRecipiesPage(false);
    };
    return (
        <>
            <div className="BonusContentEdit-Wrapper">
                <div className="database-filters">
                    <Button
                        variant="primary"
                        className={
                            showIngredients === true
                                ? "Ingredients-btn Ingredients-btn-checked"
                                : "Ingredients-btn"
                        }
                        onClick={() => handleIngredientsBtn()}
                    >
                        Dinner Party Plans
                    </Button>

                    <div className="recipies-btn-wrapper">
                        <Button
                            variant="primary"
                            className={
                                showRecipiesPage === true
                                    ? "Ingredients-btn Ingredients-btn-checked"
                                    : "Ingredients-btn"
                            }
                            onClick={() => handleRecipieBtn()}
                        >
                            Coupons
                        </Button>
                    </div>

                    <div className="stores-btn-wrapper">
                        <Button
                            variant="primary"
                            className={
                                showStoresPage === true
                                    ? "Ingredients-btn Ingredients-btn-checked"
                                    : "Ingredients-btn"
                            }
                            onClick={() => handleStoresBtn()}
                        >
                            Make Ahead Menus
                        </Button>
                    </div>
                    <Button
                        variant=""
                        className="w-25 rounded-pill add-bonus-btn"
                        onClick={() => setAddPopup(true)}
                    >
                        Add New
                    </Button>
                </div>
            </div>
            <>{showIngredients === true && <DinnerPartyPlans />}</>
            <>{showRecipiesPage === true && <Coupons />}</>
            <>{showStoresPage === true && <MakeAheadMenus />}</>
            <>
                {showAddPopup === true && (
                    <AddNewBonusContent
                        show={showAddPopup}
                        onHide={hideModal}
                    />
                )}
            </>
        </>
    );
};

export default BonusContentEdit;

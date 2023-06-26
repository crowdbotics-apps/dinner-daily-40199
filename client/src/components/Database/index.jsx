import React, { useState } from "react"
import Ingredients from "./Ingredients"
import Recipies from "./Recipies"
import Stores from "./Stores"
import { Button, Dropdown, Row, Col, Form } from "react-bootstrap"
import "./database.scss"

const Database = () => {
  const [showIngredients, setShowIngredients] = useState(true)
  const [showRecipiesPage, setshowRecipiesPage] = useState(false)
  const [showStoresPage, setshowStoresPage] = useState(false)

  const handleRecipieBtn = () => {
    setshowRecipiesPage(true)
    setShowIngredients(false)
    setshowStoresPage(false)
  }

  const handleIngredientsBtn = () => {
    setShowIngredients(true)
    setshowRecipiesPage(false)
    setshowStoresPage(false)
  }

  const handleStoresBtn = () => {
    setshowStoresPage(true)
    setShowIngredients(false)
    setshowRecipiesPage(false)
  }

  return (
    <div className="database-container">
      <span className="database-heading">Database</span>
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
          Ingredients
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
            Recipies
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
            Stores
          </Button>
        </div>
      </div>
      <>{showIngredients === true && <Ingredients />}</>
      <>{showRecipiesPage === true && <Recipies />}</>
      <>{showStoresPage === true && <Stores />}</>
    </div>
  )
}

export default Database

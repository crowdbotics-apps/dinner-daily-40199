import React  from "react";
import ReactSelect from "react-select";

const customSelect =(props)=>{
const {
    openMenuOnClick,
    placement,
    formField,
    placeholder,
    options,
    value,
    onSelectChange,
    readOnly,
    multi,
    stringData
} = props;


return (
 <>
    <ReactSelect
      className="exclude-ing-select"
      isMulti={multi}
      placeholder={placeholder}
      options={options?.map((option) => {
        return {
          value: option?.id,
          label: option?.name,
        };
      })}
      value={multi ? value && Object.keys(value)?.length > 0 ? value : "" : options?.filter((option) => {
          return option?.id === (stringData ? value : parseInt(value));
        })?.map((list) => {
          return {
            value: list?.id,
            label: list?.name,
          };
        })}
      onChange={(e) =>onSelectChange(multi?e:e.value,formField)
      }
      isDisabled={readOnly}
      placement={placement ? placement:""}
      openMenuOnClick={openMenuOnClick !== undefined ? openMenuOnClick : true}
    />
  </>
)

}

export default customSelect
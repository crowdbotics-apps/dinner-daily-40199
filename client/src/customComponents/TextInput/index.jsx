import React, { useRef } from "react";
import "./styles.scss";

export default function TextInput({
    label,
    type,
    name,
    onChange,
    onBlur,
    value,
    className,
    showdisabled = false,
    placeholder,
    onFocus,
}) {
    const inputFieldRef = useRef(null);

    return (
        <div className="textInput">
            <div
                className={
                    value !== null && value !== undefined
                        ? "input-container hasValue"
                        : "input-container"
                }
            >
                <input
                    placeholder={placeholder}
                    ref={inputFieldRef}
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    className={className}
                    disabled={showdisabled}
                    placeholder={label}
                />
                <>
                    {showdisabled === false && (
                        <div
                            className="input-label"
                            onClick={() => inputFieldRef.current?.focus()}
                        >
                            {/* <span>{label}</span> */}
                        </div>
                    )}
                </>
            </div>
        </div>
    );
}

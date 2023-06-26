const validFileExtensions = {
    image: ["jpg", "png", "jpeg", "svg", "webp"],
    excel: ["xls", "xlsx"],
    pdf: ["pdf"],
};

export const isValidFileType = (fileName, fileType) => {
    return (
        fileName &&
        validFileExtensions[fileType].indexOf(fileName.split(".").pop()) > -1
    );
};

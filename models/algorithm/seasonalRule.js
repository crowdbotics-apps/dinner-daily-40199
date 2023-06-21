const rfr = require("rfr");

const helper = rfr("/shared/helper");
const constant = rfr("/shared/constant");
const utils = rfr("/shared/utils");

const get = () => {
  try {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentDate = today.getDate();
    let notMatchedSeason = [];

    for (let season in constant["SEASONAL_RULES"]) {
        let range = constant["SEASONAL_RULES"][season];
        let [startRange, endRange] = range
            .split("-")
            .map((item) => item.trim());
        let [startDay, startMonth] = startRange.split(" ");
        let [endDay, endMonth] = endRange.split(" ");

        if (
            (currentMonth === helper.getMonthIndex(startMonth) &&
                currentDate >= parseInt(startDay)) ||
            (currentMonth === helper.getMonthIndex(endMonth) &&
                currentDate <= parseInt(endDay)) ||
            (currentMonth > helper.getMonthIndex(startMonth) &&
                currentMonth < helper.getMonthIndex(endMonth))
        ) {
            continue;
        } else {
            notMatchedSeason.push(season);
        }
    }

    return notMatchedSeason;
  } catch (error) {
    utils.writeErrorLog("seasonalRule", "get", "Error while fetching seasonal rule", error);
    throw error.message || error;
  }
};

module.exports = {
    get,
};

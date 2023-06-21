const rfr = require('rfr');
const constant = rfr('/shared/constant');
const config = rfr('/shared/config');
const sgMail = require('@sendgrid/mail')

const dietPlanMapping = {
    "red meat": "redMeat",
    "pork": "pork",
    "poultry": "poultry",
    "fish": "fish",
    "shellfish": "shellfish",
    "vegetarian": "vegetarian",
    "dairy-free": "dairyFree",
    "gluten-free": "glutenFree",
    "peanut-free": "peanutFree",
    "tree nut-free": "treeNutFree",
    "reduced carb": "reducedCarb",
    "soy-free": "soyFree",
    "egg-free": "eggFree",
    "basics": "stickToBasics"
}

const notEmpty = (value) => {
    return (
                (value === undefined) ||
                (value == null) ||
                (value.length <= 0)
            ) ? false : true;
  }

  const getDateAndTime = () => {
    const timestamp = new Date().getTime();
    let date = new Date(timestamp);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    if (hour < 10) hour = '0' + hour;
    if (min < 10) min = '0' + min;
    if (sec < 10) sec = '0' + sec;
    let datestr = year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
    return datestr;
  }

  const getTimeStemp = (days)=>{
    if(days){
        let newDate = new Date(Date.now() + days * 24*60*60*1000)
         return new Date(newDate).getTime();
      }
      return 1

}
const getPagination = (page, pageSize, orderKey, orderType) => {
    const limit = pageSize ? parseInt(pageSize) : constant['PAGE_SIZE'];
    const order_key = orderKey ? orderKey : constant['ORDEY_KEY'];
    const order_type = orderType ? orderType : constant['ORDER_BY'];
    const pageValue = page ? parseInt(page) : 1;
    const offset = (pageValue != 1) ? ((pageValue-1) * limit) : 0;
    return {limit,offset,order_key,order_type}
};

const weekMenu = {
  'start_date': getDateAndTime(),
  'publishing_date': getDateAndTime(),
  'status': '1',
  'created': getDateAndTime(),
  'store_id': '1',
  'build_started_date': getDateAndTime(),
  'build_ended_date': getDateAndTime(),
  'build_initiated_date': getDateAndTime(),
}

const convertDateTimeToUTC = (date, time) => {
  const [day, month, year] = date.split('/');
  const [hours, minutes] = time.split(':');

  // Create a new Date object in the local timezone
  return new Date(year, month - 1, day, hours, minutes);
}

const weekDayMapping = {
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thurs',
  5: 'Fri',
  6: 'Sat',
  7: 'Sun'
}

const monthMapping = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec'
}

const defaultShoppingListItemsObj = {
  type: 1,
  amount: 0,
  is_optional: 0,
  dish_type: 0,
  is_on_sale: 0,
  times_used: 1,
  checked_off: 0
}


// Function for format MsgData
const emailMsgFormat = (email, subject, text, html, replyTo) => {
	sgMail.setApiKey(config.sendgridKey);
	const msgObj = {
		to: email,
		from: config.sendgridEmail,
		subject: subject
	}
	if (replyTo) {
		msgObj.replyTo = replyTo;
	}
	if (text) {
		msgObj.text = text;
	} else if (html) {
		msgObj.html = html;
	}

	return msgObj;
}

const generatePassword = (length)=> {
  let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
   }
   return retVal;
}

const categoryMap = {
  'Dairy': [ 'Beverages', 'Dairy' ],
    'Meat/Poultry': [ 'Meat & Seafood' ],
    'Seafood': [ 'Meat & Seafood' ],
    'Grocery': [
        'Bakery',
        'Baking Goods',
        'Beverages',
        'Breakfast',
        'Canned & Packaged',
        'Cleaning Products',
        'Condiment & Sauces',
        'Deli',
        'International',
        'Pasta, Sauces, Grain',
        'Snacks'
    ],
    'Produce': [
        'Produce',
        'Natural & Organic'
    ],
    'Frozen Foods': [ 'Frozen' ],
    'Staple': ['Staple']
  }

  const formatDateToDDMMYYYY = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const getMonthIndex = month => {
    let monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return monthNames.indexOf(month);
  }

  const formatRules = (rules) => {
    return rules.reduce((acc, item) => {
      const { type, rule_id } = item;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(rule_id);
      return acc;
    }, {});
  }

  // Function to format user diet plan response to frontend
const formatDietPlanOptions = (res = []) => {
  const resObj = {
    foodPreference: {},
    dietryNeed: {},
  };
  for (let i = 0; i < res.length; i++) {
    let name = dietPlanMapping[res[i].internal_id];
    if (res[i].type === 'numeric') {
      resObj.foodPreference[name] = res[i].value;
    } else {
      resObj.dietryNeed[name] = !!res[i].checked;
    }
  }
  const firstRes = res[0] || [];
  resObj.dietryNeed.heartHealthy = !!firstRes.heart_healthy;
  resObj.familySize = firstRes.family_size;
  resObj.state = Number(firstRes.state);
  resObj.stateName = firstRes.stateName;
  resObj.store = firstRes.preferred_store_id;
  resObj.storeName = firstRes.storeName;
  return resObj;
};

const ruleTypeMapping = {
  'tag_names': 'recipeTag',
  'ingredient_tag_names': 'ingredientTag',
  'category_ids': 'ingredientCategory',
  'ingredient_id': 'ingredient',
  'cooking_type': 'cookingType'
}

module.exports = {
    dietPlanMapping,
    getPagination,
    notEmpty,
    getDateAndTime,
    getTimeStemp,
    weekMenu,
    defaultShoppingListItemsObj,
    emailMsgFormat,
    generatePassword,
    weekDayMapping,
    monthMapping,
    categoryMap,
    convertDateTimeToUTC,
    formatDateToDDMMYYYY,
    getMonthIndex,
    formatRules,
    formatDietPlanOptions,
    ruleTypeMapping
}
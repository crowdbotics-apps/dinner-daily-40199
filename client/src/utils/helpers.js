import roles from "./Roles";
import { DaysArray, DishType, Status, TimeArray } from "./constants";

export function firstLetterUpperCase(str) {
    if (str)
      return str.charAt(0).toUpperCase() + str.slice(1)
    else return "-";
  }

  export function shortName(nameStr) {
    let firstChar ="";
    let secondChar = "";
    if (nameStr){
        const nameParts = nameStr.split(" ");
        firstChar = nameParts[0].charAt(0).toUpperCase();
        secondChar = nameParts.length >1 ? nameParts[1]?.charAt(0).toUpperCase():"";
        return firstChar + secondChar
    }
    else return "-";
  }

  export function formatPhoneNumber (phonenumber){
    if(phonenumber){
        return phonenumber
     }else return false;
  }

  export function formatRole (role){
   if(role){
        const roleData = roles.find((item)=> item.id === role);
        return roleData ? roleData.lable : "-"
    }
  }

  export function formatTime (time,val){
    if(time){
      let updateTime = time.split(":");
      updateTime = updateTime[0] + ":" + updateTime[1]
      const timeData = TimeArray.find((item)=> item.value === updateTime);
      return timeData ? val ? timeData.value :timeData.label : "-"
    }
    return time;
  }

  export function formatDishtype (type){
    if(type){
         const dishData = DishType.find((item)=> item.value === type);
         return dishData ? dishData.label : "-"
     } return "-";
   }

   export function formatStatus (st){
    if(st){
         const statusData = Status.find((item)=> item.value === st);
         return statusData ? statusData.label : "-"
     } return "-";
   }

   export function formatDay (day){
    if(day){
         const dayData = DaysArray.find((item)=> item.value === day);
         return dayData ? dayData.label : "-"
     }
     return "-";
   }

   export function formateDateTime(dt,onlyDate){
    if(dt){
      const timestamp = new Date(dt).getTime();
      const date = new Date(timestamp);
      const year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let min = date.getMinutes();
      let sec = date.getSeconds();
      if (day < 10) day = '0' + day;
      if (month < 10) month = '0' + month;
      if (hour < 10) hour = '0' + hour;
      if (min < 10) min = '0' + min;
      if (sec < 10) sec = '0' + sec;
      let datestr = year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
      return onlyDate ? year + "-" + month + "-" + day : datestr;
    }
   }


   export function formateDate(timestamp){
    if(timestamp){
      const date = new Date(timestamp*1000);
      const year = date.getFullYear();
      let month = date.getMonth();
      let day = date.getDate();
      if (day < 10) day = '0' + day;
      if (month < 10) month = '0' + month;
      const newdate = new Date(year, month, day);
      const monthname = newdate.toLocaleString('default', { month: 'long' });
      let datestr = day+"  "+monthname+"  "+year
      return datestr;
    }
   }

  export function multiSelectValue (values){
    const updatedValue = values?.map((val)=>{
          return{
            value: val?.id,
            label: val?.name
          }
       })
    return updatedValue
}

export function recipeCombinationId(sides){
     return  [...new Set(sides.map((item)=>item.recipe_side_combination_id))]

}

export function recipeCombinationTagId(sides){
  return [...new Set (sides.map((item)=>item.recipe_side_item_id))]
}

export function uploadContentFilter(type,content){
     return content?.find(item=>item.content_type === type)
}
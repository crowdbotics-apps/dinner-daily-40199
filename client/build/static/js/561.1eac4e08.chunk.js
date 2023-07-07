"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[561],{2561:function(e,n,a){a.r(n),a.d(n,{default:function(){return B}});var t=a(4165),l=a(3433),i=a(5861),r=a(9439),o=a(2791),s=a(9743),u=a(2677),d=a(1413),c=a(3360),v=a(2506),m=a(8171),f=a(9177),p=a(7467),b=a(8007),h=b.Ry().shape({title:b.Z_().required("Title is required"),content:b.Z_().required("Content is required")}),g=a(6504),x=a(9365),Z=a(4238),N=a(184),_=function(e){var n=e.formdata,a=e.formtype,l=e.updatecontent,s=(0,o.useState)(!0),u=(0,r.Z)(s,2),b=u[0],_=u[1],j=(0,o.useState)(!1),w=(0,r.Z)(j,2),y=(w[0],w[1]),M=(0,o.useState)(null),C=(0,r.Z)(M,2),S=(C[0],C[1]);(0,o.useEffect)((function(){n&&Object.keys(n).forEach((function(e){return D(e,n[e]||"",!1)}))}),[n]);var P=(0,v.TA)({initialValues:g.HU,validationSchema:h,onSubmit:function(){var e=(0,i.Z)((0,t.Z)().mark((function e(){var n,a;return(0,t.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return y(!0),n=(0,d.Z)((0,d.Z)({},E),{},{created:(0,Z.l)(null===E||void 0===E?void 0:E.created)}),console.log("----values----",E),e.next=5,(0,x.ek)(n,null===E||void 0===E?void 0:E.id,"Member News"===E.content_type);case 5:null!==(a=e.sent)&&void 0!==a&&a.status?l(null===a||void 0===a?void 0:a.data):S(null===a||void 0===a?void 0:a.message);case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()}),A=P.resetForm,k=P.handleSubmit,B=P.handleChange,T=P.handleBlur,D=P.setFieldValue,E=P.values,F=P.touched,L=P.errors,Y=P.isSubmitting;return(0,N.jsxs)("div",{className:"MemberNewsEdit-Wrapper col-8",children:[(0,N.jsxs)("div",{className:"edit-card-heading-div d-flex justify-content-between w-75",children:[(0,N.jsxs)("span",{className:"edit-card-heading",children:[a," Details"]}),(0,N.jsx)("img",{src:null===p.Z||void 0===p.Z?void 0:p.Z.edit,className:"edit-icon",alt:"edit icon NP",onClick:function(){return _(!1)}})]}),(0,N.jsxs)("form",{onSubmit:k,className:"w-75",children:[(0,N.jsxs)("div",{className:L.title&&F.title?"emailredborder inputdiv":"inputdiv",children:[(0,N.jsx)("span",{className:"text-label",children:"New Title"}),(0,N.jsx)(f.Z,{label:"New Title",name:"title",type:"text",onChange:B,onBlur:T,value:null===E||void 0===E?void 0:E.title,className:"mt-2 form-control ".concat(F&&F[null===E||void 0===E?void 0:E.title]&&L[null===E||void 0===E?void 0:E.title]?"is-invalid":""),showdisabled:b}),(0,N.jsx)(m.Z,{errormsg:null===L||void 0===L?void 0:L.title,touchedmsg:null===F||void 0===F?void 0:F.title})]}),(0,N.jsxs)("div",{className:L.content&&F.content&&L.content?"emailredborder inputdiv":"inputdiv",children:[(0,N.jsx)("span",{className:"text-label",children:"Content"}),(0,N.jsx)("textarea",{placeholder:"Content",name:"content",rows:5,onChange:B,onBlur:T,value:null===E||void 0===E?void 0:E.content,className:"mt-2 form-control ".concat(F&&F[null===E||void 0===E?void 0:E.content]&&L[null===E||void 0===E?void 0:E.content]?"is-invalid":""),disabled:b}),(0,N.jsx)(m.Z,{errormsg:null===L||void 0===L?void 0:L.content,touchedmsg:null===F||void 0===F?void 0:F.content})]}),(0,N.jsx)(N.Fragment,{children:!b&&(0,N.jsxs)("div",{className:"edit-btns pt-3",children:[(0,N.jsx)(c.Z,{variant:"",className:"w-50 rounded-pill cancel-btn",onClick:function(){return A()},disabled:Y,type:"button",children:"Cancel"}),(0,N.jsx)(c.Z,{variant:"",className:"w-50 rounded-pill save-btn",type:"submit",disabled:Y,children:"Post"})]})})]})]})},j=a(1260),w=a(3585),y=a(1048),M=a(304),C=function(e){var n=e.updateBonusContent,a=e.bonusData,l=e.loading,s=(0,o.useState)(!1),u=(0,r.Z)(s,2),d=u[0],f=u[1],h=(0,v.TA)({initialValues:{content:"",icon:"",pdf:""},validationSchema:b.Ry().shape({icon:b.nK().required("Icon cannot be empty").test("is-valid-type","Not a valid file type",(function(e){return(0,y.b)(e&&(e.name?e.name.toLowerCase():e.name),"image")})),pdf:b.nK().required("Content cannot be empty").test("is-valid-type","Not a valid file type",(function(e){return console.log(e),(0,y.b)(e&&(e.name?e.name.toLowerCase():e.name),"pdf")})),content:b.Z_().required("Button Title cannot be empty")}),onSubmit:function(){var e=(0,i.Z)((0,t.Z)().mark((function e(){var a;return(0,t.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a={icon:null===j||void 0===j?void 0:j.icon,button_title:null===j||void 0===j?void 0:j.content,content:null===j||void 0===j?void 0:j.pdf},n(a);case 2:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()}),g=h.resetForm,x=h.handleSubmit,Z=h.handleChange,_=h.handleBlur,j=h.values,w=h.touched,C=h.errors,S=h.setFieldValue,P=h.setValues;return(0,o.useEffect)((function(){console.log(a),f(!1),g(),a&&P({content:a.button_title,icon:a.icon?{name:a.icon}:void 0,pdf:a.content?{name:a.content}:void 0})}),[a]),(0,N.jsxs)("div",{className:"DinnerPartyPlans-Wrapper col-8",children:[(0,N.jsxs)("div",{className:"edit-card-heading-div d-flex justify-content-between align-items-center mb-4 w-75",children:[(0,N.jsx)("span",{className:"edit-card-heading-txt",children:"Details"}),!d&&(0,N.jsx)("img",{src:null===p.Z||void 0===p.Z?void 0:p.Z.edit,className:"edit-icon",alt:"edit icon NP",onClick:function(){return f(!0)}})]}),(0,N.jsxs)("form",{onSubmit:x,className:"w-75",children:[(0,N.jsxs)("div",{className:"image-upload",children:[(0,N.jsxs)("div",{className:"upload-imagewrapper d-flex",children:[(0,N.jsx)("img",{src:null===p.Z||void 0===p.Z?void 0:p.Z.uploadimage,className:"upload-image-img",alt:"upload-imageNP"}),(0,N.jsx)("span",{className:"upload-txt",children:j.icon?j.icon.name:"Upload Icon"})]}),(0,N.jsxs)("label",{className:"upload-image-label",children:[(0,N.jsx)("img",{src:null===p.Z||void 0===p.Z?void 0:p.Z.uploadicon,className:"upload-image-img",alt:"upload-imageNP"}),(0,N.jsx)("input",{id:"icon",name:"icon",type:"file",onChange:function(e){S("icon",e.currentTarget.files[0])}})]})]}),(0,N.jsx)(m.Z,{errormsg:null===C||void 0===C?void 0:C.icon,touchedmsg:null===w||void 0===w?void 0:w.icon}),(0,N.jsx)("span",{className:"image-upload-info mb-3 mt-2",children:"Image should be a png/svg and no more than 48x48 pixels"}),(0,N.jsxs)("div",{className:C.icon&&w.icon&&C.icon?"emailredborder inputdiv":"inputdiv",children:[(0,N.jsx)("span",{className:"text-label",children:"Content"}),(0,N.jsx)("textarea",{placeholder:"Content",name:"content",rows:3,onChange:Z,onBlur:_,value:j.content,className:"mt-2 form-control ".concat(w&&w[null===j||void 0===j?void 0:j.content]&&C[null===j||void 0===j?void 0:j.content]?"is-invalid":""),disabled:!d}),(0,N.jsx)(m.Z,{errormsg:null===C||void 0===C?void 0:C.content,touchedmsg:null===w||void 0===w?void 0:w.content})]}),(0,N.jsxs)("div",{className:"image-upload mt-5",children:[(0,N.jsxs)("div",{className:"upload-imagewrapper d-flex",children:[(0,N.jsx)("img",{src:null===p.Z||void 0===p.Z?void 0:p.Z.uploadpdf,className:"upload-image-img",alt:"upload-imageNP"}),(0,N.jsx)("span",{className:"upload-txt",children:j.pdf?j.pdf.name:"Upload Pdf"})]}),(0,N.jsxs)("label",{className:"upload-image-label",children:[(0,N.jsx)("img",{src:null===p.Z||void 0===p.Z?void 0:p.Z.uploadicon,className:"upload-image-img",alt:"upload-imageNP"}),(0,N.jsx)("input",{id:"pdf",name:"pdf",type:"file",onChange:function(e){S("pdf",e.currentTarget.files[0])}})]})]}),(0,N.jsx)(m.Z,{errormsg:null===C||void 0===C?void 0:C.pdf,touchedmsg:null===w||void 0===w?void 0:w.pdf}),l&&(0,N.jsx)(M.Z,{loadingMsg:"loading..."}),(0,N.jsx)(N.Fragment,{children:!0===d&&(0,N.jsxs)("div",{className:"edit-btns pt-3",children:[(0,N.jsx)(c.Z,{variant:"",className:"w-50 rounded-pill cancel-btn",type:"reset",onClick:function(){return f(!1)},children:"Cancel"}),(0,N.jsx)(c.Z,{variant:"",className:"w-50 rounded-pill save-btn",type:"submit",children:"Post"})]})})]})]})},S=a(9286),P=a(9689),A=function(e){var n=(0,o.useState)(!1),a=(0,r.Z)(n,1)[0],l=(0,o.useState)(!1),s=(0,r.Z)(l,2),u=s[0],p=s[1],h=(0,o.useState)(!1),g=(0,r.Z)(h,2),Z=g[0],_=g[1],w=(0,v.TA)({initialValues:{category:""},validationSchema:b.Ry().shape({category:b.Z_().required("Category cannot be empty")}),onSubmit:function(){var n=(0,i.Z)((0,t.Z)().mark((function n(){var a;return(0,t.Z)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:console.log(A),p(!0),a={title:null===A||void 0===A?void 0:A.category},(0,x.WY)(S.Z.bonusContent,"POST",a,!0).then((function(n){p(!1),e.setter(!1),console.log("add category"),(0,x.WY)(S.Z.adminBonusContent,"GET").then((function(n){console.log(n.data),e.addBonusContentData(n.data)}))})).catch((function(n){p(!1),e.setter(!1),console.log(n),_(n.message)}));case 4:case"end":return n.stop()}}),n)})));return function(){return n.apply(this,arguments)}}()}),y=(w.resetForm,w.handleSubmit),M=w.handleChange,C=w.handleBlur,A=w.values,k=w.touched,B=w.errors;return(0,N.jsx)("div",{className:"AddNewBonusContent-wrapper",children:(0,N.jsxs)(P.Z,(0,d.Z)((0,d.Z)({},e),{},{size:"md","aria-labelledby":"contained-modal-title-vcenter",className:"add-bonus-modal",show:e.isVisible,onHide:function(){return e.setter(!1)},centered:!0,children:[(0,N.jsx)(P.Z.Header,{className:"heading border-bottom-0 p-0",children:(0,N.jsx)(P.Z.Title,{children:"Add Category"})}),(0,N.jsxs)(P.Z.Body,{className:" p-0 pt-2",children:[(0,N.jsxs)("form",{onSubmit:y,className:"w-100",children:[(0,N.jsxs)("div",{className:B.username&&k.username&&B.username?"emailredborder":"",children:[(0,N.jsx)("span",{className:"input-label",children:"Category Title"}),(0,N.jsx)(f.Z,{label:"Sample Category Name Here",name:"category",type:"text",onChange:M,onBlur:C,value:A.category,className:"mt-2 form-control ".concat(k&&k[null===A||void 0===A?void 0:A.category]&&B[null===A||void 0===A?void 0:A.category]?"is-invalid":"")}),(0,N.jsx)(m.Z,{errormsg:null===B||void 0===B?void 0:B.category,touchedmsg:null===k||void 0===k?void 0:k.category})]}),(0,N.jsxs)("div",{className:"btn-wrapper",children:[(0,N.jsx)(c.Z,{className:"cancel-btn w-25 me-2",variant:"outline-primary rounded-pill",onClick:function(){return e.setter(!1)},disabled:u,children:"Cancel"}),(0,N.jsx)(c.Z,{className:"save-btn w-25",variant:"primary rounded-pill",type:"submit",disabled:u,children:"Add"})]})]}),(0,N.jsxs)(N.Fragment,{children:[!0===Z&&(0,N.jsx)(j.Z,{errormsg:"Error in adding root"}),!0===a&&(0,N.jsx)("span",{className:"rstPassSuccessMsg text-center font-medium-20 mt-3 d-flex justify-content-center align-items-center",children:"Category has been added successfully"})]})]})]}))})},k=function(e){var n=(0,o.useState)(void 0),a=(0,r.Z)(n,2),s=a[0],u=a[1],d=(0,o.useState)(void 0),v=(0,r.Z)(d,2),m=v[0],f=v[1],p=(0,o.useState)(!1),b=(0,r.Z)(p,2),h=b[0],g=b[1],Z=(0,o.useState)(!1),_=(0,r.Z)(Z,2),j=_[0],w=_[1],y=function(){var e=(0,i.Z)((0,t.Z)().mark((function e(){var n,a;return(0,t.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,(0,x.WY)(S.Z.adminBonusContent,"GET");case 3:n=e.sent,a=n.data,console.log(a),a&&f(a),e.next=12;break;case 9:e.prev=9,e.t0=e.catch(0),console.log(e.t0);case 12:case"end":return e.stop()}}),e,null,[[0,9]])})));return function(){return e.apply(this,arguments)}}();(0,o.useEffect)((function(){y()}),[]),(0,o.useEffect)((function(){m&&m.length>0&&u(m[0].id)}),[m]);return(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)("div",{className:"BonusContentEdit-Wrapper",children:(0,N.jsxs)("div",{className:"database-filters",children:[m&&m.map((function(e){return(0,N.jsx)(c.Z,{variant:"primary",className:s===e.id?"Ingredients-btn Ingredients-btn-checked":"Ingredients-btn",onClick:function(){return n=e.id,void u(n);var n},children:e.title},e.id)})),(0,N.jsx)(c.Z,{variant:"",className:"w-20 rounded-pill add-bonus-btn",onClick:function(){g(!0)},children:"Add New"})]})}),(0,N.jsx)(C,{loading:j,updateBonusContent:function(e){w(!0);var n=S.Z.bonusContent+s;(0,x.Xo)(n,"PUT",e).then((function(e){y(),w(!1)})).catch((function(e){w(!1),console.log(e)}))},bonusData:void 0==m?m:m.find((function(e){return e.id===s}))}),(0,N.jsx)(N.Fragment,{children:(0,N.jsx)(A,{addBonusContentData:function(e){f((function(){return(0,l.Z)(e)}))},isVisible:h,setter:g})})]})},B=function(){var e=(0,o.useState)(w.L0),n=(0,r.Z)(e,2),a=n[0],d=n[1],c=(0,o.useState)(!1),v=(0,r.Z)(c,2),m=(v[0],v[1]),f=(0,o.useState)([]),b=(0,r.Z)(f,2),h=b[0],g=b[1],j=(0,o.useState)(null),y=(0,r.Z)(j,2),M=y[0],C=y[1];function S(){return(S=(0,i.Z)((0,t.Z)().mark((function e(){var n;return(0,t.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,x.g3)();case 2:null!==(n=e.sent)&&void 0!==n&&n.status?(g(null===n||void 0===n?void 0:n.data),C((0,Z.aY)(w.Y9,null===n||void 0===n?void 0:n.data)),m(!1)):m(!1);case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}(0,o.useEffect)((function(){m(!0),function(){S.apply(this,arguments)}()}),[]);var P=function(e){d(e),C((0,Z.aY)(e,h))};return(0,N.jsxs)("div",{className:"subscription",children:[(0,N.jsx)(s.Z,{className:"first-row",children:(0,N.jsx)(u.Z,{className:"d-flex user-heading-col",md:4,children:(0,N.jsx)("div",{className:"users-heading",children:(0,N.jsx)("span",{className:"heading-txt",children:"Upload Content"})})})}),(0,N.jsxs)(s.Z,{className:"second-row",children:[(0,N.jsx)(u.Z,{className:"second-row-first-col border-right",md:3,children:(0,N.jsxs)("div",{className:"upload-content-card",children:[(0,N.jsxs)("div",{className:a===w.Y9?"member-news showactive":"member-news",onClick:function(){return P(w.Y9)},children:[(0,N.jsx)("img",{src:null===p.Z||void 0===p.Z?void 0:p.Z.membernews,alt:"member news NP",className:"member-newsicon"}),(0,N.jsx)("span",{className:"member-newstxt",children:w.Y9})]}),(0,N.jsxs)("div",{className:a===w.a7?"member-news showactive":"member-news",onClick:function(){return P(w.a7)},children:[(0,N.jsx)("img",{src:null===p.Z||void 0===p.Z?void 0:p.Z.testimonials,alt:"member news NP",className:"member-newsicon"}),(0,N.jsx)("span",{className:"member-newstxt",children:w.a7})]}),(0,N.jsxs)("div",{className:a===w.fH?"member-news showactive":"member-news",onClick:function(){return P(w.fH)},children:[(0,N.jsx)("img",{src:null===p.Z||void 0===p.Z?void 0:p.Z.weeklytips,alt:"member news NP",className:"member-newsicon"}),(0,N.jsx)("span",{className:"member-newstxt",children:w.fH})]}),(0,N.jsxs)("div",{className:a===w.L0?"member-news showactive":"member-news",onClick:function(){return d(w.L0)},children:[(0,N.jsx)("img",{src:null===p.Z||void 0===p.Z?void 0:p.Z.bonuscontent,alt:"member news NP",className:"member-newsicon"}),(0,N.jsx)("span",{className:"member-newstxt",children:w.L0})]})]})}),(0,N.jsx)(u.Z,{className:"second-row-second-col mt-4",md:6,children:(0,N.jsx)("div",{className:"second-row-second-col-div",children:(0,N.jsx)(N.Fragment,{children:a===w.L0?(0,N.jsx)(k,{}):M&&(0,N.jsx)(_,{formtype:a,formdata:M,updatecontent:function(e){var n=(0,l.Z)(h),a=n.findIndex((function(n){return(null===n||void 0===n?void 0:n.content_type)===(null===e||void 0===e?void 0:e.content_type)}));n[a]=e,g(n)}})})})})]})]})}},3585:function(e,n,a){a.d(n,{CN:function(){return N},DB:function(){return m},FW:function(){return v},Hm:function(){return p},I$:function(){return c},L0:function(){return d},Ly:function(){return l},M_:function(){return Z},V6:function(){return x},Xe:function(){return r},Y9:function(){return o},a7:function(){return s},fH:function(){return u},mm:function(){return g},nD:function(){return h},qb:function(){return f},sO:function(){return t},vm:function(){return b},w_:function(){return i}});var t="Yes",l="No",i="Pending",r="Published",o="Member News",s="Testimonials",u="Weekly Tips",d="Bonus Content",c=[{value:1,label:"1"},{value:2,label:"2"},{value:3,label:"3"},{value:4,label:"4"}],v=[{value:"ALL",label:"All"},{value:"SUBSCRIBED",label:"Subscribed"},{value:"UNSUBCRIBED",label:"Unsubscribed"}],m=[{value:0,label:"0"},{value:1,label:"1"},{value:2,label:"2"}],f=[{value:0,label:"Draft"},{value:1,label:"Pending"},{value:2,label:"Published"}],p=[{value:"",label:""},{value:1,label:"Skillet/stovetop"},{value:2,label:"Slow cooker"},{value:3,label:"Broil/grill"},{value:4,label:"Baked"},{value:5,label:"Soup"},{value:7,label:"Stew"},{value:6,label:"Other"}],b=[{value:1,label:"Ascending"},{value:2,label:"Descending"}],h=[{value:1,label:"Main"},{value:2,label:"Side"},{value:3,label:"Dessert"}],g=[{value:1,label:"Monday"},{value:2,label:"Tuesday"},{value:3,label:"Wednesday"},{value:4,label:"Thursday"},{value:5,label:"Friday"},{value:6,label:"Saturday"},{value:7,label:"Sunday"}],x=[{label:"12:00 AM",value:"00:00"},{label:"12:30 AM",value:"00:30"},{label:"1:00 AM",value:"01:00"},{label:"1:30 AM",value:"01:30"},{label:"2:00 AM",value:"02:00"},{label:"2:30 AM",value:"02:30"},{label:"3:00 AM",value:"03:00"},{label:"3:30 AM",value:"03:30"},{label:"4:00 AM",value:"04:00"},{label:"4:30 AM",value:"04:30"},{label:"5:00 AM",value:"05:00"},{label:"5:30 AM",value:"05:30"},{label:"6:00 AM",value:"06:00"},{label:"6:30 AM",value:"06:30"},{label:"7:00 AM",value:"07:00"},{label:"7:30 AM",value:"07:30"},{label:"8:00 AM",value:"08:00"},{label:"8:30 AM",value:"08:30"},{label:"9:00 AM",value:"09:00"},{label:"9:30 AM",value:"09:30"},{label:"10:00 AM",value:"10:00"},{label:"10:30 AM",value:"10:30"},{label:"11:00 AM",value:"11:00"},{label:"11:30 AM",value:"11:30"},{label:"12:00 PM",value:"12:00"},{label:"12:30 PM",value:"12:30"},{label:"1:00 PM",value:"13:00"},{label:"1:30 PM",value:"13:30"},{label:"2:00 PM",value:"14:00"},{label:"2:30 PM",value:"14:30"},{label:"3:00 PM",value:"15:00"},{label:"3:30 PM",value:"15:30"},{label:"4:00 PM",value:"16:00"},{label:"4:30 PM",value:"16:30"},{label:"5:00 PM",value:"17:00"},{label:"5:30 PM",value:"17:30"},{label:"6:00 PM",value:"18:00"},{label:"6:30 PM",value:"18:30"},{label:"7:00 PM",value:"19:00"},{label:"7:30 PM",value:"19:30"},{label:"8:00 PM",value:"20:00"},{label:"8:30 PM",value:"20:30"},{label:"9:00 PM",value:"21:00"},{label:"9:30 PM",value:"21:30"},{label:"10:00 PM",value:"22:00"},{label:"10:30 PM",value:"22:30"},{label:"11:00 PM",value:"23:00"},{label:"11:30 PM",value:"23:30"}],Z=[{added:!1,Name:"Mon",value:1},{added:!1,Name:"Tue",value:2},{added:!1,Name:"Wed",value:3},{added:!1,Name:"Thu",value:4},{added:!1,Name:"Fri",value:5},{added:!1,Name:"Sat",value:6},{added:!1,Name:"Sun",value:7}],N=[{value:1,label:"Daily",interval:"day",interval_count:1},{value:2,label:"Weekly",interval:"day",interval_count:7},{value:3,label:"Monthly",interval:"month",interval_count:1},{value:4,label:"Every 3 Months",interval:"month",interval_count:3},{value:5,label:"Every 6 Months",interval:"month",interval_count:6},{value:6,label:"Yearly",interval:"year",interval_count:1}]},4238:function(e,n,a){a.d(n,{Ev:function(){return b},LR:function(){return v},aY:function(){return g},fG:function(){return m},gx:function(){return c},hB:function(){return o},l:function(){return f},mr:function(){return d},p7:function(){return u},pz:function(){return p},rS:function(){return r},tT:function(){return h},un:function(){return s}});var t=a(3433),l=a(858),i=a(3585);function r(e){return e?e.charAt(0).toUpperCase()+e.slice(1):"-"}function o(e){if(e){var n,a=e.split(" ");return a[0].charAt(0).toUpperCase()+(a.length>1?null===(n=a[1])||void 0===n?void 0:n.charAt(0).toUpperCase():"")}return"-"}function s(e){return e||!1}function u(e){if(e){var n=l.Z.find((function(n){return n.id===e}));return n?n.lable:"-"}}function d(e,n){if(e){var a=e.split(":");a=a[0]+":"+a[1];var t=i.V6.find((function(e){return e.value===a}));return t?n?t.value:t.label:"-"}return e}function c(e){if(e){var n=i.nD.find((function(n){return n.value===e}));return n?n.label:"-"}return"-"}function v(e){if(e){var n=i.qb.find((function(n){return n.value===e}));return n?n.label:"-"}return"-"}function m(e){if(e){var n=i.mm.find((function(n){return n.value===e}));return n?n.label:"-"}return"-"}function f(e,n){if(e){var a=new Date(e).getTime(),t=new Date(a),l=t.getFullYear(),i=t.getMonth()+1,r=t.getDate(),o=t.getHours(),s=t.getMinutes(),u=t.getSeconds();return r<10&&(r="0"+r),i<10&&(i="0"+i),o<10&&(o="0"+o),s<10&&(s="0"+s),u<10&&(u="0"+u),n?l+"-"+i+"-"+r:l+"-"+i+"-"+r+" "+o+":"+s+":"+u}}function p(e){return null===e||void 0===e?void 0:e.map((function(e){return{value:null===e||void 0===e?void 0:e.id,label:null===e||void 0===e?void 0:e.name}}))}function b(e){return(0,t.Z)(new Set(e.map((function(e){return e.recipe_side_combination_id}))))}function h(e){return(0,t.Z)(new Set(e.map((function(e){return e.recipe_side_item_id}))))}function g(e,n){return null===n||void 0===n?void 0:n.find((function(n){return n.content_type===e}))}},6504:function(e,n,a){a.d(n,{HU:function(){return d},IZ:function(){return o},KZ:function(){return s},Os:function(){return i},T_:function(){return r},h$:function(){return l},qZ:function(){return t},y9:function(){return u}});var t={name:"",plural_name:"",shopping_name:"",shopping_plural_name:"",search_term:"",esha_id:"",status:"",shopping_category:"",shopping_measurement_id:"",tier:"",shopping_sort_order:0,is_staple:0,category_ids:"",tag_names:"",ingredient_category_name:""},l={name:"",shopping_list_sub_header:"",wordpress_name:"",external_url:"",external_url_tooltip:"",order_with_peapod:"",week_menu_generation_day:1,week_menu_generation_time:"00:00",week_menu_publishing_day:1,week_menu_publishing_time:"00:00",sale_period_start:1,sale_period_end:1,order_with_peapod_demo_url:""},i={name:"",dish_type:1,number_of_sides:0,recipe_group_id:"",cooking_type:"",tag_names:"",number_of_servings:0,preparation_time:"0",cooking_time:"0",calories:"0",fats:"0",saturated_fats:"0",sodium:"0",carbs:"0",fiber:"0",protein:"0",status:0,is_tested:!1,is_ok_for_half:!1,alt_instructions:"",alt_half_instructions:"",half_instructions:"",instructions:"",do_ahead:"",corner_note:"",additional_note:""},r={measurmentId:"",amount:"0",preparation:"",is_optional:"0",is_round_up_for_half_family_size:"1"},o={title:"",content:"",user_group:"ALL",notification_repeat:0,notification_date:"",notification_time:""},s={name:"",recurring:4,amount:""},u={firstSide:"",secondSide:""},d={title:"",content:""}},1048:function(e,n,a){a.d(n,{b:function(){return l}});var t={image:["jpg","png","jpeg","svg","webp"],excel:["xls","xlsx"],pdf:["pdf"]},l=function(e,n){return e&&t[n].indexOf(e.split(".").pop())>-1}}}]);
//# sourceMappingURL=561.1eac4e08.chunk.js.map
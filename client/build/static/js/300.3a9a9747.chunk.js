"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[300],{9300:function(e,n,t){t.r(n),t.d(n,{default:function(){return E}});var i=t(4942),a=t(1413),l=t(4165),o=t(3433),s=t(5861),r=t(9439),d=t(2791),c=t(9743),u=t(2677),v=t(3360),m=t(2592),f=t(9935),p=t(3855),h=t(2506),b=t(8171),x=t(9177),g=t(8007),_=t(2148),Z=g.Ry().shape({title:g.Z_().required(_.Z.titleErrorMsg),content:g.Z_().required(_.Z.contentErrorMsg),notification_date:g.hT().required(_.Z.dateErrorMsg),notification_time:g.Z_().required(_.Z.timeErrorMsg)}),j=t(9689),N=t(7467),M=t(3585),y=t(9365),w=t(6504),S=t(1260),k=t(5073),C=t(2426),Y=t.n(C),A=t(184),P=function(e){var n=(0,d.useRef)(null),t=(0,d.useState)(!1),i=(0,r.Z)(t,2),c=i[0],u=i[1],m=(0,d.useState)(!1),g=(0,r.Z)(m,2),_=g[0],C=g[1],P=(0,d.useState)(!1),D=(0,r.Z)(P,2),T=D[0],B=D[1],E=(0,d.useState)(!1),H=(0,r.Z)(E,2),F=H[0],L=H[1],U=(0,d.useState)(M.M_),I=(0,r.Z)(U,2),W=I[0],K=I[1],R=(0,d.useState)([]),q=(0,r.Z)(R,2),G=q[0],V=q[1],O=(0,h.TA)({initialValues:w.IZ,validationSchema:Z,onSubmit:function(){var n=(0,s.Z)((0,l.Z)().mark((function n(){var t,i;return(0,l.Z)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return console.log(Q),t=(0,a.Z)((0,a.Z)({},Q),{},{notification_date:Y()(Q.notification_date,"YYYY-MM-DD").format("DD/MM/YYYY")}),null!==Q&&void 0!==Q&&Q.notification_repeat&&(t.notification_days_repeat=W.filter((function(e){return e.added})).map((function(e){return e.value}))),t.store_ids=G,console.log(t),n.next=7,(0,y.wN)(t);case 7:null!==(i=n.sent)&&void 0!==i&&i.status?(z(),B(null===i||void 0===i?void 0:i.message),setTimeout((function(){e.onHide(!0)}),2e3)):L(i.message);case 9:case"end":return n.stop()}}),n)})));return function(){return n.apply(this,arguments)}}()}),z=O.resetForm,$=O.handleSubmit,X=O.handleChange,J=O.handleBlur,Q=O.values,ee=O.setFieldValue,ne=O.touched,te=O.errors,ie=O.isSubmitting,ae=function(e){ee("user_group",e.target.value,!1)},le=function(e){console.log(e),e.target.checked?V((function(n){return[].concat((0,o.Z)(n),[e.target.value])})):V(G.filter((function(n){return n!==e.target.value})))};return(0,A.jsx)("div",{className:"feedback-wrapper",children:(0,A.jsx)(j.Z,(0,a.Z)((0,a.Z)({},e),{},{size:"md","aria-labelledby":"contained-modal-title-vcenter",className:"add-notification-modal",centered:!0,children:(0,A.jsxs)(A.Fragment,{children:[(0,A.jsx)(j.Z.Header,{className:"heading border-bottom-0 p-0 font-semi-bold-20 text-center",children:"Add New Notification"}),(0,A.jsxs)(j.Z.Body,{className:"change-password-body p-0 pt-2  text-center",children:[(0,A.jsxs)("form",{onSubmit:$,className:"w-100 p-2",children:[(0,A.jsxs)("div",{className:te.title&&ne.title?"emailredborder inputdiv":"inputdiv",children:[(0,A.jsx)("span",{className:"text-label",children:"Notification Title"}),(0,A.jsx)(x.Z,{label:"Title",name:"title",type:"text",onChange:X,onBlur:J,value:null===Q||void 0===Q?void 0:Q.title,className:"mt-2 form-control ".concat(ne&&ne[null===Q||void 0===Q?void 0:Q.title]&&te[null===Q||void 0===Q?void 0:Q.title]?"is-invalid":"")}),(0,A.jsx)(b.Z,{errormsg:null===te||void 0===te?void 0:te.title,touchedmsg:null===ne||void 0===ne?void 0:ne.title})]}),(0,A.jsxs)("div",{className:te.content&&ne.content?"emailredborder inputdiv":"inputdiv",children:[(0,A.jsx)("span",{className:"text-label",children:"Content"}),(0,A.jsx)("textarea",{placeholder:"Content",name:"content",rows:5,onChange:X,onBlur:J,value:null===Q||void 0===Q?void 0:Q.content,className:"mt-2 form-control ".concat(ne&&ne[null===Q||void 0===Q?void 0:Q.content]&&te[null===Q||void 0===Q?void 0:Q.content]?"is-invalid":"")}),(0,A.jsx)(b.Z,{errormsg:null===te||void 0===te?void 0:te.content,touchedmsg:null===ne||void 0===ne?void 0:ne.content})]}),(0,A.jsxs)("div",{className:te.user_group&&ne.user_group?"emailredborder inputdiv":"inputdiv",children:[(0,A.jsx)("span",{className:"text-label pt-3 mb-1",children:"User Group"}),(0,A.jsx)("div",{className:"role-dropdown",children:(0,A.jsxs)(f.Z,{show:c,onToggle:function(){return u(!c)},ref:n,children:[(0,A.jsx)(f.Z.Toggle,{className:"role-btn",children:"User Group"}),(0,A.jsxs)(f.Z.Menu,{style:{overflowY:"scroll",height:"300px"},className:"role-menu",children:[(0,A.jsx)(p.Z,{children:M.FW.map((function(e,n){return(0,A.jsx)(p.Z.Check,{className:"role-items",type:"radio",name:"user-type",id:null===e||void 0===e?void 0:e.value,value:null===e||void 0===e?void 0:e.value,onChange:ae,checked:(null===Q||void 0===Q?void 0:Q.user_group)===(null===e||void 0===e?void 0:e.value),label:null===e||void 0===e?void 0:e.label},n)}))}),(0,A.jsx)(f.Z.Header,{children:"Store(s)"}),(0,A.jsx)(p.Z,{children:e.store.map((function(e,n){return(0,A.jsx)(p.Z.Check,{className:"role-items",type:"checkbox",value:e.id,onChange:le,id:e.id,label:e.name},n)}))})]})]})}),(0,A.jsx)(b.Z,{errormsg:null===te||void 0===te?void 0:te.user_group,touchedmsg:null===ne||void 0===ne?void 0:ne.user_group})]}),(0,A.jsxs)("div",{className:"schedule pt-3",children:[(0,A.jsx)("span",{className:"heading",children:"Schedule"}),(0,A.jsxs)("div",{className:"repeat-wrapper mt-3 d-flex mb-3",children:[(0,A.jsxs)("div",{className:"repeat-cont d-flex ml-auto",children:[(0,A.jsx)("img",{src:null===N.Z||void 0===N.Z?void 0:N.Z.feedback,className:"repeat-icon",alt:"repeat-icon NP"}),(0,A.jsx)("span",{className:"repeast-txt",children:"Repeat"})]}),(0,A.jsx)(p.Z.Check,{type:"switch",className:"repeat-switch",id:"notification_repeat",name:"notification_repeat",checked:!(null===Q||void 0===Q||!Q.notification_repeat),onChange:function(e){Q.notification_repeat=e.target.checked?1:0,e.target.checked&&K(M.M_),C(!_)},onBlur:J})]}),(0,A.jsx)(A.Fragment,{children:_&&(0,A.jsx)("div",{className:"days-wrapper",children:null===W||void 0===W?void 0:W.map((function(e,n){return(0,A.jsx)("span",{className:"day-btn ".concat(e.added?"greenbg":""),onClick:function(){return function(e,n){var t=(0,o.Z)(W);t[n]=(0,a.Z)((0,a.Z)({},e),{},{added:!e.added}),K(t)}(e,n)},children:null===e||void 0===e?void 0:e.Name},n)}))})})]}),(0,A.jsxs)("div",{className:te.notification_date&&ne.notification_date?"emailredborder inputdiv pt-2":"inputdiv pt-2",children:[(0,A.jsx)("span",{className:"text-label",children:"Date"}),(0,A.jsx)("input",{type:"date",onChange:X,onBlur:J,name:"notification_date",value:null===Q||void 0===Q?void 0:Q.notification_date,className:"mt-2 form-control date-time-cont ".concat(ne&&ne[null===Q||void 0===Q?void 0:Q.notification_date]&&te[null===Q||void 0===Q?void 0:Q.notification_date]?"is-invalid":"")}),(0,A.jsx)(b.Z,{errormsg:null===te||void 0===te?void 0:te.notification_date,touchedmsg:null===ne||void 0===ne?void 0:ne.notification_date})]}),(0,A.jsxs)("div",{className:te.notification_time&&ne.notification_time?"emailredborder inputdiv pt-2":"inputdiv pt-2",children:[(0,A.jsx)("span",{className:"text-label",children:"Time"}),(0,A.jsx)("input",{type:"time",onChange:X,onBlur:J,name:"notification_time",value:null===Q||void 0===Q?void 0:Q.notification_time,className:"mt-2 form-control date-time-cont ".concat(ne&&ne[null===Q||void 0===Q?void 0:Q.notification_time]&&te[null===Q||void 0===Q?void 0:Q.notification_time]?"is-invalid":"")}),(0,A.jsx)(b.Z,{errormsg:null===te||void 0===te?void 0:te.notification_time,touchedmsg:null===ne||void 0===ne?void 0:ne.notification_time})]}),(0,A.jsxs)("div",{className:"edit-btns pt-4",children:[(0,A.jsx)(v.Z,{variant:"",className:"w-50 rounded-pill cancel-btn",type:"button",onClick:function(){z(),null===e||void 0===e||e.onHide()},disabled:ie,children:"Cancel"}),(0,A.jsx)(v.Z,{variant:"",className:"w-50 rounded-pill save-btn",type:"submit",disabled:ie,children:"Save"})]})]}),F&&(0,A.jsx)(S.Z,{errormsg:F}),T&&(0,A.jsx)(k.Z,{successmsg:T})]})]})}))})},D=t(304),T=function(e){var n=(0,d.useState)(!1),t=(0,r.Z)(n,2),i=t[0],o=t[1],c=(0,d.useState)(!1),u=(0,r.Z)(c,2),m=u[0],f=u[1],p=(0,d.useState)(!1),h=(0,r.Z)(p,2),b=h[0],x=h[1],g=(0,d.useState)(""),_=(0,r.Z)(g,2),Z=_[0],N=_[1],M=function(){var n=(0,s.Z)((0,l.Z)().mark((function n(){var t;return(0,l.Z)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return f(!0),n.next=3,(0,y.no)(null===e||void 0===e?void 0:e.deleteid);case 3:null!==(t=n.sent)&&void 0!==t&&t.status?(o(!0),N(null===t||void 0===t?void 0:t.message),setTimeout((function(){null===e||void 0===e||e.onHide(null===e||void 0===e?void 0:e.deleteid)}),2e3)):(o(!1),N(!1),x(null===t||void 0===t?void 0:t.message)),f(!1);case 6:case"end":return n.stop()}}),n)})));return function(){return n.apply(this,arguments)}}();return(0,A.jsx)("div",{className:"delete-user-wrapper",children:(0,A.jsx)(A.Fragment,{children:(0,A.jsx)(j.Z,(0,a.Z)((0,a.Z)({},e),{},{size:"md","aria-labelledby":"contained-modal-title-vcenter",className:"delete-notification-modal",centered:!0,children:(0,A.jsxs)(A.Fragment,{children:[(0,A.jsx)(j.Z.Header,{className:"heading text-center",children:"Delete Notification"}),(0,A.jsxs)(j.Z.Body,{className:"provide-feedback-body text-center",children:[(0,A.jsx)("div",{className:"delete-acc-subheading font-medium-16",children:"Are you sure you want to delete Notification?"}),m&&(0,A.jsx)(D.Z,{loadingMsg:"deleting.."}),(0,A.jsxs)("div",{className:"delete-btn-wrapper",children:[(0,A.jsx)(v.Z,{className:"cancel-btn w-25",variant:"outline-primary rounded-pill",onClick:function(){return null===e||void 0===e?void 0:e.onHide()},disabled:m,children:"Cancel"}),(0,A.jsx)(v.Z,{className:"save-btn w-25",variant:"primary rounded-pill",onClick:function(){return M()},disabled:m,children:"Delete"})]}),(0,A.jsxs)(A.Fragment,{children:[b&&(0,A.jsx)(S.Z,{errormsg:b}),i&&(0,A.jsx)(k.Z,{successmsg:Z})]})]})]})}))})})},B=t(9286),E=function(){var e=(0,d.useState)(!1),n=(0,r.Z)(e,2),t=n[0],g=n[1],_=(0,d.useState)(!1),Z=(0,r.Z)(_,2),j=Z[0],C=Z[1],E=(0,d.useState)({}),H=(0,r.Z)(E,2),F=H[0],L=H[1],U=(0,d.useState)(null),I=(0,r.Z)(U,2),W=I[0],K=I[1],R=(0,d.useState)(!1),q=(0,r.Z)(R,2),G=q[0],V=q[1],O=(0,d.useState)(!1),z=(0,r.Z)(O,2),$=z[0],X=z[1],J=(0,d.useState)(M.M_),Q=(0,r.Z)(J,2),ee=Q[0],ne=Q[1],te=(0,d.useState)(!1),ie=(0,r.Z)(te,2),ae=ie[0],le=ie[1],oe=(0,d.useState)(!1),se=(0,r.Z)(oe,2),re=se[0],de=se[1],ce=(0,d.useState)([]),ue=(0,r.Z)(ce,2),ve=ue[0],me=ue[1],fe=(0,d.useState)([]),pe=(0,r.Z)(fe,2),he=pe[0],be=pe[1],xe=(0,d.useState)(w.IZ),ge=(0,r.Z)(xe,2),_e=ge[0],Ze=ge[1],je=(0,d.useState)(!0),Ne=(0,r.Z)(je,2),Me=Ne[0],ye=Ne[1],we=(0,d.useState)(null),Se=(0,r.Z)(we,2),ke=Se[0],Ce=Se[1],Ye=(0,d.useState)(""),Ae=(0,r.Z)(Ye,2),Pe=Ae[0],De=Ae[1],Te=(0,d.useState)(!1),Be=(0,r.Z)(Te,2),Ee=Be[0],He=Be[1],Fe=(0,d.useState)([]),Le=(0,r.Z)(Fe,2),Ue=Le[0],Ie=Le[1],We=(0,d.useRef)(null),Ke=(0,d.useRef)(null),Re=(0,d.useState)([]),qe=(0,r.Z)(Re,2),Ge=qe[0],Ve=qe[1];function Oe(){return ze.apply(this,arguments)}function ze(){return(ze=(0,s.Z)((0,l.Z)().mark((function e(){var n;return(0,l.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,y.TH)();case 2:null!==(n=e.sent)&&void 0!==n&&n.status?(console.log(null===n||void 0===n?void 0:n.data.length),me(null===n||void 0===n?void 0:n.data),be(null===n||void 0===n?void 0:n.data)):He(null===n||void 0===n?void 0:n.message),le(!1);case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}(0,d.useEffect)((function(){le(!0),Oe(),$e()}),[]);var $e=function(){var e=(0,s.Z)((0,l.Z)().mark((function e(){return(0,l.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:(0,y.WY)(B.Z.store,"GET",void 0,!0,{notification:!0}).then((function(e){Ie((0,o.Z)(e.data))}));case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();(0,d.useEffect)((function(){if(W){var e,n=ve.find((function(e){return e.id===W}));if(n&&null===ke)X(!(null===n||void 0===n||!n.notification_repeat)),(null===n||void 0===n?void 0:n.notification_repeat)&&function(e){var n=e.split(","),t=ee.map((function(e){return(0,a.Z)((0,a.Z)({},e),{},{added:n.includes("".concat(e.value))})}));ne(t)}(null===n||void 0===n?void 0:n.notification_days_repeat),Ze((0,a.Z)((0,a.Z)({},n),{},{title:null===n||void 0===n?void 0:n.name,content:null===n||void 0===n||null===(e=n.contents)||void 0===e?void 0:e.en,notification_time:null===n||void 0===n?void 0:n.delivery_time_of_day}))}}),[W,ve]);var Xe=(0,h.TA)({initialValues:w.IZ,onSubmit:function(){var e=(0,s.Z)((0,l.Z)().mark((function e(){var n,t;return(0,l.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return le(!0),console.log("KKKKKKKK",tn),n=(0,a.Z)((0,a.Z)({},tn),{},{notification_date:Y()(tn.notification_date,"YYYY-MM-DD").format("DD/MM/YYYY")}),null!==tn&&void 0!==tn&&tn.notification_repeat&&(n.notification_days_repeat=ee.filter((function(e){return e.added})).map((function(e){return e.value}))),n.store_ids=Ge,console.log("1111",n),e.next=8,(0,y.wD)(n,W);case 8:null!==(t=e.sent)&&void 0!==t&&t.status?(Oe(),de(null===t||void 0===t?void 0:t.message),un()):He(t.message),setTimeout((function(){de(null),He(null),le(!1)}),2e3);case 11:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()}),Je=Xe.resetForm,Qe=Xe.handleSubmit,en=Xe.handleChange,nn=Xe.handleBlur,tn=Xe.values,an=Xe.setFieldValue,ln=Xe.touched,on=Xe.errors,sn=Xe.isSubmitting;(0,d.useEffect)((function(){if(null!==_e&&void 0!==_e&&_e.id){var e=Object.keys(_e);console.log("fields",_e),e.forEach((function(e){}))}}),[_e]);(0,d.useEffect)((function(){function e(e){We.current&&!We.current.contains(e.target)&&g(!1)}return document.addEventListener("mousedown",e),function(){document.removeEventListener("mousedown",e)}}),[We]),(0,d.useEffect)((function(){function e(e){Ke.current&&!Ke.current.contains(e.target)&&C(!1)}return document.addEventListener("mousedown",e),function(){document.removeEventListener("mousedown",e)}}),[Ke]);var rn=function(e){e.target.checked?Ve((function(n){return[].concat((0,o.Z)(n),[e.target.value])})):Ve(Ge.filter((function(n){return n!==e.target.value})))},dn=function(e){an("user_group",e.target.value,!1)};var cn=function(e){e&&Oe(),ye(!1),Ce(null),un()},un=function(){Je(),X(!1),ne(M.M_),K(null),L({}),V(!1)};return(0,A.jsxs)("div",{className:"notifications-users",children:[(0,A.jsx)(c.Z,{className:"first-row",children:(0,A.jsxs)(u.Z,{className:"d-flex user-heading-col",md:4,children:[(0,A.jsxs)("div",{className:"users-heading",children:[(0,A.jsx)("img",{src:null===N.Z||void 0===N.Z?void 0:N.Z.notificationsicon,className:"internal-user-img",alt:"internal-user-img Np"}),(0,A.jsx)("span",{className:"heading-txt",children:"Notifications"})]}),(0,A.jsx)("div",{className:"add-user",children:(0,A.jsxs)(v.Z,{variant:"primary",className:"add-user-btn",onClick:function(){return V(!0)},children:[(0,A.jsx)(m.Z,{src:null===N.Z||void 0===N.Z?void 0:N.Z.addusericon,alt:"Button image",width:"30",height:"30",className:"d-inline-block align-top"}),"Add New"]})})]})}),(0,A.jsxs)(c.Z,{className:"second-row",children:[(0,A.jsxs)(u.Z,{className:"second-row-first-col border-right",md:4,children:[(0,A.jsxs)("div",{className:"second-row-first-col-div",children:[(0,A.jsx)("div",{className:"role-dropdown",ref:We,children:(0,A.jsxs)(f.Z,{show:t,onToggle:function(){return g(!t)},children:[(0,A.jsx)(f.Z.Toggle,{className:"role-btn",children:"User Group"}),(0,A.jsxs)(f.Z.Menu,{className:"role-menu",children:[(0,A.jsx)(p.Z,{children:M.FW.map((function(e,n){return(0,A.jsx)(p.Z.Check,{className:"role-items",type:"radio",name:"user-type",id:e.label,label:e.label},n)}))}),(0,A.jsx)(f.Z.Header,{children:"Store(s)"}),(0,A.jsx)(p.Z,{children:["Store Name 1","Store Name 2","Store Name 3","Store Name 4","Store Name 5"].map((function(e){return(0,A.jsx)(p.Z.Check,{className:"role-items",type:"checkbox",id:e,label:e},e)}))})]})]})}),(0,A.jsx)("div",{className:"search-bar-div",children:(0,A.jsx)("div",{className:"input-group search-bar",children:(0,A.jsx)("input",{type:"text",className:"form-control",placeholder:"Search notification",value:Pe,onChange:function(e){var n=e.target.value;if(""!==n){var t=he.filter((function(e){return e.name.toLowerCase().startsWith(n.toLowerCase())}));me(t)}else me(he);De(n)}})})}),(0,A.jsx)("div",{className:"filter",children:(0,A.jsx)("img",{src:null===N.Z||void 0===N.Z?void 0:N.Z.filtericon,className:"sorting-img",alt:"sorting Img Np"})})]}),ae&&(0,A.jsx)(D.Z,{loadingMsg:"loading.."}),(0,A.jsx)("div",{className:"user-data-card",children:null===ve||void 0===ve?void 0:ve.map((function(e,n){return(0,A.jsx)("div",{className:"".concat(!0===F[null===e||void 0===e?void 0:e.id]?"user-card greenbg":"user-card"),onClick:function(){return function(e){if(console.log(e),e===W)K(null),Ze(w.IZ),L({});else{K(e);var n=ve.find((function(n){return n.id==e}));console.log(n);var t=Y()(null===n||void 0===n?void 0:n.notification_date,"DD/MM/YYYY").format("YYYY-MM-DD");an("notification_date",t,!1),an("notification_time",n.notification_time),an("title",n.title),an("content",n.content),an("notification_repeat",n.notification_repeat),Ve(n.store_ids.split(",")),console.log(Ge),L((0,i.Z)({},e,!0))}}(null===e||void 0===e?void 0:e.id)},children:(0,A.jsxs)("div",{className:"user-name",children:[(0,A.jsxs)("div",{className:"user-card-first-row",children:[(0,A.jsxs)("div",{className:"child-div",children:[(0,A.jsx)("span",{className:"notification-name",children:e.title}),(0,A.jsx)("span",{className:"notification-date",children:Y()("".concat(e.notification_date," ").concat(e.notification_time),"DD/MM/YYYY HH:mm").format("DD MMM YYYY, hh:mm A")})]}),(0,A.jsx)("div",{className:"user-delete",children:(0,A.jsx)("img",{src:null===N.Z||void 0===N.Z?void 0:N.Z.deleteuser,className:"delete-user-img",alt:"delete user img NP",onClick:function(){return n=e.id,ye(!0),Ce(n),void un();var n}})})]}),(0,A.jsx)("div",{className:"lower-child-div",children:e.content})]})},n)}))})]}),(0,A.jsx)(u.Z,{className:"second-row-second-col",md:4,children:(0,A.jsxs)("div",{className:"second-row-second-col-div",children:[(0,A.jsx)("div",{className:"edit-card-heading",children:"Details"}),(0,A.jsxs)("form",{onSubmit:Qe,className:"w-75",children:[(0,A.jsxs)("div",{className:on.title&&ln.title?"emailredborder inputdiv":"inputdiv",children:[(0,A.jsx)("span",{className:"text-label",children:"Notification Title"}),(0,A.jsx)(x.Z,{label:"Title",name:"title",type:"text",onChange:en,onBlur:nn,value:null===tn||void 0===tn?void 0:tn.title,className:"mt-2 form-control ".concat(ln&&ln[null===tn||void 0===tn?void 0:tn.title]&&on[null===tn||void 0===tn?void 0:tn.title]?"is-invalid":"")}),(0,A.jsx)(b.Z,{errormsg:null===on||void 0===on?void 0:on.title,touchedmsg:null===ln||void 0===ln?void 0:ln.title})]}),(0,A.jsxs)("div",{className:on.content&&ln.content?"emailredborder inputdiv":"inputdiv",children:[(0,A.jsx)("span",{className:"text-label",children:"Content"}),(0,A.jsx)("textarea",{placeholder:"Content",name:"content",rows:5,onChange:en,onBlur:nn,value:null===tn||void 0===tn?void 0:tn.content,className:"mt-2 form-control ".concat(ln&&ln[null===tn||void 0===tn?void 0:tn.content]&&on[null===tn||void 0===tn?void 0:tn.content]?"is-invalid":"")}),(0,A.jsx)(b.Z,{errormsg:null===on||void 0===on?void 0:on.content,touchedmsg:null===ln||void 0===ln?void 0:ln.content})]}),(0,A.jsxs)("div",{className:on.user_group&&ln.user_group?"emailredborder inputdiv":"inputdiv",children:[(0,A.jsx)("span",{className:"text-label pt-3 mb-1",children:"User Group"}),(0,A.jsx)("div",{className:"role-dropdown",children:(0,A.jsxs)(f.Z,{show:j,onToggle:function(){return C(!j)},ref:Ke,children:[(0,A.jsx)(f.Z.Toggle,{className:"role-btn",children:"User Group"}),(0,A.jsxs)(f.Z.Menu,{style:{overflowY:"scroll",height:"300px"},className:"role-menu",children:[(0,A.jsx)(p.Z,{children:M.FW.map((function(e,n){return(0,A.jsx)(p.Z.Check,{className:"role-items",type:"radio",name:"user-type",id:null===e||void 0===e?void 0:e.value,value:null===e||void 0===e?void 0:e.value,onChange:dn,checked:(null===tn||void 0===tn?void 0:tn.user_group)===(null===e||void 0===e?void 0:e.value),label:null===e||void 0===e?void 0:e.label},n)}))}),(0,A.jsx)(f.Z.Header,{children:"Store(s)"}),(0,A.jsx)(p.Z,{children:Ue.map((function(e,n){return(0,A.jsx)(p.Z.Check,{className:"role-items",type:"checkbox",checked:Ge.includes(e.id.toString()),value:e.id,defaultChecked:!0,onChange:rn,id:e.id,label:e.name},n)}))})]})]})})]}),(0,A.jsxs)("div",{className:"schedule pt-3",children:[(0,A.jsx)("span",{className:"heading",children:"Schedule"}),(0,A.jsxs)("div",{className:"repeat-wrapper mt-3 d-flex mb-3",children:[(0,A.jsxs)("div",{className:"repeat-cont d-flex ml-auto",children:[(0,A.jsx)("img",{src:null===N.Z||void 0===N.Z?void 0:N.Z.feedback,className:"repeat-icon",alt:"repeat-icon NP"}),(0,A.jsx)("span",{className:"repeast-txt",children:"Repeat"})]}),(0,A.jsx)(p.Z.Check,{type:"switch",className:"repeat-switch",id:"notification_repeat",name:"notification_repeat",checked:!(null===tn||void 0===tn||!tn.notification_repeat),onChange:function(e){tn.notification_repeat=e.target.checked?1:0,ne(M.M_),X(!$)},onBlur:nn})]}),(0,A.jsx)(A.Fragment,{children:$&&(0,A.jsx)("div",{className:"days-wrapper",children:null===ee||void 0===ee?void 0:ee.map((function(e,n){return(0,A.jsx)("span",{className:"day-btn ".concat(e.added?"greenbg":""),onClick:function(){return function(e,n){var t=(0,o.Z)(ee);t[n]=(0,a.Z)((0,a.Z)({},e),{},{added:!e.added}),ne(t)}(e,n)},children:null===e||void 0===e?void 0:e.Name},n)}))})})]}),(0,A.jsxs)("div",{className:on.notification_date&&ln.notification_date?"emailredborder inputdiv pt-2":"inputdiv pt-2",children:[(0,A.jsx)("span",{className:"text-label",children:"Date"}),(0,A.jsx)("input",{type:"date",onChange:en,onBlur:nn,name:"notification_date",value:null===tn||void 0===tn?void 0:tn.notification_date,className:"mt-2 form-control date-time-cont ".concat(ln&&ln[null===tn||void 0===tn?void 0:tn.notification_date]&&on[null===tn||void 0===tn?void 0:tn.notification_date]?"is-invalid":"")}),(0,A.jsx)(b.Z,{errormsg:null===on||void 0===on?void 0:on.notification_date,touchedmsg:null===ln||void 0===ln?void 0:ln.notification_date})]}),(0,A.jsxs)("div",{className:on.notification_time&&ln.notification_time?"emailredborder inputdiv pt-2":"inputdiv pt-2",children:[(0,A.jsx)("span",{className:"text-label",children:"Time"}),(0,A.jsx)("input",{type:"time",onChange:en,onBlur:nn,name:"notification_time",value:null===tn||void 0===tn?void 0:tn.notification_time,className:"mt-2 form-control date-time-cont ".concat(ln&&ln[null===tn||void 0===tn?void 0:tn.notification_time]&&on[null===tn||void 0===tn?void 0:tn.notification_time]?"is-invalid":"")}),(0,A.jsx)(b.Z,{errormsg:null===on||void 0===on?void 0:on.notification_time,touchedmsg:null===ln||void 0===ln?void 0:ln.notification_time})]}),sn&&(0,A.jsx)(D.Z,{loadingMsg:"Updating.."}),(0,A.jsxs)("div",{className:"edit-btns pt-4",children:[(0,A.jsx)(v.Z,{variant:"",className:"w-50 rounded-pill cancel-btn",type:"button",onClick:un,disabled:!!sn,children:"Cancel"}),(0,A.jsx)(v.Z,{variant:"",className:"w-50 rounded-pill save-btn",type:"submit",disabled:!!sn,children:"Update"})]}),Ee&&(0,A.jsx)(S.Z,{errormsg:Ee}),re&&(0,A.jsx)(k.Z,{successmsg:re})]})]})})]}),G&&(0,A.jsx)(P,{store:Ue,show:G,onHide:cn}),Me&&ke&&(0,A.jsx)(T,{show:Me,onHide:cn,deleteid:ke})]})}},3585:function(e,n,t){t.d(n,{CN:function(){return Z},DB:function(){return m},FW:function(){return v},Hm:function(){return p},I$:function(){return u},L0:function(){return c},Ly:function(){return a},M_:function(){return _},V6:function(){return g},Xe:function(){return o},Y9:function(){return s},a7:function(){return r},fH:function(){return d},mm:function(){return x},nD:function(){return b},qb:function(){return f},sO:function(){return i},vm:function(){return h},w_:function(){return l}});var i="Yes",a="No",l="Pending",o="Published",s="Member News",r="Testimonials",d="Weekly Tips",c="Bonus Content",u=[{value:1,label:"1"},{value:2,label:"2"},{value:3,label:"3"},{value:4,label:"4"}],v=[{value:"ALL",label:"All"},{value:"SUBSCRIBED",label:"Subscribed"},{value:"UNSUBCRIBED",label:"Unsubscribed"}],m=[{value:0,label:"0"},{value:1,label:"1"},{value:2,label:"2"}],f=[{value:0,label:"Draft"},{value:1,label:"Pending"},{value:2,label:"Published"}],p=[{value:"",label:""},{value:1,label:"Skillet/stovetop"},{value:2,label:"Slow cooker"},{value:3,label:"Broil/grill"},{value:4,label:"Baked"},{value:5,label:"Soup"},{value:7,label:"Stew"},{value:6,label:"Other"}],h=[{value:1,label:"Ascending"},{value:2,label:"Descending"}],b=[{value:1,label:"Main"},{value:2,label:"Side"},{value:3,label:"Dessert"}],x=[{value:1,label:"Monday"},{value:2,label:"Tuesday"},{value:3,label:"Wednesday"},{value:4,label:"Thursday"},{value:5,label:"Friday"},{value:6,label:"Saturday"},{value:7,label:"Sunday"}],g=[{label:"12:00 AM",value:"00:00"},{label:"12:30 AM",value:"00:30"},{label:"1:00 AM",value:"01:00"},{label:"1:30 AM",value:"01:30"},{label:"2:00 AM",value:"02:00"},{label:"2:30 AM",value:"02:30"},{label:"3:00 AM",value:"03:00"},{label:"3:30 AM",value:"03:30"},{label:"4:00 AM",value:"04:00"},{label:"4:30 AM",value:"04:30"},{label:"5:00 AM",value:"05:00"},{label:"5:30 AM",value:"05:30"},{label:"6:00 AM",value:"06:00"},{label:"6:30 AM",value:"06:30"},{label:"7:00 AM",value:"07:00"},{label:"7:30 AM",value:"07:30"},{label:"8:00 AM",value:"08:00"},{label:"8:30 AM",value:"08:30"},{label:"9:00 AM",value:"09:00"},{label:"9:30 AM",value:"09:30"},{label:"10:00 AM",value:"10:00"},{label:"10:30 AM",value:"10:30"},{label:"11:00 AM",value:"11:00"},{label:"11:30 AM",value:"11:30"},{label:"12:00 PM",value:"12:00"},{label:"12:30 PM",value:"12:30"},{label:"1:00 PM",value:"13:00"},{label:"1:30 PM",value:"13:30"},{label:"2:00 PM",value:"14:00"},{label:"2:30 PM",value:"14:30"},{label:"3:00 PM",value:"15:00"},{label:"3:30 PM",value:"15:30"},{label:"4:00 PM",value:"16:00"},{label:"4:30 PM",value:"16:30"},{label:"5:00 PM",value:"17:00"},{label:"5:30 PM",value:"17:30"},{label:"6:00 PM",value:"18:00"},{label:"6:30 PM",value:"18:30"},{label:"7:00 PM",value:"19:00"},{label:"7:30 PM",value:"19:30"},{label:"8:00 PM",value:"20:00"},{label:"8:30 PM",value:"20:30"},{label:"9:00 PM",value:"21:00"},{label:"9:30 PM",value:"21:30"},{label:"10:00 PM",value:"22:00"},{label:"10:30 PM",value:"22:30"},{label:"11:00 PM",value:"23:00"},{label:"11:30 PM",value:"23:30"}],_=[{added:!1,Name:"Mon",value:1},{added:!1,Name:"Tue",value:2},{added:!1,Name:"Wed",value:3},{added:!1,Name:"Thu",value:4},{added:!1,Name:"Fri",value:5},{added:!1,Name:"Sat",value:6},{added:!1,Name:"Sun",value:7}],Z=[{value:1,label:"Daily",interval:"day",interval_count:1},{value:2,label:"Weekly",interval:"day",interval_count:7},{value:3,label:"Monthly",interval:"month",interval_count:1},{value:4,label:"Every 3 Months",interval:"month",interval_count:3},{value:5,label:"Every 6 Months",interval:"month",interval_count:6},{value:6,label:"Yearly",interval:"year",interval_count:1}]},6504:function(e,n,t){t.d(n,{HU:function(){return c},IZ:function(){return s},KZ:function(){return r},Os:function(){return l},T_:function(){return o},h$:function(){return a},qZ:function(){return i},y9:function(){return d}});var i={name:"",plural_name:"",shopping_name:"",shopping_plural_name:"",search_term:"",esha_id:"",status:"",shopping_category:"",shopping_measurement_id:"",tier:"",shopping_sort_order:0,is_staple:0,category_ids:"",tag_names:"",ingredient_category_name:""},a={name:"",shopping_list_sub_header:"",wordpress_name:"",external_url:"",external_url_tooltip:"",order_with_peapod:"",week_menu_generation_day:1,week_menu_generation_time:"00:00",week_menu_publishing_day:1,week_menu_publishing_time:"00:00",sale_period_start:1,sale_period_end:1,order_with_peapod_demo_url:""},l={name:"",dish_type:1,number_of_sides:0,recipe_group_id:"",cooking_type:"",tag_names:"",number_of_servings:0,preparation_time:"0",cooking_time:"0",calories:"0",fats:"0",saturated_fats:"0",sodium:"0",carbs:"0",fiber:"0",protein:"0",status:0,is_tested:!1,is_ok_for_half:!1,alt_instructions:"",alt_half_instructions:"",half_instructions:"",instructions:"",do_ahead:"",corner_note:"",additional_note:""},o={measurmentId:"",amount:"0",preparation:"",is_optional:"0",is_round_up_for_half_family_size:"1"},s={title:"",content:"",user_group:"ALL",notification_repeat:0,notification_date:"",notification_time:""},r={name:"",recurring:4,amount:""},d={firstSide:"",secondSide:""},c={title:"",content:""}}}]);
//# sourceMappingURL=300.3a9a9747.chunk.js.map
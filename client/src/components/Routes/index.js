import React, { lazy, Suspense } from "react";
import {Route, Routes } from "react-router-dom";
import Loader from "../../customComponents/Spinner"
const SubscribedUsers  = lazy(()=>import('../SubscribedUsers'));
const Notifications  = lazy(()=>import('../Notifications'));
const Admindashboard = lazy(()=>import('../AdminDashboard'));
const InternalUsers = lazy(()=>import('../InternalUsers'))
const Subscription = lazy(()=>import('../Subscription'))
const Database     = lazy(()=>import("../Database"))
const UploadContent = lazy(()=>import("../UploadContent"))

const AppRoutes = ()=> {
  return (
    <Suspense fallback={<Loader loadingMsg="Loading..."/>}>
    <Routes>
      <Route  exact path="/dashboard" element={<Admindashboard />}></Route>
      <Route exact path="/internal-users" element={<InternalUsers />}></Route>
      <Route exact path="/database" element={<Database />}></Route> 
      <Route exact path="/notifications" element={<Notifications />}></Route>
      {/* <Route exact path="/subscribedusers" element={ <SubscribedUsers />}></Route> */}
      <Route exact path="/subscription" element={<Subscription />}></Route>
      <Route exact path="/uploadcontent" element={<UploadContent />}></Route>
      </Routes>
    </Suspense>
  );
}
export default AppRoutes;

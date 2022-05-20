import './assets/styles/App.css';
import React, { useEffect, useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import axios from 'axios';

import Auth from './layouts/Auth.js';
import User from './layouts/User';
import Store from './layouts/Store';
import Admin from './layouts/Admin';
import MyProfile from './layouts/MyProfile';
import StoreProfile from './layouts/StoreProfile';
import Home from './components/Home.js';
import About from './views/about';
import Notfound from './components/Notfound.js';

function App() {

  var userRole;
  const user = JSON.parse(localStorage.getItem("userData"));
  if(user === null){
    userRole = "guest";
  }else{
    userRole = user.role;
  }

  const [role, setRole] = useState(userRole);


  useEffect(() => {
    var user = JSON.parse(localStorage.getItem("userData"));
    if(user === null){
      setRole("guest");
    }else{
      var hostname = "http://192.168.0.227:9000";
      axios.get(`${hostname}/api/users/userrole/${user.id}`).then((res) => {
        setRole(res.data);
      })
    }
  },[]);

  if(role === "guest"){
    return(
      <Switch>
        <Route path="/auth"> <Auth /> </Route>
        {/* <Route path="/user"> <Redirect to="/auth" /> </Route> */}

        <Route path="/about"> <About role={role}/> </Route>
        <Route exact path="/"> <Home role={role}/> </Route>

        <Route><Notfound /></Route>
      </Switch>
    )
  }

  else if(role === "regular"){
    return(
      <Switch>
        <Route path="/auth"> <Redirect to="/user" /> </Route>
        <Route path="/user/myprofile"> <MyProfile userId={user.id} role={user.role} /> </Route>
        <Route path="/user"> <User role={role}/> </Route>

        <Route path="/about"> <About role={role}/> </Route>
        <Route exact path="/"> <Home role={role}/> </Route>

        <Route><Notfound /></Route>
      </Switch>
    )
  }

  else if(role === "store"){
    return(
      <Switch>
        <Route path="/auth"> <Redirect to="/store" /> </Route>
        <Route path="/store/myprofile"> <StoreProfile userId={user.id} role={user.role} /> </Route>
        <Route path="/store"> <Store role={role}/> </Route>

        <Route path="/about"> <About role={role}/> </Route>
        <Route exact path="/"> <Home role={role}/> </Route>

        <Route><Notfound /></Route>
      </Switch>
    )
  }

  else if(role === "admin"){
    return(
      <Switch>
        <Route path="/auth"> <Redirect to="/admin" /> </Route>
        <Route path="/admin"> <Admin role={role}/> </Route>

        <Route path="/about"> <About role={role}/> </Route>
        <Route exact path="/"> <Home role={role}/> </Route>

        <Route><Notfound /></Route>
      </Switch>
    )
  }
}

export default App;
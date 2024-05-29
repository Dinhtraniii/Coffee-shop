import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import RouterService from "../routers/RouterService";
import Transaction from "./Transaction";
import Setting from "./Setting";
import Customers from "./Customers";
import Appointments from "./Appointments";
import Profile from "./Profile";
import { Image } from "react-native";
import RouterProduct from "../routers/RouterProduct";
import ProductUpdate from "./ProductUpdate";
import AddNewProduct from "./AddNewProduct";
import Carts from "./Carts";

import ProductDetail from "./ProductDetail";
const Tab = createMaterialBottomTabNavigator();

const Admin = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="RouterProduct"
        component={RouterProduct}
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../assets/home.png")}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="RouterService"
        component={RouterService}
        options={{
          title: "Booking",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../assets/booking.png")}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Appointments"
        component={Appointments}
        options={{
          title: "Appointment",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../assets/appointment.png")}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={Carts}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../assets/cart.png")}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
      
      <Tab.Screen
        name="Customer"
        component={Customers}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../assets/customer.png")}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Admin;

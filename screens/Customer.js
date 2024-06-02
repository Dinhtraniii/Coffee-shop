import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import RouterPlaceCustomer from "../routers/RouterPlaceCustomer";
import Setting from "./Setting";
import Appointments from "./Appointments";
import ProfileCustomer from "./ProfileCustomer";
import { Image } from "react-native";
import RouterProductCustomer from "../routers/routerProductCustomer";
import CartsCustomer from "./CartsCustomer";
import AppoinmentCustomer from "./AppoinmentCustomer";
const Tab = createMaterialBottomTabNavigator();
import Carts from "./Carts";

const Customer = () => {
  return (
    <Tab.Navigator
    activeColor="#e91e63">
       <Tab.Screen
        name="RouterProductCustomer"
        component={RouterProductCustomer}
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
        name="RouterPlaceCustomer"
        component={RouterPlaceCustomer}
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
        component={AppoinmentCustomer}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../assets/appointment.png")}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="CartsCustomer"
        component={CartsCustomer}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../assets/cart.png")}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
      
    </Tab.Navigator>
  );
};

export default Customer;

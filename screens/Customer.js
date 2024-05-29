import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import RouterServiceCustomer from "../routers/RouterServiceCustomer";
import Setting from "./Setting";
import Appointments from "./Appointments";
import ProfileCustomer from "./ProfileCustomer";
import { Image } from "react-native";
import RouterProductCustomer from "../routers/routerProductCustomer";
import Carts from "./Carts";
const Tab = createMaterialBottomTabNavigator();

const Customer = () => {
  return (
    <Tab.Navigator>
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
        name="RouterServiceCustomer"
        component={RouterServiceCustomer}
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
      
    </Tab.Navigator>
  );
};

export default Customer;

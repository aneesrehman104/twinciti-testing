"use client";
import { Provider } from "react-redux";
import { store } from "@/states/store";
import MainLayout from "./components/layoutComponents/mainLayout/mainLayout";
export default function Home() {
  return (
    <Provider store={store}>
      <MainLayout/>
    </Provider>
  );
}

"use client";
import { Provider } from "react-redux";
import MainLayout from "./components/layoutComponents/mainLayout/mainLayout";
export default function Home() {
  return (
    // <Provider store={true}>
      <MainLayout/>
    // </Provider>
  );
}

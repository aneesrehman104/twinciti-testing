"use client";
import React from "react";
import { Layout, Flex } from "antd";
const { Header, Footer, Sider, Content } = Layout;
import NavbarLayout from "../navbarLayout/navbarLayout";
const headerStyle = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  paddingInline: 48,
  lineHeight: "64px",
  backgroundColor: "#4096ff",
};
const contentStyle = {
  textAlign: "center",
  minHeight: 120,
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#0958d9",
};
const siderStyle = {
  textAlign: "center",
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#1677ff",
};
const footerStyle = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#4096ff",
};
const layoutStyle = {
  borderRadius: 8,
  overflow: "hidden",
  //   width: 'calc(100% - 8px)',
  width: "100%",
  minHeight:'100vh'
};
const MainLayout = () => (
  <Flex gap="middle" wrap="wrap">
    <Layout style={layoutStyle}>
      <Sider width="25%" style={siderStyle}>
        Sider
      </Sider>
      <Layout>
        <NavbarLayout/>
        <Content style={contentStyle}>Content</Content>
      </Layout>
    </Layout>
  </Flex>
);
export default MainLayout;

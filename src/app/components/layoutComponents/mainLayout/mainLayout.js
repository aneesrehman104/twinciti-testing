"use client";
import React, { useState, useEffect } from "react";
import { Layout, Form, Flex, Input, Menu } from "antd";
const { Header, Footer, Sider, Content } = Layout;
import NavbarLayout from "../navbarLayout/navbarLayout";
import SiderComponent from "../sidebarLayout/sidebarLayout";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Image from "next/image";
import styles from "./mainLayoutStyle.module.css";

const layoutStyle = {
  borderRadius: 8,
  overflow: "hidden",
  //   width: 'calc(100% - 8px)',
  width: "100%",
  minHeight: "100vh",
};

const MainLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Flex gap="middle" wrap="wrap">
      <Layout style={layoutStyle}>
        <SiderComponent>
          <section style={{ padding: 15 }}>
            {/* logo Title  */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Image
                  alt="/logo.svg"
                  height={48}
                  src="/logo.svg"
                  style={{ marginRight: "7px" }}
                  width={48}
                />
                <p className={styles.mainHeading}>Twinciti</p>
              </div>

              <Image
                alt="/arrowWithCircle.svg"
                height={48}
                src="/arrowWithCircle.svg"
                style={{ marginRight: "5px" }}
                width={48}
              />
            </div>
            <div>
              {/* input Field */}
              <div className={styles.btnGradient}>
                <Input
                  className={styles.inputStyle}
                  placeholder="Filter task by name"
                  prefix={
                    <Image
                      alt="/searchIcon.svg"
                      height={16}
                      src="/searchIcon.svg"
                      style={{ marginRight: "5px" }}
                      width={16}
                    />
                  }
                />
              </div>
            </div>
            {/* sidebar Children */}
            <div className={styles.menuStyle}>
              <div className={styles.menuStyleItem}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Image
                    alt="/searchIcon.svg"
                    height={32}
                    src="/searchIcon.svg"
                    style={{ marginRight: "5px" }}
                    width={32}
                  />
                  <p>Audio</p>
                </div>
                <div onClick={() => setIsOpen(!isOpen)}>
                  <Image
                    alt="Icon"
                    height={16}
                    src={isOpen ? "/upIcon.svg" : "/downIcon.svg"}
                    width={16}
                  />
                </div>
              </div>
              {isOpen ? (
                <>
                  <div style={{ marginTop: 15, marginBottom: 15 }}>
                    <div
                      style={{
                        display: "flex",
                        height: "52px",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          height: 50,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRightStyle: "none",
                          borderRadius: "10px 10px 0px 10px",
                          width: "25%",
                          marginTop: "-8px",
                        }}
                      >
                        <Image
                          alt="/searchIcon.svg"
                          height={24}
                          src="/searchIcon.svg"
                          width={24}
                        />
                      </div>
                      <p
                        style={{
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          height: 42,
                          display: "flex",
                          alignItems: "center",
                          borderLeftStyle: "none",
                          borderRadius: "0px 10px 10px 0px",
                          width: "80%",
                        }}
                      >
                        Audio
                      </p>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </section>
        </SiderComponent>
        <Layout>
          <NavbarLayout />
          <Content style={contentStyle}>Content</Content>
        </Layout>
      </Layout>
    </Flex>
  );
};
export default MainLayout;

"use client"
import { NavLink } from "react-router-dom";
import { TeamOutlined, UngroupOutlined, UnorderedListOutlined, UserOutlined } from "@ant-design/icons";
export const paths = {
    ai_requests: "/ai-history",
    crm_settings: "/crm-settings",
    chat_messages: "/chat-messages",
    customers: "/customers",
    embadding_resources: "/embadding-recourses",
    settings: "/settings",
    task_resources: "/task-resources",
    users: "/users",
};


// export const DashboardNavList = [
//     {
//         key: 1,
//         label: <NavLink to={paths.ai_requests}></NavLink>,
//         icon: <UnorderedListOutlined />,
//     },
//     {
//         key: 2,
//         label: <NavLink to={paths.crm_settings}></NavLink>,
//         icon: <UngroupOutlined />,
//     },
//     {
//         key: 3,
//         label: <NavLink to={paths.chat_messages}>O'quvchilar</NavLink>,
//         icon: <TeamOutlined />,
//     },
//     {
//         key: 4,
//         label: <NavLink to={paths.embadding_resources}>Ustozlar</NavLink>,
//         icon: <UserOutlined />,
//     },
// ];

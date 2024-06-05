import {
  TableCellsIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";

import { Tasks } from "@/pages/dashboard";
import { Login, Register } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tasks",
        path: "/tasks",
        element: <Tasks />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "login",
        path: "/login",
        element: <Login />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "register",
        path: "/register",
        element: <Register />,
      },
    ],
  },
];

export default routes;

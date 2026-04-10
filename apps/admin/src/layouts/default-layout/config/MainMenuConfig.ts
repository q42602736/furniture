import type { MenuItem } from "@/layouts/default-layout/config/types";

const MainMenuConfig: Array<MenuItem> = [
  {
    pages: [
      {
        heading: "平台总览",
        route: "/",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-speedometer2",
      },
    ],
  },
  {
    heading: "电商管理",
    pages: [
      {
        heading: "商品管理",
        route: "/products",
        keenthemesIcon: "parcel",
        bootstrapIcon: "bi-box-seam",
      },
      {
        heading: "分类管理",
        route: "/categories",
        keenthemesIcon: "category",
        bootstrapIcon: "bi-diagram-3",
      },
      {
        heading: "订单管理",
        route: "/orders",
        keenthemesIcon: "bill",
        bootstrapIcon: "bi-receipt",
      },
    ],
  },
  {
    heading: "报表分析",
    pages: [
      {
        sectionTitle: "数据报表",
        route: "/reports",
        keenthemesIcon: "chart-simple",
        bootstrapIcon: "bi-graph-up",
        sub: [
          { heading: "销售报表", route: "/reports/sales" },
          { heading: "客户订单", route: "/reports/customers" },
          { heading: "物流报表", route: "/reports/shipping" },
          { heading: "退货报表", route: "/reports/returns" },
        ],
      },
    ],
  },
  {
    heading: "用户与内容",
    pages: [
      {
        heading: "用户管理",
        route: "/users",
        keenthemesIcon: "profile-circle",
        bootstrapIcon: "bi-people",
      },
      {
        heading: "Banner 管理",
        route: "/banners",
        keenthemesIcon: "picture",
        bootstrapIcon: "bi-images",
      },
    ],
  },
  {
    heading: "系统",
    pages: [
      {
        heading: "系统设置",
        route: "/settings",
        keenthemesIcon: "setting-2",
        bootstrapIcon: "bi-gear",
      },
    ],
  },
];

export default MainMenuConfig;


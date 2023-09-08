export const appRoutes = {
  label: "app",
  children: [
    {
      name: "Social",
      icon: "share-alt",
      active: true,
      children: [
        {
          name: "About Us",
          to: "/aboutus",
          active: true,
        },
        {
          name: "Blogs",
          to: "/blogs",
          active: true,
        },
        {
          name: "Become a Partner",
          to: "/partner",
          active: true,
        },
        {
          name: "Podcasts",
          to: "/social/podcasts",
          active: true,
        },
        {
          name: "Stories",
          to: "/social/sharestories",
          active: true,
        },
      ],
    },
  ],
};

export const pagesRoutes = {
  label: "pages",
  children: [
    {
      name: "Shop",
      to: "/products",
      active: true,
    },
    {
      name: "Reservations",
      to: "/reservations",
      active: true,
    },
  ],
};

export const modulesRoutes = {
  label: "Modules",
  children: [
    {
      name: "Components",
      active: true,
      icon: "puzzle-piece",
      children: [
        {
          name: "Contact Us",
          to: "/contactus",
          active: true,
        },
        {
          name: "FAQ",
          to: "/faqs",
          active: true,
        },
      ],
    },
  ],
};

export const settingsRoutes = {
  label: "Settings",
  children: [
    {
      name: "User",
      active: true,
      icon: "user",
      children: [
        {
          name: "Appointments",
          to: "/appointments",
          active: true,
          roles: ["User"],
          exact: true,
        },
        {
          name: "Emergency Contact",
          to: "/emergency/contacts/:id",
          active: true,
          roles: ["User", "Admin"],
        },
        {
          name: "External Links",
          to: "/externallinks",
          active: true,
          roles: ["Admin", "User"],
          exact: true,
        },
        {
          name: "Highlight Reel",
          to: "/highlightreel/form",
          active: true,
          roles: ["User"],
          exact: true,
          isAnonymous: false,
        },
        {
          name: "Loyalty Points",
          to: "/user/loyaltypoints",
          active: true,
          roles: ["User"],
          exact: true,
        },
        {
          name: "Profile",
          to: "/profile",
          active: true,
          roles: ["Admin", "User"],
          isAnonymous: false,
          exact: true,
        },
        {
          name: "Trainings",
          to: "/training/list",
          active: true,
          roles: ["User", "Admin"],
        },
      ],
    },
  ],
};

export const documentationRoutes = {
  label: "documentation",
  children: [
    {
      name: "Admin Dashboard",
      to: "/dashboard/admin",
      active: true,
      roles: ["Admin", "Partner"],
    },
    {
      name: "Admin Blogs",
      to: "/blogs/admin",
      active: true,
      roles: ["Admin"],
    },
    {
      name: "Admin FAQ",
      icon: "question-circle",
      to: "/addfaq",
      active: true,
      roles: ["Admin"],
    },
    {
      name: "Appointments",
      to: "/appointments",
      active: true,
      roles: ["User", "Admin", "Partner"],
    },
    {
      name: "Chat",
      to: "/messages",
      active: true,
      roles: ["Admin"],
    },
    {
      name: "Emergency Contact",
      to: "/emergency/contact/admin/users/view",
      active: true,
      roles: ["Admin"],
    },
    {
      name: "External Links",
      to: "/externallinks",
      active: true,
      roles: ["User", "Admin"],
    },
    {
      name: "File Manager",
      to: "/fileManager",
      active: true,
      roles: ["Admin"],
    },
    {
      name: "File Upload",
      to: "/files",
      active: true,
      roles: ["Admin"],
    },
    {
      name: "Group Discounts",
      to: "/groupdiscount",
      active: true,
      roles: ["Admin", "Partner"],
    },
    {
      name: "Highlight Reel",
      to: "/highlightapproval",
      active: true,
      roles: ["Admin"],
    },
    {
      name: "Loyalty Points Source",
      to: "/admin/loyaltypointssource",
      active: true,
      roles: ["Admin"],
    },
    {
      name: "Newsletter View",
      to: "/newsletters/view",
      active: true,
      roles: ["Admin"],
    },
    {
      name: "Newsletter Add",
      to: "/newsletters",
      active: true,
      roles: ["Admin"],
    },
    {
      name: "Newsletter Subscriptions",
      to: "/dashboard/newsletteradmin",
      active: true,
      roles: ["Admin"],
    },
    {
      name: "Orders",
      to: "/orders",
      active: true,
      roles: ["Admin"],
    },
    {
      name: "Partner Manager",
      to: "/dashboard/partner",
      active: true,
      roles: ["Admin", "Partner"],
    },
    {
      name: "Product Manager",
      to: "/products/new",
      active: true,
      roles: ["Admin"],
    },
    {
      name: "Profile",
      to: "/profile",
      active: true,
      roles: ["Admin", "User"],
      isAnonymous: false,
      exact: true,
    },
    {
      name: "Podcast Manager",
      to: "/podcasts/new",
      active: true,
      roles: ["Admin"],
    },
    {
      name: "Recommendations",
      to: "/recommendations",
      active: true,
      roles: ["Admin"],
    },
    {
      name: "Site Analytics",
      to: "/sitetraffic",
      active: true,
      roles: ["Admin"],
    },
    {
      name: "Site Training Form",
      to: "/training/form",
      active: true,
      roles: ["Admin"],
    },
    {
      name: "Stands QR Codes",
      to: "/stands/codes",
      active: true,
      roles: ["Admin", "Partner"],
    },
    {
      name: "Stripe Dashboard",
      to: "/stripe/dashboard",
      active: true,
      roles: ["Admin"],
    },

    {
      name: "Story Manager",
      to: "/sharestories/new",
      active: true,
      roles: ["Admin"],
    },
    {
      name: "Survey Manager",
      to: "/surveys/new",
      active: true,
      roles: ["Admin"],
    },
    {
      name: "Users Managment",
      to: "/userlist",
      active: true,
      roles: ["Admin"],
    },
    {
      name: "Video Chat",
      to: "/video",
      active: true,
      roles: ["Admin"],
    },
    {
      name: "Video Chat Stats",
      to: "/dashboard/chat/statistics",
      active: true,
      roles: ["Admin"],
    },
  ],
};

export const partnerRoutes = {
  label: "partner",
  children: [
    {
      name: "Group Discounts",
      to: "/groupdiscounts",
      active: true,
      roles: ["Partner", "Admin"],
      exact: true,
    },
  ],
};
export default [
  appRoutes,
  pagesRoutes,
  modulesRoutes,
  documentationRoutes,
  settingsRoutes,
  partnerRoutes,
];

import { lazy } from "react";
const AddFaq = lazy(() => import("../components/common/AddFaq"));
const AdminDashBoard = lazy(() =>
  import("../components/dashboards/default/index")
);

const dashboard = lazy(() => import("../components/admin/AdminDashboard"));

const AppointmentForm = lazy(() =>
  import("../components/appointments/AppointmentForm")
);
const Appointment = lazy(() =>
  import("../components/appointments/Appointment")
);
const BlogForm = lazy(() => import("../components/blogs/BlogAdminForm"));
const Chat = lazy(() => import("../components/messages/Chat"));
const EmergencyContactsForm = lazy(() =>
  import("../components/emergencycontacts/EmergencyContactForm")
);
const EmergencyContactSysAdminViewUsers = lazy(() =>
  import("../components/emergencycontacts/EmergencyContactSysAdminViewUsers")
);

const EmergencyContactSysAdminViewEmergencyContacts = lazy(() =>
  import(
    "../components/emergencycontacts/EmergencyContactSysAdminViewEmergencyContacts"
  )
);

const EmergencyContactsList = lazy(() =>
  import("../components/emergencycontacts/EmergencyContactList")
);
const ExternalLinksForm = lazy(() =>
  import("../components/externallinks/ExternalLinks")
);
const FileManager = lazy(() => import("../components/files/FileManager"));
const GoogleReportsDashboard = lazy(() =>
  import("../components/gadashboard/GoogleReportsDashboard")
);
const ListOfUsers = lazy(() => import("../components/useradmin/UserList"));
const NewsletterAdmin = lazy(() =>
  import("../components/dashboards/default/NewsletterAdmin")
);
const Orders = lazy(() => import("../components/orders/Orders"));
const OrdersInfo = lazy(() => import("../components/orders/OrdersInfo"));
const PageNotFound = lazy(() => import("../components/errors/Error404"));
const Partner = lazy(() => import("../components/stripe/Partner"));
const PartnerViewCard = lazy(() =>
  import("../components/partneradmin/PartnerViewCard")
);
const Partners = lazy(() => import("../components/partneradmin/Partners"));
const PodcastForm = lazy(() => import("../components/podcasts/PodcastForm"));
const ProductsForm = lazy(() => import("../components/products/ProductsForm"));
const RegisterSuccess = lazy(() =>
  import("../components/stripe/RegisterSuccess")
);
const VideoApp = lazy(() =>
  import("../components/videochat/videochatapp/VideoApp.jsx")
);
const ShoppingCart = lazy(() =>
  import("../components/shoppingcart/ShoppingCart")
);
const SiteReferenceChart = lazy(() =>
  import("../components/sitereference/SiteReferenceChart")
);
const StandsForm = lazy(() => import("../components/stands/StandsForm"));
const StripeDashboard = lazy(() =>
  import("../components/stripe/StripeDashboard")
);
const SurveyAnalytics = lazy(() =>
  import("../components/surveys/SurveyAnalytics")
);
const SurveyBuilder = lazy(() =>
  import("../components/surveybuilder/SurveyBuilder")
);
const SurveyManager = lazy(() =>
  import("../components/surveybuilder/SurveyManager")
);
const TableOfUsers = lazy(() =>
  import("../components/useradmin/UserListTable")
);
const TestProduct = lazy(() => import("../components/stripe/TestProduct"));
const TransferCard = lazy(() => import("../components/stripe/TransferCard"));

const StandReturns = lazy(() =>
  import("../components/standreturns/StandReturns")
);

const Camera = lazy(() => import("../components/standreturns/Camera"));

const UserLoyaltyPoints = lazy(() =>
  import("../components/loyaltypointsdashboard/LoyaltyPointsDashboard")
);

const AdminLoyaltyPointsSource = lazy(() =>
  import("../components/loyaltypointssource/LoyaltyPointsSource.jsx")
);

const AdvertisementsForm = lazy(() =>
  import("../components/advertisements/AdvertisementForm")
);
const AdvertisementsListTable = lazy(() =>
  import("../components/advertisements/AdvertisementListTable")
);
const AdvertisementsList = lazy(() =>
  import("../components/advertisements/AdvertisementList")
);
const AdvertisementsListV2 = lazy(() =>
  import("../components/advertisements/AdvertisementListV2")
);

const LessonPage = lazy(() => import("../components/lessons/LessonPage"));

const LessonForm = lazy(() => import("../components/lessons/LessonForm"));

const SiteTrainingForm = lazy(() =>
  import("../components/sitetrainings/SiteTrainingsForm")
);
const SiteTrainingList = lazy(() =>
  import("../components/sitetrainings/SiteTrainingList")
);

const ProfilePage = lazy(() => import("../components/profile/ProfilePage"));

const GroupDiscountForm = lazy(() =>
  import("../components/groupdiscount/GroupDiscountForm")
);

const GroupDiscount = lazy(() =>
  import("../components/groupdiscount/GroupDiscount")
);
const HighlightReelForm = lazy(() =>
  import("../components/highlightreels/HighlightReelForm")
);
const HighlightReelApproval = lazy(() =>
  import("../components/highlightreels/HighlightReelApproval")
);
const NewsletterAdd = lazy(() =>
  import("../components/newsletters/Newsletter")
);
const NewsletterView = lazy(() =>
  import("../components/newsletters/NewslettersView")
);

const ChatStats = lazy(() =>
  import("../components/chatstatistics/ChatStatsDashboard")
);

const Recommendations = lazy(() =>
  import("../components/recommendations/Recommendations")
);

const NewRecommendation = lazy(() =>
  import("../components/recommendations/NewRecommendation")
);

const ViewRecommendations = lazy(() =>
  import("../components/recommendations/ViewRecommendations")
);

const QRGenerator = lazy(() => import("../components/qrcodes/QRForm"));

const groupDiscountsRoutes = [
  {
    path: "/groupdiscounts/form",
    name: "GroupDiscountForm",
    exact: true,
    element: GroupDiscountForm,
    roles: ["Partner", "Admin"],
    isAnonymous: false,
  },
  {
    path: "/groupdiscounts/:id/form",
    name: "EditGroupDiscountForm",
    exact: true,
    element: GroupDiscountForm,
    roles: ["Partner", "Admin"],
    isAnonymous: false,
  },
  {
    path: "/groupdiscounts",
    name: "GroupDiscounts",
    exact: true,
    element: GroupDiscount,
    roles: ["Partner", "Admin"],
    isAnonymous: false,
  },
];

const highlightReelRoutes = [
  {
    path: "/highlightapproval",
    name: "HighlightReelApproval",
    exact: true,
    element: HighlightReelApproval,
    roles: ["Admin"],
    isAnnonymous: false,
  },

  {
    path: "/highlightreel/form",
    name: "HighlightReelForm",
    exact: true,
    element: HighlightReelForm,
    roles: ["User"],
    isAnnonymous: false,
  },
];

const sitereference = [
  {
    path: "/sitereferencechart",
    name: "SiteReferenceChart",
    exact: true,
    element: SiteReferenceChart,
    roles: ["Admin"],
    isAnonymous: false,
  },
];
const surveyanalytics = [
  {
    path: "/surveyanalytics",
    name: "SurveyAnalytics",
    exact: true,
    element: SurveyAnalytics,
    roles: ["Admin"],
    isAnonymous: false,
  },
];
const appointmentRoutes = [
  {
    path: "/appointments",
    name: "Appointments",
    header: "Navigation",
    exact: true,
    element: Appointment,
    roles: ["User", "Admin", "Partner"],
    isAnonymous: false,
  },
  {
    path: "/appointments/form",
    name: "AppointmentForm",
    header: "Navigation",
    exact: true,
    element: AppointmentForm,
    roles: ["User", "Admin", "Partner"],
    isAnonymous: false,
  },
];
const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboards",
    header: "Navigation",
    children: [
      {
        path: "/dashboard/admin",
        name: "Admin Dashboard",
        element: dashboard,
        roles: ["Admin", "Partner"],
        exact: true,
        isAnonymous: false,
      },
      {
        path: "/dashboard/analytics",
        name: "Analytics",
        element: AdminDashBoard,
        roles: ["Admin"],
        exact: true,
        isAnonymous: false,
      },
      {
        path: "/dashboard/partner",
        name: "Partner Dashboard",
        element: Partners,
        roles: ["Partner", "Admin"],
        exact: true,
        isAnonymous: false,
      },
      {
        path: "/dashboard/partner/:id",
        name: "Partner View",
        element: PartnerViewCard,
        roles: ["Partner", "Admin"],
        exact: true,
        isAnonymous: false,
      },
      {
        path: "/dashboard/newsletteradmin",
        name: "Analytics",
        element: NewsletterAdmin,
        roles: ["Admin"],
        exact: true,
        isAnonymous: false,
      },
      {
        path: "/newsletters",
        name: "newsletter",
        exact: true,
        element: NewsletterAdd,
        roles: ["Admin"],
        isAnonymous: false,
      },
      {
        path: "/newsletter/:id/edit",
        name: "newsletter",
        exact: true,
        element: NewsletterAdd,
        roles: ["Admin"],
        isAnonymous: false,
      },
      {
        path: "/newsletters/view",
        name: "NewsletterView",
        exact: true,
        element: NewsletterView,
        roles: ["Admin"],
        isAnonymous: false,
      },
      {
        path: "/sitetraffic",
        name: "Site Analytics",
        exact: true,
        element: GoogleReportsDashboard,
        roles: ["Admin"],
        isAnonymous: false,
      },
      ,
      {
        path: "/dashboard/newsletteradmin",
        name: "Analytics",
        element: NewsletterAdmin,
        roles: ["Admin"],
        exact: true,
        isAnonymous: false,
      },
      {
        path: "/dashboard/chat/statistics",
        name: "Chat Statistics",
        element: ChatStats,
        roles: ["Admin"],
        exact: true,
        isAnonymous: false,
      },
    ],
  },
];

const profileRoutes = [
  {
    path: "/profile",
    name: "User Profile Page",
    element: ProfilePage,
    roles: ["User"],
    exact: true,
    isAnnonymous: false,
  },
];
const emergencyContactRoutes = [
  {
    path: "/emergency/contact/new",
    name: "EmergencyContacts",
    exact: true,
    element: EmergencyContactsForm,
    roles: ["Admin", "User"],
    isAnonymous: false,
  },
  {
    path: "/emergency/contact/:id/edit",
    name: "EmergencyContacts",
    exact: true,
    element: EmergencyContactsForm,
    roles: ["Admin", "User"],
    isAnonymous: false,
  },
  {
    path: "/emergency/contacts/:id",
    name: "EmergencyContactsList",
    exact: true,
    element: EmergencyContactsList,
    roles: ["Admin", "User"],
    isAnonymous: false,
  },
  {
    path: "/emergency/contact/admin/users/view",
    name: "EmergencyContactSysAdminViewUsers",
    exact: true,
    element: EmergencyContactSysAdminViewUsers,
    roles: ["Admin"],
    isAnonymous: false,
  },
  {
    path: "/emergency/contact/admin/users/view/user/emergencycontacts",
    name: "EmergencyContactSysAdminViewEmergencyContacts",
    exact: true,
    element: EmergencyContactSysAdminViewEmergencyContacts,
    roles: ["Admin"],
    isAnonymous: false,
  },
];
const faqs = [
  {
    path: "/addfaq",
    name: "AddFaq",
    exact: true,
    element: AddFaq,
    roles: ["Admin"],
    isAnonymous: false,
  },
];

const fileManager = [
  {
    path: "/fileManager",
    name: "File Manager",
    exact: true,
    element: FileManager,
    roles: ["Admin"],
    isAnonymous: false,
  },
];
const orders = [
  {
    path: "/orders",
    name: "Orders",
    exact: true,
    element: Orders,
    roles: ["Admin"],
    isAnonymous: false,
  },
  {
    path: "/orders/:id",
    name: "Orders/id",
    exact: true,
    element: OrdersInfo,
    roles: ["Admin", "User"],
    isAnonymous: false,
  },
];
const messages = [
  {
    path: "/messages",
    name: "Chat",
    exact: true,
    element: Chat,
    roles: ["Admin", "User"],
    isAnonymous: false,
  },
];
const products = [
  {
    path: "/products/new",
    name: "New Product",
    exact: true,
    element: ProductsForm,
    roles: ["Admin", "Partner"],
    isAnonymous: false,
  },
];
const errorRoutes = [
  {
    path: "/error-404",
    name: "Error - 404",
    element: PageNotFound,
    roles: [],
    exact: true,
    isAnonymous: false,
  },
];
const surveyBuilderRoutes = [
  {
    path: "/surveys/new",
    name: "SurveyManager",
    exact: true,
    element: SurveyManager,
    roles: ["Admin"],
    isAnonymous: false,
  },
  {
    path: "/surveys/:id/builder",
    name: "SurveyBuilder",
    exact: true,
    element: SurveyBuilder,
    roles: ["Admin"],
    isAnonymous: false,
  },
];

const standReturnRoute = [
  {
    path: "/standreturns",
    name: "Stand Returns",
    exact: true,
    element: StandReturns,
    roles: ["User", "Admin"],
    isAnonymous: false,
  },
  {
    path: "/camera",
    name: "Camera",
    exact: true,
    element: Camera,
    roles: ["User", "Admin"],
    isAnonymous: false,
  },
];

const podcasts = [
  {
    path: "/podcasts/new",
    name: "PodcastForm",
    exact: true,
    element: PodcastForm,
    roles: ["Admin"],
    isAnonymous: false,
  },
  {
    path: "/podcasts/:id",
    name: "PodcastForm",
    exact: true,
    element: PodcastForm,
    roles: ["Admin"],
    isAnonymous: false,
  },
];
const externalLinkRoutes = [
  {
    path: "/externallinks",
    name: "External Links",
    exact: true,
    element: ExternalLinksForm,
    roles: ["User", "Admin"],
    isAnonymous: false,
  },
];
const videoChat = [
  {
    path: "/video",
    name: "VideoChat",
    exact: true,
    element: VideoApp,
    roles: ["Admin", "User", "Partner"],
    isAnonymous: true,
  },
];
const blogAdminRoute = [
  {
    path: "/blogs/admin",
    name: "Admin Form",
    exact: true,
    element: BlogForm,
    roles: ["Admin"],
    isAnonymous: false,
  },
];
const userList = [
  {
    path: "/userlist",
    name: "Users List",
    element: ListOfUsers,
    roles: ["Admin"],
    exact: true,
    isAnonymous: false,
  },
];
const standsForm = [
  {
    path: "/stands/new",
    name: "Stands form ",
    element: StandsForm,
    roles: ["Partner"],
    exact: true,
    isAnonymous: false,
  },
];
const userListTableView = [
  {
    path: "/usertableview",
    name: "Users List Table",
    element: TableOfUsers,
    roles: ["Admin"],
    exact: true,
    isAnonymous: false,
  },
];

const stripeRoutes = [
  {
    path: "/stripe/dashboard",
    name: "Dashboard",
    exact: true,
    element: StripeDashboard,
    roles: ["Admin"],
    isAnonymous: false,
  },
  {
    path: "/stripe/partner",
    name: "Partner",
    exact: true,
    element: Partner,
    roles: ["Admin", "Partner", "User"],
    isAnonymous: false,
  },
  {
    path: "/stripe/register/success",
    name: "RegisterSuccess",
    exact: true,
    element: RegisterSuccess,
    roles: ["Admin", "Partner"],
    isAnonymous: false,
  },
  {
    path: "/stripe/testproduct",
    name: "TestProduct",
    exact: true,
    element: TestProduct,
    roles: ["Admin", "Partner"],
    isAnonymous: false,
  },
  {
    path: "/stripe/transfer",
    name: "Transfer",
    exact: true,
    element: TransferCard,
    roles: ["Admin"],
    isAnonymous: false,
  },
];

const userLoyaltyPoints = [
  {
    path: "/user/loyaltypoints",
    name: "UserLoyaltyPointsDashboard",
    exact: true,
    element: UserLoyaltyPoints,
    roles: ["User"],
    isAnnonymous: false,
  },
];

const adminLoyaltyPointsSource = [
  {
    path: "/admin/loyaltypointssource",
    name: "AdminLoyaltyPointsSource",
    exact: true,
    element: AdminLoyaltyPointsSource,
    roles: ["Admin"],
    isAnnonymous: false,
  },
];

const adminLoyaltyPointsSourceEdit = [
  {
    path: "/admin/loyaltypointssource/:Id",
    name: "AdminLoyaltyPointsSourceEdit",
    exact: true,
    element: AdminLoyaltyPointsSource,
    roles: ["Admin"],
    isAnnonymous: false,
  },
];

const advertisementsRoutes = [
  {
    path: "/advertisements/form",
    name: "New Advertisement",
    exact: true,
    element: AdvertisementsForm,
    roles: ["User", "Admin", "Partner"],
    isAnonymous: false,
  },
  {
    path: "/advertisements/form/:id",
    name: "New Advertisement",
    exact: true,
    element: AdvertisementsForm,
    roles: ["User", "Admin", "Partner"],
    isAnonymous: false,
  },
  {
    path: "/advertisements/table",
    name: "List Advertisement",
    exact: true,
    element: AdvertisementsListTable,
    roles: ["User", "Admin", "Partner"],
    isAnonymous: false,
  },
  {
    path: "/advertisements/list",
    name: "List Advertisement",
    exact: true,
    element: AdvertisementsList,
    roles: ["Admin", "User", "Partner"],
    isAnonymous: false,
  },
  {
    path: "/advertisements/listV2",
    name: "AdvertisementListV2",
    exact: true,
    element: AdvertisementsListV2,
    roles: ["Admin", "User", "Partner"],
    isAnonymous: false,
  },
];

const siteTrainingRoutes = [
  {
    path: "/training/form",
    name: "Site Training Form",
    exact: true,
    element: SiteTrainingForm,
    roles: ["User", "Admin", "Partner"],
    isAnnonymous: false,
  },
  {
    path: "/training/form/:id",
    name: "Update Site Training Form",
    exact: true,
    element: SiteTrainingForm,
    roles: ["User", "Admin", "Partner"],
    isAnnonymous: false,
  },
  {
    path: "/training/list",
    name: "Site Training List",
    exact: true,
    element: SiteTrainingList,
    roles: ["User", "Admin", "Partner"],
    isAnnonymous: false,
  },
  {
    path: "/training/:id/lessons",
    name: "Lesson Page",
    exact: true,
    element: LessonPage,
    roles: ["Admin", "Partner", "User"],
    isAnonymous: false,
  },
  {
    path: "training/lessons/form",
    name: "Lesson Form",
    exact: true,
    element: LessonForm,
    roles: ["Admin", "Partner"],
    isAnonymous: false,
  },
  {
    path: "training/lessons/:id/form",
    name: "LessonForm",
    exact: true,
    element: LessonForm,
    roles: ["Admin", "Partner"],
    isAnonymous: false,
  },
];
const shoppingCart = [
  {
    path: "/shoppingcart",
    name: "Users Cart",
    exact: true,
    element: ShoppingCart,
    roles: ["User"],
    isAnonymous: false,
  },
];
const recommendations = [
  {
    path: "/recommendations",
    name: "Recommendations",
    exact: true,
    element: Recommendations,
    roles: ["Admin"],
    isAnonymous: false,
  },
  {
    path: "/recommendations/new",
    name: "NewRecommendation",
    exact: true,
    element: NewRecommendation,
    roles: ["Admin"],
    isAnonymous: false,
  },
  {
    path: "/recommendations/view",
    name: "ViewRecommendations",
    exact: true,
    element: ViewRecommendations,
    roles: ["Admin"],
    isAnonymous: false,
  },
];
const qrCodes = [
  {
    path: "/stands/codes",
    name: "Stands QR Codes",
    exact: true,
    element: QRGenerator,
    roles: ["Admin", "Partner"],
    isAnonymous: false,
  },
];

const allRoutes = [
  ...surveyanalytics,
  ...sitereference,
  ...highlightReelRoutes,
  ...appointmentRoutes,
  ...dashboardRoutes,
  ...profileRoutes,
  ...errorRoutes,
  ...emergencyContactRoutes,
  ...externalLinkRoutes,
  ...orders,
  ...blogAdminRoute,
  ...products,
  ...podcasts,
  ...messages,
  ...userList,
  ...standsForm,
  ...faqs,
  ...videoChat,
  ...userListTableView,
  ...userLoyaltyPoints,
  ...adminLoyaltyPointsSource,
  ...adminLoyaltyPointsSourceEdit,
  ...surveyBuilderRoutes,
  ...standReturnRoute,
  ...stripeRoutes,
  ...fileManager,
  ...advertisementsRoutes,
  ...siteTrainingRoutes,
  ...recommendations,
  ...groupDiscountsRoutes,
  ...shoppingCart,
  ...qrCodes,
];
export default allRoutes;

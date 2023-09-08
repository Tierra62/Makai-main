import { lazy } from "react";
const Landing = lazy(() => import("../components/landing/Landing"));
const Registration = lazy(() =>
  import("../components/authentication/Registration")
);
const Login = lazy(() => import("../components/authentication/Login"));
const ForgotPassword = lazy(() =>
  import("../components/authentication/ForgotPassword")
);
const ChangePassword = lazy(() =>
  import("../components/authentication/ChangePassword")
);
const ConfirmEmail = lazy(() =>
  import("../components/authentication/ConfirmEmail")
);
const ReservationsWizard = lazy(() =>
  import("../components/reservations/ReservationsWizard")
);
const ReservationCheckoutSuccess = lazy(() =>
  import("../components/reservations/ReservationCheckoutSuccess")
);
const PageNotFound = lazy(() => import("../components/errors/Error404"));
const ServerError = lazy(() => import("../components/errors/Error500"));
const Blogs = lazy(() => import("../components/blogs/Blogs"));
const BlogDetail = lazy(() => import("../components/blogs/BlogDetail"));
const AboutUs = lazy(() => import("../components/about/AboutUs"));
const Faqs = lazy(() => import("../components/common/Faqs"));
const ContactUsForm = lazy(() =>
  import("../components/contactus/ContactUsForm")
);
const SiteReference = lazy(() =>
  import("../components/sitereference/SiteReference")
);
const LocationForm = lazy(() => import("../components/locations/LocationForm"));
const Map = lazy(() => import("../components/map/Map"));
const Parent = lazy(() => import("../components/comments/Parent"));
const Products = lazy(() => import("../components/products/Products"));
const FileUploader = lazy(() => import("../components/FileUploader"));
const PartnerRegistration = lazy(() =>
  import("../components/partners/PartnerRegistration")
);
const LocalPartner = lazy(() => import("../components/partners/LocalPartner"));
const StandsLocationFinder = lazy(() =>
  import("../components/stands/StandsLocationFinder")
);
const Directions = lazy(() => import("../components/stands/StandDirections"));
const Podcasts = lazy(() => import("../components/podcasts/Podcasts"));
const FileManager = lazy(() => import("../components/files/FileManager"));
const ShareStory = lazy(() => import("../components/sharestories/ShareStory"));
const ShareStoryDetail = lazy(() =>
  import("../components/sharestories/ShareStoryDetail")
);
const SurveyPreview = lazy(() => import("../components/surveys/SurveyPreview"));
const ShareStoryForm = lazy(() =>
  import("../components/sharestories/ShareStoryForm")
);
const CheckoutDetails = lazy(() =>
  import("../components/stripe/CheckoutDetails")
);
const StripeCart = lazy(() => import("../components/stripe/StripeCart"));
const CheckoutSuccess = lazy(() =>
  import("../components/stripe/CheckoutSuccess")
);
const Survey = lazy(() => import("../components/surveys/Survey"));
const Donation = lazy(() => import("../components/donations/Donations"));

const PrivacyPolicy = lazy(() =>
  import("../components/policies/PrivacyPolicy")
);

const CookiesPolicy = lazy(() =>
  import("../components/policies/CookiesPolicy")
);
const InsuranceOption = lazy(() =>
  import("../components/stripe/InsuranceOption")
);

const NewsletterUnsubcribed = lazy(() =>
  import("../components/newsletters/Unsubscribe")
);

const CheckoutPage = lazy(() => import("../components/stripe/CheckoutPage"));

const Review = lazy(() => import("../components/reviews/Review"));

const ProductItem = lazy(() => import("../components/products/ProductItem"));

const routes = [
  {
    path: "/reviews",
    name: "Review",
    exact: true,
    element: Review,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/product/:id",
    name: "Product Item",
    exact: true,
    element: ProductItem,
  },

  {
    path: "/newsletter/unsubscribed",
    name: "newsletter unsubscribed",
    exact: true,
    element: NewsletterUnsubcribed,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "social/sharestories",
    name: "Share Story",
    exact: true,
    element: ShareStory,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "social/sharestories/:id",
    name: "Share Story Detail",
    exact: true,
    element: ShareStoryDetail,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "social/podcasts",
    name: "Podcasts",
    exact: true,
    element: Podcasts,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/",
    name: "Landing",
    exact: true,
    element: Landing,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/blogs",
    name: "Blogs",
    exact: true,
    element: Blogs,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/blogs/:id",
    name: "BlogDetail",
    exact: true,
    element: BlogDetail,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/aboutus",
    name: "About Us",
    exact: true,
    element: AboutUs,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/privacypolicy",
    name: "Privacy Policy",
    exact: true,
    element: PrivacyPolicy,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/cookiespolicy",
    name: "Cookies Policy",
    exact: true,
    element: CookiesPolicy,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/register",
    name: "Registration",
    exact: true,
    element: Registration,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/login",
    name: "Login",
    exact: true,
    element: Login,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/forgotpassword",
    name: "ForgotPassword",
    exact: true,
    element: ForgotPassword,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/changepassword",
    name: "ChangePassword",
    exact: true,
    element: ChangePassword,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/confirm",
    name: "Confirm",
    exact: true,
    element: ConfirmEmail,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/contactus",
    name: "ContactUsForm",
    exact: true,
    element: ContactUsForm,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/blogs",
    name: "Blogs",
    exact: true,
    element: Blogs,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/sitereference",
    name: "SiteReference",
    exact: true,
    element: SiteReference,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/donations",
    name: "Donation",
    exact: true,
    element: Donation,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "locations/new",
    name: "Location Form",
    exact: true,
    element: LocationForm,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "locations/update",
    name: "Locations Update",
    exact: true,
    element: LocationForm,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "locations/map",
    name: "Map",
    exact: true,
    element: Map,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "comments",
    name: "Comments",
    exact: true,
    element: Parent,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "products",
    name: "Products",
    exact: true,
    element: Products,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/files",
    name: "FileUploader",
    exact: true,
    element: FileUploader,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/fileManager",
    name: "FileManager",
    exact: true,
    element: FileManager,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/partner/new",
    name: "Partner Registration",
    exact: true,
    element: PartnerRegistration,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/partner",
    name: "Partner Card",
    exact: true,
    element: LocalPartner,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/reservations",
    name: "Reservations",
    exact: true,
    element: ReservationsWizard,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/stands/standsfinder",
    name: "StandsLocationFinder",
    exact: true,
    element: StandsLocationFinder,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/stands/directions",
    name: "StandDirections",
    exact: true,
    element: Directions,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/faqs",
    name: "Faqs",
    exact: true,
    element: Faqs,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/survey/preview",
    name: "SurveyPreview",
    exact: true,
    element: SurveyPreview,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/files",
    name: "FileUploader",
    exact: true,
    element: FileUploader,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/fileManager",
    name: "FileManager",
    exact: true,
    element: FileManager,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/surveys/take/id",
    name: "Survey",
    exact: true,
    element: Survey,
    roles: [],
    isAnonymous: true,
  },
];

const errorRoutes = [
  {
    path: "/error-500",
    name: "Error - 500",
    element: ServerError,
    roles: [],
    exact: true,
    isAnonymous: true,
  },
  {
    path: "/error-404",
    name: "Error - 404",
    element: PageNotFound,
    roles: [],
    exact: true,
    isAnonymous: true,
  },
];

const publicStripeRoutes = [
  {
    path: "/products/stripe/cart",
    name: "Cart",
    exact: true,
    element: StripeCart,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/products/stripe/cart/insurance",
    name: "Insurance Option",
    exact: true,
    element: InsuranceOption,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/products/stripe/cart/checkout",
    name: "Checkout Page",
    exact: true,
    element: CheckoutPage,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/stripe/checkout/reservation/success",
    name: "ReservationCheckoutSuccess",
    exact: true,
    element: ReservationCheckoutSuccess,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/stripe/checkout/details",
    name: "CheckoutDetails",
    exact: true,
    element: CheckoutDetails,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/stripe/checkout/success",
    name: "CheckoutSuccess",
    exact: true,
    element: CheckoutSuccess,
    roles: [],
    isAnonymous: true,
  },
  {
    path: "/sharestories/new",
    name: "Share Story Form",
    exact: true,
    element: ShareStoryForm,
    roles: [],
    isAnonymous: true,
  },
];

const allRoutes = [...routes, ...errorRoutes, ...publicStripeRoutes];

export default allRoutes;

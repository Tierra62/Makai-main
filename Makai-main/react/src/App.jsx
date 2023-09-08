import React, { Suspense, useState, useEffect, useCallback } from "react";
import logger from "sabio-debug";
import { Routes, Route, useLocation } from "react-router-dom";
import BlankLayout from "./layouts/BlankLayout";
import VerticalLayout from "./layouts/VerticalLayout";
import {
  authProtectedFlattenRoutes,
  publicProtectedFlattenRoutes,
} from "./routes/index";
import userService from "services/userService.js";
import Error404 from "components/errors/Error404";
import "toastr/build/toastr.css";
import CookiesAgreement from "components/policies/CookiesAgreement";

const DEFAULT_USER = {
  id: 0,
  roles: [],
  email: "",
  isLoggedIn: false,
};
const loading = () => <div className="">loading....</div>;
const _logger = logger.extend("App");
const _loggerUser = logger.extend("user");
_logger("publicProtectedFlattenRoutes", publicProtectedFlattenRoutes);

_logger("authProtectedFlattenRoutes", authProtectedFlattenRoutes);

const App = (props) => {
  const { pathname, state } = useLocation();
  let [currentUser, setCurrentUser] = useState(() => {
    return DEFAULT_USER;
  });

  useEffect(() => {
    if (state?.type === "USER_LOGOUT") {
      setCurrentUser(DEFAULT_USER);
    }
  }, [state?.type]);

  useEffect(() => {
    userService.getCurrent().then(onGetCurrentSuccess).catch(onGetCurrentError);
  }, [pathname]);

  const onGetCurrentSuccess = (response) => {
    _loggerUser(response);
    const user = response.item;

    setCurrentUser((prevState) => {
      const currentUser = { ...prevState };
      currentUser.id = user.id;
      currentUser.roles = user.roles.map(mapUserRoles);
      currentUser.email = user.name;
      currentUser.isLoggedIn = true;
      return currentUser;
    });
  };

  const onGetCurrentError = (error) => {
    _loggerUser(error);
  };

  const mapUserRoles = (role) => {
    return role;
  };

  const [currentPath, setCurrentPath] = useState({
    isPublic: false,
    isSecured: false,
    isUnknown: false,
    roles: [],
  });

  const getRouteMapper = useCallback(
    (user) => (routeData) =>
      (
        <Route
          key={routeData.path}
          path={routeData.path}
          exact={routeData.exact}
          name={routeData.name}
          element={<routeData.element currentUser={user} />}
        />
      ),
    []
  );

  const getMappedRoutes = useCallback(
    (arrOfRouteData, user) => {
      let theseRoutes = arrOfRouteData.map(getRouteMapper(user));
      _logger("getMappedRoutes.", theseRoutes);
      return theseRoutes;
    },
    [getRouteMapper]
  );

  const currentPathCheck = (pp) => {
    let ppPath = pp?.path?.split("/").filter((el) => el !== "");
    let pathNameCheck = pathname.split("/").filter((el) => el !== "");
    let result = false;
    if (ppPath?.length === pathNameCheck.length) {
      if (pathNameCheck.length === 0) {
        result = true;
      } else {
        for (let a = 0; a < pathNameCheck.length; a++) {
          if (pathNameCheck[a] !== ppPath[a]) {
            if (
              ppPath[a].startsWith(":") &&
              pathNameCheck[a].match(/^[0-9]+$/)
            ) {
              result = true;
            } else {
              return false;
            }
          } else {
            result = true;
          }
        }
      }
    }
    return result;
  };

  // ensure that currentPath.path is set to true, but only if it is false AND it should be true
  useEffect(() => {
    let pathRoles = [];
    if (publicProtectedFlattenRoutes.some((pp) => currentPathCheck(pp))) {
      if (!currentPath.isPublic) {
        setCurrentPath(() => {
          return { isSecured: false, isPublic: true };
        });
      }
    } else if (
      authProtectedFlattenRoutes.some((pp) => {
        pathRoles = pp.roles;
        return currentPathCheck(pp);
      })
    ) {
      if (!currentPath.isSecured) {
        setCurrentPath(() => {
          return { isPublic: false, isSecured: true, roles: pathRoles };
        });
      }
    } else if (!currentPath.isUnknown) {
      setCurrentPath(() => {
        return { isUnknown: true };
      });
    }
  }, [pathname, currentPath]);

  const generateDynamicRoutes = (currentUser) => {
    _logger("generateDynamicRoutes", authProtectedFlattenRoutes);
    let routes = authProtectedFlattenRoutes.filter((route) => {
      if (route.roles?.length === 0) {
        return true; //all any loggedIn user to see routes that have empty roles
      }
      return route.roles?.some((role) => currentUser.roles.includes(role));
    });
    _logger("generateDynamicRoutes", routes);

    return getMappedRoutes(routes, currentUser);
  };

  const getLast = (arr) => {
    return [arr[arr.length - 1]];
  };

  _logger("render", {
    pathname,
    currentUser,
    currentPath: JSON.stringify(currentPath),
  });

  const rolesCheck = (pathRole) => {
    return currentUser.roles.includes(pathRole);
  };

  return (
    <div>
      <Suspense fallback={loading()}>
        {/* if the path is public we do not care about the current User  */}
        {currentPath.isPublic && (
          <BlankLayout {...props} currentUser={currentUser}>
            <Routes>
              {getMappedRoutes(publicProtectedFlattenRoutes, currentUser)}
            </Routes>
          </BlankLayout>
        )}
        {/* if the user is logged in and attempting to go to an KNOWN page, that is is also secure/not public  */}
        {(currentPath.isSecured &&
          currentUser.isLoggedIn &&
          !currentPath.roles.some(rolesCheck) && <Error404 />) ||
          (currentUser.isLoggedIn &&
            !currentPath.isPublic &&
            !currentPath.isUnknown && (
              <VerticalLayout {...props} currentUser={currentUser}>
                <Routes>{generateDynamicRoutes(currentUser)}</Routes>
              </VerticalLayout>
            ))}
        {/* we do not know this url , and so the user status does not matter */}
        {currentPath.isUnknown && (
          <BlankLayout {...props} currentUser={currentUser}>
            <Routes>
              {getMappedRoutes(
                getLast(publicProtectedFlattenRoutes),
                currentUser
              )}
            </Routes>
          </BlankLayout>
        )}
        {currentPath.isSecured && !currentUser.isLoggedIn && <Error404 />}
      </Suspense>
      <CookiesAgreement />
    </div>
  );
};

export default App;

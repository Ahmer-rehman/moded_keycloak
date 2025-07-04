import {
  Nav,
  NavGroup,
  PageSidebar,
  PageSidebarBody,
} from "@patternfly/react-core";
import { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";
import { useAccess } from "./context/access/Access";
import { useRealm } from "./context/realm-context/RealmContext";
import { useServerInfo } from "./context/server-info/ServerInfoProvider";
import { toPage } from "./page/routes";
import { routes } from "./routes";
import useIsFeatureEnabled, { Feature } from "./utils/useIsFeatureEnabled";

import "./page-nav.css";

type LeftNavProps = { title: string; path: string; id?: string };

const LeftNav = ({ title, path, id }: LeftNavProps) => {
  const { t } = useTranslation();
  const { hasAccess } = useAccess();
  const { realm } = useRealm();
  const encodedRealm = encodeURIComponent(realm);
  const route = routes.find(
    (route) =>
      route.path.replace(/\/:.+?(\?|(?:(?!\/).)*|$)/g, "") === (id || path),
  );

  const accessAllowed =
    route &&
    (route.handle.access instanceof Array
      ? hasAccess(...route.handle.access)
      : hasAccess(route.handle.access));

  if (!accessAllowed) {
    return null;
  }

  const name = "nav-item" + path.replace("/", "-");
  return (
    <li>
      <NavLink
        id={name}
        data-testid={name}
        to={`/${encodedRealm}${path}`}
        className={({ isActive }) =>
          `pf-v5-c-nav__link${isActive ? " pf-m-current" : ""}`
        }
      >
        {t(title)}
      </NavLink>
    </li>
  );
};

export const PageNav = () => {
  const { t } = useTranslation();
  const { hasSomeAccess } = useAccess();
  const { componentTypes } = useServerInfo();
  const isFeatureEnabled = useIsFeatureEnabled();
  const pages =
    componentTypes?.["org.keycloak.services.ui.extend.UiPageProvider"];
  const navigate = useNavigate();
  const { realmRepresentation } = useRealm();

  type SelectedItem = {
    groupId: number | string;
    itemId: number | string;
    to: string;
    event: FormEvent<HTMLInputElement>;
  };

  const onSelect = (item: SelectedItem) => {
    navigate(item.to);
    item.event.preventDefault();
  };

  const showManage = hasSomeAccess(
    "view-realm",
    "query-groups",
    "query-users",
    "query-clients",
    "view-events",
  );

  const showConfigure = hasSomeAccess(
    "view-realm",
    "query-clients",
    "view-identity-providers",
  );

  return (
    <PageSidebar className="keycloak__page_nav__nav">
      <PageSidebarBody>
        <Nav onSelect={(_event, item) => onSelect(item as SelectedItem)}>
          {showManage && (
            <NavGroup aria-label={t("manage")} title={t("manage")}>
              {isFeatureEnabled(Feature.Organizations) &&
                realmRepresentation?.organizationsEnabled && (
                  <LeftNav title="users" path="/users" />
                )}
              {/* <LeftNav title="clients" path="/clients" /> */}
              {/* <LeftNav title="clientScopes" path="/client-scopes" /> */}
              {/* <LeftNav title="realmRoles" path="/roles" /> */}
              <LeftNav title="users" path="/users" />
              {/* <LeftNav title="groups" path="/groups" /> */}
              <LeftNav title="sessions" path="/sessions" />
              {/* <LeftNav title="events" path="/events" /> */}
            </NavGroup>
          )}

           {showConfigure && (
            <NavGroup aria-label={t("configure")} title={t("configure")}>
              <LeftNav title="SMTP Configurations" path="/realm-settings" />
              {/* <LeftNav title="authentication" path="/authentication" />
              {isFeatureEnabled(Feature.AdminFineGrainedAuthzV2) &&
                realmRepresentation?.adminPermissionsEnabled && (
                  <LeftNav title="permissions" path="/permissions" />
                )}
              <LeftNav title="identityProviders" path="/identity-providers" />
              <LeftNav title="userFederation" path="/user-federation" />
              {isFeatureEnabled(Feature.DeclarativeUI) &&
                pages?.map((p) => (
                  <LeftNav
                    key={p.id}
                    title={p.id}
                    path={toPage({ providerId: p.id }).pathname!}
                    id="/page-section"
                  />
                ))} */}
            </NavGroup>
          )} 
        </Nav>
      </PageSidebarBody>
    </PageSidebar>
  );
};

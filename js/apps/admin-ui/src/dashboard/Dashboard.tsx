import FeatureRepresentation, {
  FeatureType,
} from "@keycloak/keycloak-admin-client/lib/defs/featureRepresentation";
import { HelpItem, label, useEnvironment } from "@keycloak/keycloak-ui-shared";
import {
  ActionList,
  ActionListItem,
  Brand,
  Button,
  Card,
  CardBody,
  CardTitle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  Grid,
  GridItem,
  Label,
  List,
  ListItem,
  ListVariant,
  PageSection,
  Tab,
  TabTitleText,
  Text,
  TextContent,
  TextVariants,
  Title,
} from "@patternfly/react-core";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { KeycloakSpinner } from "@keycloak/keycloak-ui-shared";
import {
  RoutableTabs,
  useRoutableTab,
} from "../components/routable-tabs/RoutableTabs";
import { useRealm } from "../context/realm-context/RealmContext";
import { useServerInfo } from "../context/server-info/ServerInfoProvider";
import helpUrls from "../help-urls";
import useLocaleSort, { mapByKey } from "../utils/useLocaleSort";
import { ProviderInfo } from "./ProviderInfo";
import { DashboardTab, toDashboard } from "./routes/Dashboard";

import "./dashboard.css";

const EmptyDashboard = () => {
  const { environment } = useEnvironment();

  const { t } = useTranslation();
  const { realm, realmRepresentation: realmInfo } = useRealm();
  const brandImage = "https://firebasestorage.googleapis.com/v0/b/laaleh-2451e.appspot.com/o/beep.svg?alt=media&token=3847db46-30c6-4a1d-8ef4-58fbcbaa7835";
  const realmDisplayInfo = label(t, realmInfo?.displayName, realm);

  return (
    <PageSection variant="light">
      <EmptyState variant="lg">
        <Brand
          src={brandImage}
          alt="Beep Pakistan logo"
          className="keycloak__dashboard_icon"
        />
        <EmptyStateHeader titleText={<>{t("welcome")}</>} headingLevel="h2" />
        <EmptyStateHeader titleText={realmDisplayInfo} headingLevel="h1" />
        <EmptyStateBody>{t("introduction")}</EmptyStateBody>
      </EmptyState>
    </PageSection>
  );
};

type FeatureItemProps = {
  feature: FeatureRepresentation;
};

const FeatureItem = ({ feature }: FeatureItemProps) => {
  const { t } = useTranslation();
  return (
    <ListItem className="pf-v5-u-mb-sm">
      {feature.name}&nbsp;
      {feature.type === FeatureType.Experimental && (
        <Label color="orange">{t("experimental")}</Label>
      )}
      {feature.type === FeatureType.Preview && (
        <Label color="blue">{t("preview")}</Label>
      )}
      {feature.type === FeatureType.Default && (
        <Label color="green">{t("supported")}</Label>
      )}
    </ListItem>
  );
};

const Dashboard = () => {
  const { t } = useTranslation();
  const { realm, realmRepresentation: realmInfo } = useRealm();
  const serverInfo = useServerInfo();
  const localeSort = useLocaleSort();

  const sortedFeatures = useMemo(
    () => localeSort(serverInfo.features ?? [], mapByKey("name")),
    [serverInfo.features],
  );

  const disabledFeatures = useMemo(
    () => sortedFeatures.filter((f) => !f.enabled) || [],
    [serverInfo.features],
  );

  const enabledFeatures = useMemo(
    () => sortedFeatures.filter((f) => f.enabled) || [],
    [serverInfo.features],
  );

  const useTab = (tab: DashboardTab) =>
    useRoutableTab(
      toDashboard({
        realm,
        tab,
      }),
    );

  const realmDisplayInfo = label(t, realmInfo?.displayName, realm);

  const welcomeTab = useTab("welcome");
  const infoTab = useTab("info");
  const providersTab = useTab("providers");

  if (Object.keys(serverInfo).length === 0) {
    return <KeycloakSpinner />;
  }

  return (
    <>
 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '63vh' }}>
  <img 
    src="https://firebasestorage.googleapis.com/v0/b/laaleh-2451e.appspot.com/o/beep.svg?alt=media&token=3847db46-30c6-4a1d-8ef4-58fbcbaa7835" 
    alt="Beep Pakistan Logo"
    style={{ width: '500px', height: 'auto', marginBottom: '20px' }}
  />
  <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Welcome to Beep Pakistan</h1>
</div>

  </>
  
  );
};

export default function DashboardSection() {
  const { realm } = useRealm();
  const isMasterRealm = realm === "master";
  return (
    <>
      {!isMasterRealm && <EmptyDashboard />}
      {isMasterRealm && <Dashboard />}
    </>
  );
}

import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
  Toolbar,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import {
  Dashboard,
  AccountBalanceWallet,
  ArrowUpward,
  ArrowDownward,
  CreditCard,
  Settings,
  Logout,
  ExpandLess,
  ExpandMore,
  AccountBalance,
  CurrencyExchange,
  ReceiptLong,
  Group,
  Contactless,
  PointOfSale,
  Receipt,
  CallMade,
  CallReceived,
  Security,
  BrandingWatermark,
  Loyalty,
  Menu,
  Groups,
  Style,
  CardTravel,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { logout } from "../components/Signup/js/logout-function.js";
import { useLocation } from "react-router-dom";

const collapsedWidth = 100;
const expandedWidth = 220;

const SidebarComponent = ({
  onNavigate,
  logoUrl = "/logo.svg",
  expanded,
  setExpanded,
  dispatch,
}) => {
  const [selectedItem, setSelectedItem] = useState("");
  const [openSublist, setOpenSublist] = useState(null); // Track which submenu is open

  const dashboardLoading = useSelector((state) => state.auth?.dashboardLoading);

  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const platform = useSelector((state) => state.common.platform);

  const location = useLocation();
  React.useEffect(() => {
    // Find the sidebar item whose url matches the current path
    const active = sidebarItems.find(item => location.pathname.startsWith(item.url));
    if (active) setSelectedItem(active.label);
  }, [location.pathname]);

  const handleNavigation = (item) => {
    setSelectedItem(item.label);
    if (onNavigate) onNavigate(item.url);
    if (isMobile) setMobileOpen(false);
  };

  const handleSublistToggle = (label) => {
    setOpenSublist((prev) => (prev === label ? null : label)); // Toggle sublist
  };

  const toggleMobileDrawer = () => {
    dispatch(setExpanded(!expanded));
    setMobileOpen(!mobileOpen);
  };

  const region = useSelector((state) => state.onboarding.region);
  const adminFlag = useSelector((state) => state.auth.adminFlag);

  const sidebarItems = [
    { label: "Dashboard", icon: <img src="/v2/sidebar/dashboard.svg" width={30} alt="Dashboard" />, url: "/dashboard" },
    { label: "Accounts", icon: <img src="/v2/sidebar/accounts.svg" width={30} alt="Accounts" />, url: "/accounts" },
    { label: "Transactions", icon: <img src="/v2/sidebar/payments.svg" width={30} alt="Transactions" />, url: "/transactions" },
    { label: "Cards", icon: <img src="/v2/sidebar/card.svg" width={30} alt="Cards" />, url: "/cards" },
    { label: "Settings", icon: <img src="/v2/sidebar/settings.svg" width={30} alt="Settings" />, url: "/settings" },
  ];

  return (
    <>
      {/* Mobile Navbar */}
      {isMobile && (
        <Box
          sx={{
            position: "sticky",
            top: 0,
            width: "100%",
            background: "lightgrey",
            padding: "0.5rem 1rem",
          }}
        >
          <IconButton onClick={toggleMobileDrawer}>
            <Menu fontSize="large" />
          </IconButton>
        </Box>
      )}

      {/* Sidebar (Permanent for Desktop, Temporary for Mobile) */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={isMobile ? toggleMobileDrawer : undefined}
        onMouseEnter={() => dispatch(setExpanded(true))}
        onMouseLeave={() => {
          dispatch(setExpanded(false));
          setOpenSublist(null); // Collapse all sublists when sidebar loses focus
        }}
        sx={{
          width: expanded ? expandedWidth : collapsedWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: expanded ? expandedWidth : collapsedWidth,
            boxSizing: "border-box",
            backgroundColor: "#A4B7C5",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            transition: "width 0.5s ease",
            overflowX: "hidden",
          },
          pointerEvents: dashboardLoading ? "none" : "auto",
          opacity: dashboardLoading ? 0.5 : 1,
        }}
      >
        {/* Logo Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: expanded ? "center" : "start",
            padding: `3rem ${expanded ? "2rem" : "0"}`,
          }}
        >
          <img
            src="/logo-zoqq-final01-1.svg"
            alt="Logo"
            style={{
              transition: "opacity 0.5s ease",
              width: expanded ? "auto" : "100%",
              transform: expanded ? "" : "scale(0.75)",
            }}
          />
        </div>

        {/* Navigation List */}
        <List sx={{ flexGrow: 1 }}>
          {sidebarItems.map((item) => (
            <React.Fragment key={item.label}>
              <ListItemButton
                onClick={() =>
                  item.subItems
                    ? handleSublistToggle(item.label)
                    : handleNavigation(item)
                }
                sx={{
                  my: 1,
                  borderRadius: 20,
                  mx: expanded ? 2 : "auto",
                  backgroundColor:
                    selectedItem === item.label ? "yellow" : "transparent",
                  "&:hover": {
                    backgroundColor:
                      selectedItem === item.label ? "yellow" : "#d8e1e8",
                  },
                  justifyContent: expanded ? "flex-start" : "center",
                  width: expanded ? "auto" : 40,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "black",
                    minWidth: expanded ? 40 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {expanded && (
                  <>
                    <ListItemText
                      primary={
                        <Typography sx={{ fontWeight: 500, color: "black" }}>
                          {item.label}
                        </Typography>
                      }
                    />
                    {item.subItems &&
                      (openSublist === item.label ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      ))}
                  </>
                )}
              </ListItemButton>

              {/* Sublist Items */}
              {item.subItems && (
                <Collapse
                  in={openSublist === item.label}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItemButton
                        key={subItem.label}
                        onClick={() => handleNavigation(subItem)}
                        sx={{
                          pl: expanded ? 6 : 2,
                          mx: expanded ? 2 : "auto",
                          borderRadius: 20,
                          backgroundColor:
                            selectedItem === subItem.label
                              ? "yellow"
                              : "transparent",
                          "&:hover": {
                            backgroundColor:
                              selectedItem === subItem.label
                                ? "yellow"
                                : "#d8e1e8",
                          },
                          justifyContent: expanded ? "flex-start" : "center",
                          width: expanded ? "auto" : 40,
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: "black",
                            minWidth: expanded ? 15 : "auto",
                            justifyContent: "center",
                          }}
                        >
                          {subItem.icon}
                        </ListItemIcon>
                        {expanded && (
                          <ListItemText
                            primary={
                              <Typography
                                sx={{
                                  color: "black",
                                  fontSize: 12,
                                  paddingLeft: 1,
                                  fontWeight: 600,
                                }}
                              >
                                {subItem.label}
                              </Typography>
                            }
                          />
                        )}
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>

        <Divider />

        {/* Logout Button at Bottom */}
        <Box sx={{ py: 2 }}>
          <ListItemButton
            onClick={logout}
            sx={{
              mb: 1,
              borderRadius: 20,
              mx: expanded ? 2 : "auto",
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "#d8e1e8",
              },
              justifyContent: expanded ? "flex-start" : "center",
              width: expanded ? "auto" : 40,
            }}
          >
            <ListItemIcon sx={{ justifyContent: "center" }}>
              <Logout sx={{ color: "black" }} />
            </ListItemIcon>
            {expanded && (
              <ListItemText
                primary={
                  <Typography sx={{ fontWeight: 500 }}>Log Out</Typography>
                }
              />
            )}
          </ListItemButton>
        </Box>
      </Drawer>
    </>
  );
};

export default SidebarComponent;

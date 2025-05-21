import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Animated,
} from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { ArrowRightLeft, QrCode } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import QRCode from "react-native-qrcode-svg";
import { WebView } from "react-native-webview";

type ProcessStatus = "pending" | "completed" | "failed";

export default function PaymentInterface() {
  const { item } = useLocalSearchParams();
  const data = typeof item === "string" ? JSON.parse(item) : null;

  const [activeTab, setActiveTab] = useState<"qr" | "transfer">("qr");
  const [processStatus, setProcessStatus] = useState<ProcessStatus>("pending");

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
  };
  const handleNavigation = (navState: any) => {
    const url = navState.url;
    console.log("Navigated to:", url);

    if (url.startsWith("liveboatapp://payment-success")) {
      console.log("Payment successful");
      setProcessStatus("completed");
      router.replace("(tabs)/donation/DonationSuccessful");
    } else if (url.startsWith("liveboatapp://payment-cancel")) {
      setProcessStatus("failed");
      router.back();
    }
  };

  console.log("data", data.paymentLinkResponse.checkoutUrl);
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: data.paymentLinkResponse.checkoutUrl }}
        onNavigationStateChange={handleNavigation}
        className="w-0 h-0 opacity-0"
      />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "qr" ? styles.activeTab : styles.inactiveTab,
          ]}
          onPress={() => setActiveTab("qr")}
        >
          <QrCode size={16} color={activeTab === "qr" ? "#000" : "#888"} />
          <Text
            style={[
              styles.tabText,
              activeTab === "qr" ? styles.activeText : styles.inactiveText,
            ]}
          >
            Scan QR Code
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "transfer" ? styles.activeTab : styles.inactiveTab,
          ]}
          onPress={() => setActiveTab("transfer")}
        >
          <ArrowRightLeft
            size={16}
            color={activeTab === "transfer" ? "#000" : "#888"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "transfer"
                ? styles.activeText
                : styles.inactiveText,
            ]}
          >
            Bank Transfer
          </Text>
        </TouchableOpacity>
      </View>

      {/* QR Tab */}
      {activeTab === "qr" && (
        <View style={styles.qrContainer}>
          <View style={styles.qrBox}>
            <Image
              source={{ uri: "https://via.placeholder.com/256" }}
              style={styles.qrImage}
            />
            <View style={styles.qrOverlay}>
              <QRCode
                value={
                  data?.paymentLinkResponse.qrCode || "https://example.com"
                }
                size={250}
                logo={require("../../../assets/images/logoDonation.png")}
                logoSize={50}
                logoBackgroundColor="transparent"
              />
            </View>
          </View>
          {/* Payment Method Logos */}
          <View style={styles.logoRow}>
            <Text style={[styles.logoText, { color: "#EF4444" }]}>
              Scan QR to donate
            </Text>
          </View>
        </View>
      )}

      {/* Transfer Tab */}
      {activeTab === "transfer" && (
        <View style={styles.transferContainer}>
          <Text style={styles.name}>
            {data?.paymentLinkResponse.accountName || "VAN THI BACH DUONG"}
          </Text>
          <View style={styles.bankRow}>
            <View style={styles.bankBadge}>
              <Text style={styles.bankText}>
                {data?.paymentLinkResponse.bankCode || "OCB"}
              </Text>
            </View>
            <Text style={styles.bankName}>
              {data?.paymentLinkResponse.bankName ||
                "Joint Stock Commercial Bank for Investment and Development of Vietnam"}
            </Text>
          </View>

          {[
            {
              label: "Account Number",
              value:
                data?.paymentLinkResponse.accountNumber || "V3CAS8884213154",
            },
            {
              label: "Amount",
              value: `${
                data?.paymentLinkResponse.amount?.toLocaleString() || "10,000"
              } VND`,
            },
            {
              label: "Message",
              value:
                data?.paymentLinkResponse.description || "CSDL5FWNAO7 654466",
            },
          ].map(({ label, value }) => (
            <View style={styles.row} key={label}>
              <View>
                <Text style={styles.label}>{label}:</Text>
                <Text style={styles.value}>{value}</Text>
              </View>
              <TouchableOpacity
                onPress={() => copyToClipboard(value)}
                style={styles.copyButton}
              >
                <Text style={styles.copyText}>Copy</Text>
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.notice}>
            <View style={styles.noticeIcon}>
              <Text style={{ color: "#fff" }}>i</Text>
            </View>
            <Text style={styles.noticeText}>
              <Text style={styles.noticeBold}>Note: </Text>
              <Text style={styles.noticeText}>Enter the exact amount </Text>
              <Text style={styles.noticeBold}>
                {data?.paymentLinkResponse.amount?.toLocaleString() || "10,000"}{" "}
                VND
              </Text>
              <Text style={styles.noticeText}>, message </Text>
              <Text style={styles.noticeBold}>
                {data?.paymentLinkResponse.description || "CSDL5FWNAO7 654466"}
              </Text>
              <Text style={styles.noticeText}> when making the transfer</Text>
            </Text>
          </View>
        </View>
      )}

      {/* Process Status Indicator */}
      <View style={styles.statusContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              processStatus === "pending" && styles.progressPending,
              processStatus === "completed" && styles.progressCompleted,
              processStatus === "failed" && styles.progressFailed,
            ]}
          />
        </View>
        <View style={styles.statusRow}>
          {processStatus === "pending" && (
            <>
              <Text style={styles.statusIcon}>⏰</Text>
              <Text style={styles.statusText}>Processing payment...</Text>
            </>
          )}
          {processStatus === "completed" && (
            <>
              <Text style={styles.statusIcon}>✅</Text>
              <Text style={styles.statusText}>Payment successful</Text>
            </>
          )}
          {processStatus === "failed" && (
            <>
              <Text style={styles.statusIcon}>⚠️</Text>
              <Text style={styles.statusText}>Payment failed</Text>
            </>
          )}
        </View>
        {/* Demo Buttons (Remove in Production) */}
        <View style={styles.demoButtons}>
          <TouchableOpacity
            onPress={() => setProcessStatus("pending")}
            style={[styles.demoButton, styles.pendingButton]}
          >
            <Text style={styles.demoButtonText}>Pending</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "white",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  tabText: {
    fontSize: 14,
  },
  activeTab: {
    backgroundColor: "#fff",
  },
  inactiveTab: {
    backgroundColor: "#f5f5f5",
  },
  activeText: {
    color: "#333",
  },
  inactiveText: {
    color: "#999",
  },
  qrContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  qrBox: {
    borderWidth: 2,
    borderColor: "black",
    padding: 8,
    marginBottom: 24,
  },
  qrImage: {
    width: 256,
    height: 256,
  },
  qrOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  heart: {
    fontSize: 24,
    color: "#EF4444",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 32,
  },
  logoText: {
    fontWeight: "bold",
  },
  transferContainer: {
    marginTop: 8,
  },
  name: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
    color: "#333",
  },
  bankRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  bankBadge: {
    backgroundColor: "#0d9488",
    padding: 4,
    borderRadius: 999,
  },
  bankText: {
    color: "#fff",
    fontSize: 10,
  },
  bankName: {
    fontSize: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    color: "#666",
    fontSize: 12,
  },
  value: {
    fontWeight: "600",
  },
  copyButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  copyText: {
    fontSize: 12,
    color: "#555",
  },
  notice: {
    backgroundColor: "#fef2f2",
    flexDirection: "row",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  noticeIcon: {
    backgroundColor: "#EB4747",
    width: 24,
    height: 24,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  noticeText: {
    fontSize: 12,
    flex: 1,
    flexWrap: "wrap",
  },
  noticeBold: {
    fontWeight: "600",
  },
  statusContainer: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 16,
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
    height: 10,
    backgroundColor: "#e5e7eb",
    borderRadius: 999,
    marginBottom: 16,
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  progressPending: {
    backgroundColor: "#FBBF24",
    width: "66%",
  },
  progressCompleted: {
    backgroundColor: "#22C55E",
    width: "100%",
  },
  progressFailed: {
    backgroundColor: "#EF4444",
    width: "50%",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusIcon: {
    fontSize: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  demoButtons: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  demoButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  pendingButton: {
    backgroundColor: "#fefce8",
  },
  completedButton: {
    backgroundColor: "#f0fdf4",
  },
  failedButton: {
    backgroundColor: "#fef2f2",
  },
  demoButtonText: {
    fontSize: 12,
    color: "#444",
  },
});

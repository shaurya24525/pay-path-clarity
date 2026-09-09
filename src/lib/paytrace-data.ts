// Seeded demo data for the PAYTRACE prototype.
// Shaped so a real API could replace these loaders later without UI changes.

export type TrustStatus = "CLEAR" | "REVIEW" | "PAUSE";

export interface PaymentLeg {
  amount: number;
  label: string;
  sublabel: string;
  today?: boolean;
}

export interface Provider {
  name: string;
  verified: boolean;
  registryNote: string;
  support: string;
}

export interface TransactionPreview {
  id: string;
  merchant: string;
  productName: string;
  headlinePrice: string;
  purchaseAmount: number;
  paidToday: number;
  legs: PaymentLeg[];
  totalPayable: number;
  status: TrustStatus;
  statusMessage: string;
  extraAmount?: number;
  provider: Provider;
  feesDisclosed: boolean;
  refundInfo: boolean;
  findings?: string[];
  sourceUrl?: string;
}

export const STATUS_COPY: Record<TrustStatus, string> = {
  CLEAR: "No critical issue detected.",
  REVIEW: "Something needs your attention.",
  PAUSE: "A material inconsistency or missing information was found.",
};

export const VERIFICATION_CHECKS = [
  "Provider identified",
  "Payment amount identified",
  "Future payments identified",
  "Fees checked",
  "Refund terms found",
  "Support information found",
];

export const headphonesTransaction: TransactionPreview = {
  id: "PT-84932",
  merchant: "Aurel Audio",
  productName: "Premium Wireless Headphones",
  headlinePrice: "₹2,000",
  purchaseAmount: 2000,
  paidToday: 500,
  legs: [
    { amount: 500, label: "Today", sublabel: "Paid at checkout", today: true },
    { amount: 750, label: "Oct 6", sublabel: "Installment 1" },
    { amount: 750, label: "Nov 6", sublabel: "Installment 2" },
  ],
  totalPayable: 2000,
  status: "CLEAR",
  statusMessage: STATUS_COPY.CLEAR,
  provider: {
    name: "XYZ Pay",
    verified: true,
    registryNote: "Demo provider registry — not a real regulatory integration.",
    support: "support@xyzpay.demo",
  },
  feesDisclosed: true,
  refundInfo: true,
};

export const trustBreakerTransaction: TransactionPreview = {
  id: "PT-84933",
  merchant: "StreamKit Pro",
  productName: "Annual Device Plan",
  headlinePrice: "₹499/month",
  purchaseAmount: 1500,
  paidToday: 499,
  legs: [
    { amount: 499, label: "Today", sublabel: "First month", today: true },
    { amount: 499, label: "Oct 6", sublabel: "Month 2" },
    { amount: 499, label: "Nov 6", sublabel: "Month 3" },
    { amount: 153, label: "Nov 6", sublabel: "Processing & platform fees" },
  ],
  totalPayable: 1650,
  extraAmount: 150,
  status: "PAUSE",
  statusMessage: STATUS_COPY.PAUSE,
  provider: {
    name: "QuickCredit",
    verified: true,
    registryNote: "Demo provider registry — not a real regulatory integration.",
    support: "help@quickcredit.demo",
  },
  feesDisclosed: false,
  refundInfo: false,
};

export const returnScenarioSteps = [
  "Return requested",
  "Merchant processes return",
  "Refund initiated",
  "Payment plan updated",
  "Future payments reduced / cancelled",
];

export const missedPaymentScenario = {
  heading: "Missed payment scenario",
  guidance:
    "Applicable consequences should be taken directly from the provider's supplied terms.",
  demoTerms:
    "Payment may become overdue and the provider may contact you regarding repayment.",
};

export const dataLensItems = [
  {
    label: "Phone Number",
    required: true,
    purpose: "Account verification",
  },
  {
    label: "Transaction Data",
    required: true,
    purpose: "Payment processing",
  },
  {
    label: "Location",
    required: false,
    purpose: "Not required for this transaction",
  },
];

export const intelligenceData = {
  transactionsAnalysed: "2.4M",
  distribution: [
    { status: "CLEAR" as TrustStatus, percent: 89 },
    { status: "REVIEW" as TrustStatus, percent: 8 },
    { status: "PAUSE" as TrustStatus, percent: 3 },
  ],
  topIssues: [
    { label: "Cost Transparency", cases: 41203 },
    { label: "Refund Clarity", cases: 18920 },
    { label: "Provider Identity", cases: 12201 },
  ],
  monthly: [
    { month: "Apr", clear: 86, review: 10, pause: 4 },
    { month: "May", clear: 87, review: 9, pause: 4 },
    { month: "Jun", clear: 88, review: 9, pause: 3 },
    { month: "Jul", clear: 88, review: 8, pause: 4 },
    { month: "Aug", clear: 89, review: 8, pause: 3 },
    { month: "Sep", clear: 89, review: 8, pause: 3 },
  ],
};

export const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

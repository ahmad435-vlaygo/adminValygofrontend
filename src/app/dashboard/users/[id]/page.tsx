"use client"
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { ArrowLeft, Download } from "lucide-react";
import styled from "styled-components";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";

const PageHeader = styled(Box)`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
`;

const DetailCard = styled(Card)`
  background: #1a1f4d !important;
  border: 1px solid #00C2FF;
  border-radius: 12px;
`;

const DetailRow = styled(Box)`
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid #2a2f5d;

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled(Typography)`
  color: #00C2FF;
  font-weight: 600;
`;

const Value = styled(Typography)`
  color: #ffffff;
`;

const StyledTable = styled(TableContainer)`
  & .MuiTable-root {
    color: #ffffff;
  }
  & .MuiTableHead-root {
    background: #0b0f33;
  }
  & .MuiTableCell-head {
    color: #00C2FF;
    font-weight: 600;
    border-bottom: 1px solid #00C2FF;
  }
  & .MuiTableCell-body {
    border-bottom: 1px solid #2a2f5d;
  }
`;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);

  // Mock user data
  const user = {
    id: params.id,
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    status: "Active",
    joinDate: "2024-01-15",
    kycStatus: "Verified",
    kycDate: "2024-01-20",
    accounts: [
      { type: "USD Account", status: "Active", balance: "$5,234.50" },
      { type: "EUR Account", status: "Active", balance: "€3,120.00" },
      { type: "Crypto Wallet", status: "Active", balance: "2.5 BTC" },
    ],
    subscriptions: [
      {
        id: 1,
        plan: "Professional",
        status: "Active",
        startDate: "2024-01-15",
        nextBillingDate: "2024-04-15",
        amount: "$29.99/month",
      },
      {
        id: 2,
        plan: "Premium Add-on",
        status: "Active",
        startDate: "2024-02-01",
        nextBillingDate: "2024-03-01",
        amount: "$9.99/month",
      },
    ],
    vyoBalance: 1500,
    lockedDeposit: "$2,000.00",
    nextBillingDate: "2024-04-15",
  };

  const transactions = [
    {
      id: 1,
      type: "Deposit",
      amount: "$1,000",
      date: "2024-03-10",
      status: "Completed",
    },
    {
      id: 2,
      type: "Withdrawal",
      amount: "$500",
      date: "2024-03-08",
      status: "Completed",
    },
    {
      id: 3,
      type: "Transfer",
      amount: "$250",
      date: "2024-03-05",
      status: "Completed",
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader>
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => router.back()}
          sx={{ color: "#00C2FF" }}
        >
          Back
        </Button>
        <Box>
          <Typography variant="h2" sx={{ color: "#ffffff" }}>
            {user.name}
          </Typography>
          <Typography variant="body2" sx={{ color: "#00C2FF" }}>
            User ID: {user.id}
          </Typography>
        </Box>
      </PageHeader>

      {/* User Overview */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3, marginBottom: 4 }}>
        <DetailCard>
          <CardContent>
            <Typography variant="h5" sx={{ color: "#ffffff", marginBottom: 2 }}>
              Personal Information
            </Typography>
            <DetailRow>
              <Label>Email</Label>
              <Value>{user.email}</Value>
            </DetailRow>
            <DetailRow>
              <Label>Phone</Label>
              <Value>{user.phone}</Value>
            </DetailRow>
            <DetailRow>
              <Label>Status</Label>
              <Chip label={user.status} color="success" size="small" />
            </DetailRow>
            <DetailRow>
              <Label>Join Date</Label>
              <Value>{user.joinDate}</Value>
            </DetailRow>
          </CardContent>
        </DetailCard>

        <DetailCard>
          <CardContent>
            <Typography variant="h5" sx={{ color: "#ffffff", marginBottom: 2 }}>
              KYC & Account Status
            </Typography>
            <DetailRow>
              <Label>KYC Status</Label>
              <Chip label={user.kycStatus} color="success" size="small" />
            </DetailRow>
            <DetailRow>
              <Label>KYC Date</Label>
              <Value>{user.kycDate}</Value>
            </DetailRow>
            <DetailRow>
              <Label>VYO Balance</Label>
              <Value sx={{ color: "#00C2FF", fontWeight: 600 }}>
                {user.vyoBalance} VYO
              </Value>
            </DetailRow>
            <DetailRow>
              <Label>Locked Deposit</Label>
              <Value>{user.lockedDeposit}</Value>
            </DetailRow>
            <DetailRow>
              <Label>Next Billing Date</Label>
              <Value>{user.nextBillingDate}</Value>
            </DetailRow>
          </CardContent>
        </DetailCard>
      </Box>

      {/* Tabs Section */}
      <DetailCard>
        <Box sx={{ borderBottom: 1, borderColor: "#2a2f5d" }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            sx={{
              "& .MuiTab-root": { color: "#ffffff" },
              "& .Mui-selected": { color: "#00C2FF" },
              "& .MuiTabs-indicator": { backgroundColor: "#00C2FF" },
            }}
          >
            <Tab label="Accounts" />
            <Tab label="Subscriptions" />
            <Tab label="Transactions" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <StyledTable>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Account Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Balance</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {user.accounts.map((account, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ color: "#ffffff" }}>{account.type}</TableCell>
                    <TableCell>
                      <Chip label={account.status} color="success" size="small" />
                    </TableCell>
                    <TableCell sx={{ color: "#00C2FF", fontWeight: 600 }}>
                      {account.balance}
                    </TableCell>
                    <TableCell align="right">
                      <Button size="small" sx={{ color: "#00C2FF" }}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTable>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <StyledTable>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Plan</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Next Billing</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {user.subscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell sx={{ color: "#ffffff" }}>{sub.plan}</TableCell>
                    <TableCell>
                      <Chip label={sub.status} color="success" size="small" />
                    </TableCell>
                    <TableCell sx={{ color: "#ffffff" }}>{sub.amount}</TableCell>
                    <TableCell sx={{ color: "#ffffff" }}>{sub.nextBillingDate}</TableCell>
                    <TableCell align="right">
                      <Button size="small" sx={{ color: "#00C2FF" }}>
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTable>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <StyledTable>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell sx={{ color: "#ffffff" }}>{tx.type}</TableCell>
                    <TableCell sx={{ color: "#00C2FF", fontWeight: 600 }}>
                      {tx.amount}
                    </TableCell>
                    <TableCell sx={{ color: "#ffffff" }}>{tx.date}</TableCell>
                    <TableCell>
                      <Chip label={tx.status} color="success" size="small" />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        startIcon={<Download size={16} />}
                        sx={{ color: "#00C2FF" }}
                      >
                        Receipt
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTable>
        </TabPanel>
      </DetailCard>
    </DashboardLayout>
  );
}

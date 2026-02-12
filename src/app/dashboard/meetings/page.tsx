"use client"
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Chip,
  Grid,
  Avatar,
  AvatarGroup,
} from "@mui/material";
import { Plus, Calendar, Clock, Users, Video } from "lucide-react";
import styled from "styled-components";
import DashboardLayout from "@/components/DashboardLayout";

const PageHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const MeetingCard = styled(Card)`
  background: #1a1f4d !important;
  border: 1px solid #00C2FF;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 194, 255, 0.2);
  }
`;

const StatusBadge = styled(Chip)<{ status: string }>`
  && {
    background: ${props => {
      switch (props.status) {
        case 'scheduled': return '#00C2FF';
        case 'ongoing': return '#004C00';
        case 'completed': return '#999999';
        case 'cancelled': return '#D32F2F';
        default: return '#00C2FF';
      }
    }} !important;
    color: #ffffff !important;
  }
`;

const mockMeetings = [
  {
    id: 1,
    title: "Team Standup",
    description: "Daily team sync-up meeting",
    startTime: "2024-03-15 10:00 AM",
    endTime: "2024-03-15 10:30 AM",
    attendees: ["Sarah Admin", "Mike Manager", "Lisa Support"],
    status: "scheduled",
    meetingLink: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: 2,
    title: "Sales Strategy Review",
    description: "Q1 sales performance review",
    startTime: "2024-03-15 2:00 PM",
    endTime: "2024-03-15 3:00 PM",
    attendees: ["Sarah Admin", "Tom Analyst"],
    status: "ongoing",
    meetingLink: "https://meet.google.com/xyz-uvwx-yz",
  },
  {
    id: 3,
    title: "Client Presentation",
    description: "New feature demo for client",
    startTime: "2024-03-14 3:00 PM",
    endTime: "2024-03-14 4:00 PM",
    attendees: ["Sarah Admin", "Mike Manager", "Lisa Support", "Tom Analyst"],
    status: "completed",
    meetingLink: "https://meet.google.com/klm-nopq-rst",
  },
];

export default function MeetingsPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [meetings, setMeetings] = useState(mockMeetings);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    meetingLink: "",
  });

  const handleAddMeeting = () => {
    setFormData({
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      meetingLink: "",
    });
    setOpenDialog(true);
  };

  const handleSaveMeeting = () => {
    if (formData.title && formData.startTime) {
      const newMeeting = {
        id: meetings.length + 1,
        ...formData,
        attendees: [],
        status: "scheduled",
      };
      setMeetings([...meetings, newMeeting]);
      setOpenDialog(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "info";
      case "ongoing":
        return "success";
      case "completed":
        return "default";
      case "cancelled":
        return "error";
      default:
        return "info";
    }
  };

  return (
    <DashboardLayout>
      <PageHeader>
        <Box>
          <Typography variant="h2" sx={{ color: "#ffffff", marginBottom: 1 }}>
            Meetings
          </Typography>
          <Typography variant="body2" sx={{ color: "#00C2FF" }}>
            Schedule and manage team meetings
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={handleAddMeeting}
          sx={{
            background: "linear-gradient(to top, #013800, #004C00)",
            textTransform: "none",
            borderRadius: "8px",
          }}
        >
          Schedule Meeting
        </Button>
      </PageHeader>

      <Grid container spacing={3}>
        {meetings.map((meeting) => (
          <Grid item xs={12} md={6} key={meeting.id}>
            <MeetingCard>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                  <Typography variant="h5" sx={{ color: "#ffffff" }}>
                    {meeting.title}
                  </Typography>
                  <StatusBadge label={meeting.status} status={meeting.status} />
                </Box>

                <Typography variant="body2" sx={{ color: "#999999", marginBottom: 2 }}>
                  {meeting.description}
                </Typography>

                <Box sx={{ display: "flex", gap: 2, marginBottom: 2, flexWrap: "wrap" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Calendar size={16} color="#00C2FF" />
                    <Typography variant="caption" sx={{ color: "#ffffff" }}>
                      {meeting.startTime}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Clock size={16} color="#00C2FF" />
                    <Typography variant="caption" sx={{ color: "#ffffff" }}>
                      {meeting.endTime}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ marginBottom: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: 1 }}>
                    <Users size={16} color="#00C2FF" />
                    <Typography variant="caption" sx={{ color: "#00C2FF" }}>
                      Attendees
                    </Typography>
                  </Box>
                  <AvatarGroup max={3}>
                    {meeting.attendees.map((attendee, idx) => (
                      <Avatar
                        key={idx}
                        sx={{
                          background: "linear-gradient(135deg, #004C00 0%, #00C2FF 100%)",
                          width: 32,
                          height: 32,
                        }}
                      >
                        {attendee.charAt(0)}
                      </Avatar>
                    ))}
                  </AvatarGroup>
                </Box>

                <Box sx={{ display: "flex", gap: 2 }}>
                  {meeting.meetingLink && (
                    <Button
                      variant="outlined"
                      startIcon={<Video size={16} />}
                      href={meeting.meetingLink}
                      target="_blank"
                      sx={{ color: "#00C2FF", borderColor: "#00C2FF", flex: 1 }}
                    >
                      Join
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    sx={{ color: "#00C2FF", borderColor: "#00C2FF", flex: 1 }}
                  >
                    Edit
                  </Button>
                </Box>
              </CardContent>
            </MeetingCard>
          </Grid>
        ))}
      </Grid>

      {/* Add Meeting Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            background: "#1a1f4d",
            border: "1px solid #00C2FF",
          },
        }}
      >
        <DialogTitle sx={{ color: "#ffffff" }}>Schedule New Meeting</DialogTitle>
        <DialogContent sx={{ color: "#ffffff", minWidth: 500 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 2 }}>
            <TextField
              label="Meeting Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#ffffff",
                  "& fieldset": {
                    borderColor: "#00C2FF",
                  },
                },
              }}
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#ffffff",
                  "& fieldset": {
                    borderColor: "#00C2FF",
                  },
                },
              }}
            />
            <TextField
              label="Start Time"
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#ffffff",
                  "& fieldset": {
                    borderColor: "#00C2FF",
                  },
                },
              }}
            />
            <TextField
              label="End Time"
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#ffffff",
                  "& fieldset": {
                    borderColor: "#00C2FF",
                  },
                },
              }}
            />
            <TextField
              label="Meeting Link"
              value={formData.meetingLink}
              onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#ffffff",
                  "& fieldset": {
                    borderColor: "#00C2FF",
                  },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: "#ffffff" }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveMeeting}
            variant="contained"
            sx={{
              background: "linear-gradient(to top, #013800, #004C00)",
            }}
          >
            Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

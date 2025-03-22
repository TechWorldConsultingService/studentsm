import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert, TouchableOpacity, Modal, TextInput, Button } from "react-native";
import Animated from "react-native-reanimated";
import axios from "axios";
import moment from "moment";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import SafeScreen from "@/src/components/SafeScreen/SafeScreen";
import CustomButton from "@/src/components/Buttons/Button";
import { appStrings } from "@/src/data/string";
// Define Leave type
interface Leave {
  id: string;
  applied_on: string;
  leave_date: string;
  message: string;
  status: string;
  updated_at: string;
}

const api = axios.create({
  baseURL: "https://akash2222.pythonanywhere.com/api/",
});

const MyLeaves = () => {
  const access = useSelector((state: RootState) => state.user.access);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [leaveData, setLeaveData] = useState<Leave[]>([]);
  const [newRequests, setNewRequests] = useState<Leave[]>([]);
  const [updatedRequests, setUpdatedRequests] = useState<Leave[]>([]);
  const [showApplyModal, setShowApplyModal] = useState<boolean>(false);
  const [leaveDate, setLeaveDate] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  console.log('data', leaveData)
  const fetchLeaveData = useCallback(async () => {
    if (!access) return;
    try {
      setIsLoading(true);
      const res = await api.get("/", {
        headers: { Authorization: `Bearer ${access}` },
      });
      const data: Leave[] = res.data;
      const pending = data.filter((item) => item.status === "Pending");
      const reviewed = data
        .filter((item) => item.status !== "Pending")
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      setLeaveData(data);
      setNewRequests(pending);
      setUpdatedRequests(reviewed);
    } catch (err) {
      Toast.show({ type: "error", text1: "Error fetching leave data." });
    } finally {
      setIsLoading(false);
    }
  }, [access]);

  useEffect(() => {
    fetchLeaveData();
  }, [fetchLeaveData]);

  const handleApplyLeave = async () => {
    if (!access || !leaveDate || !message) return;
    try {
      await api.post("/create/", { leave_date: leaveDate, message }, {
        headers: { Authorization: `Bearer ${access}` },
      });
      Toast.show({ type: "success", text1: "Leave applied successfully." });
      setShowApplyModal(false);
      fetchLeaveData();
    } catch (err) {
      Toast.show({ type: "error", text1: "Error applying leave." });
    }
  };
  const handleDeleteLeave = async (id: string) => {
    if (!access) return;

    // Show confirmation alert
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this leave request?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              // Optimistically remove item from the UI immediately after the confirmation
              setLeaveData((prevData) => prevData.filter((item) => item.id !== id));
              setNewRequests((prevData) => prevData.filter((item) => item.id !== id));
              setUpdatedRequests((prevData) => prevData.filter((item) => item.id !== id));

              setIsLoading(true);
              await api.delete(`/${id}/`, { headers: { Authorization: `Bearer ${access}` } });

              // Show success toast
              Toast.show({ type: "success", text1: "Leave deleted successfully." });
            } catch (err) {
              // Rollback the optimistic UI update if the deletion failed
              // setLeaveData((prevData) => [...prevData, { id, message: err.message }]);
              // setNewRequests((prevData) => [...prevData, { id, message: err.message }]);
              // setUpdatedRequests((prevData) => [...prevData, { id, message: err.message }]);

              Toast.show({ type: "error", text1: "Failed to delete leave." });
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <>
      {/* Apply Leave Modal */}
      <Modal visible={showApplyModal} animationType="slide" transparent={true} onRequestClose={() => setShowApplyModal(false)}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <View style={{ width: 300, padding: 20, backgroundColor: "white", borderRadius: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>{appStrings.applyForLeave}</Text>
            <TextInput
              value={leaveDate}
              onChangeText={setLeaveDate}
              placeholder="Leave Date"
              style={{ borderBottomWidth: 1, marginBottom: 10, padding: 5 }}
            />
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Message"
              style={{ borderBottomWidth: 1, marginBottom: 10, padding: 5 }}
            />
            <Button title="Apply" onPress={handleApplyLeave} />
            <Button title="Cancel" onPress={() => setShowApplyModal(false)} />
          </View>
        </View>
      </Modal>
      <SafeScreen>
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#4A148C", marginBottom: 10 }}>My Leaves</Text>
          {isLoading ? (
            <ActivityIndicator size="large" color="#6200EA" />
          ) : (
            <>
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "#4A148C", marginBottom: 5 }}>
                {appStrings.myPendingRequest}
              </Text>

              {newRequests.length === 0 ? (
                <Text>{appStrings.noMorePendingRequest}</Text>
              ) : (
                <FlatList
                  data={newRequests}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={{ backgroundColor: "white", padding: 10, marginBottom: 10, borderRadius: 5 }}>
                      <Text style={{ fontWeight: "bold" }}>{`${appStrings.leaveDate}: ${moment(item.leave_date).format("YYYY-MM-DD")}`}</Text>
                      <Text>{`${appStrings.message}: ${item.message}`}</Text>
                      <Text>{`${appStrings.status}: ${item.status}`}</Text>
                      <TouchableOpacity onPress={() => handleDeleteLeave(item.id)}>
                        <Text style={{ color: "red" }}>{appStrings.delete}</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              )}

              <Text style={{ fontSize: 18, fontWeight: "bold", color: "#4A148C", marginBottom: 5 }}>
                {appStrings.reviewedRequestsStatus}
              </Text>
              <FlatList
                data={updatedRequests}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={{ backgroundColor: "white", padding: 10, marginBottom: 10, borderRadius: 5 }}>
                    <Text style={{ fontWeight: "bold" }}>{`${appStrings.leaveDate}: ${moment(item.leave_date).format("YYYY-MM-DD")}`}</Text>
                    <Text>{`${appStrings.message}: ${item.message}`}</Text>
                    <Text> {`${appStrings.status}: ${item.status}`}</Text>
                  </View>
                )}
              />
            </>
          )}
          <View style={{ alignItems: 'center' }}>
            <CustomButton onPress={() => {
              {
                setShowApplyModal(true);
              }
            }} buttonText={"Apply For Leave"} />
          </View>

        </View>
      </SafeScreen>
    </>
  );
};

export default MyLeaves;

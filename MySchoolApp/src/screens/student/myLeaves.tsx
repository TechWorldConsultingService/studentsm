import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert, TouchableOpacity, Modal, TextInput, Button } from "react-native";
import Animated from "react-native-reanimated";
import axios from "axios";
import moment from "moment";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

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
  baseURL: "http://192.168.100.7:8000/api/leave-applications/",
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
  
              // Now make the API call to delete the item
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
    <Animated.View style={{ flex: 1, padding: 20, backgroundColor: "#f9f9f9" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "#4A148C", marginBottom: 10 }}>My Leaves</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#6200EA" />
      ) : (
        <>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#4A148C", marginBottom: 5 }}>
            My Pending Requests
          </Text>

          {newRequests.length === 0 ? (
            <Text>No more pending requests</Text>
          ) : (
          <FlatList
            data={newRequests}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ backgroundColor: "white", padding: 10, marginBottom: 10, borderRadius: 5 }}>
                <Text style={{ fontWeight: "bold" }}>Leave Date: {moment(item.leave_date).format("YYYY-MM-DD")}</Text>
                <Text>Message: {item.message}</Text>
                <Text>Status: {item.status}</Text>
                <TouchableOpacity onPress={() => handleDeleteLeave(item.id)}>
                  <Text style={{ color: "red" }}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}

          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#4A148C", marginBottom: 5 }}>
            Reviewed Requests Status
          </Text>
          <FlatList
            data={updatedRequests}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ backgroundColor: "white", padding: 10, marginBottom: 10, borderRadius: 5 }}>
                <Text style={{ fontWeight: "bold" }}>Leave Date: {moment(item.leave_date).format("YYYY-MM-DD")}</Text>
                <Text>Message: {item.message}</Text>
                <Text>Status: {item.status}</Text>
              </View>
            )}
          />
        </>
      )}

      <TouchableOpacity
        onPress={() => setShowApplyModal(true)}
        style={{
          backgroundColor: "#6200EA",
          padding: 15,
          marginTop: 20,
          alignItems: "center",
          borderRadius: 5,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Apply For Leave</Text>
      </TouchableOpacity>

      {/* Apply Leave Modal */}
      <Modal visible={showApplyModal} animationType="slide" transparent={true} onRequestClose={() => setShowApplyModal(false)}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <View style={{ width: 300, padding: 20, backgroundColor: "white", borderRadius: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Apply for Leave</Text>
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
    </Animated.View>
  );
};

export default MyLeaves;


// import React, { useEffect, useState, useCallback } from "react";
// import { View, Text, FlatList, ActivityIndicator, Alert } from "react-native";
// import Animated from "react-native-reanimated";
// import axios from "axios";
// import moment from "moment";
// import { TouchableOpacity } from "react-native";
// import { RootState } from "../../redux/store";
// import { useSelector } from "react-redux";
// import Toast from "react-native-toast-message";
// import { AxiosError } from "axios";


// // Define Leave type
// interface Leave {
//   id: string;
//   applied_on: string;
//   leave_date: string;
//   message: string;
//   status: string;
//   updated_at: string;
// }

// // Create an axios instance for cleaner API calls
// const api = axios.create({
//   baseURL: "http://192.168.100.7:8000/api/leave-applications/",
//   // baseURL:"10.0.2.2:8000/api/leave-applications/",
// });

// const MyLeaves = () => {
//   const access = useSelector((state: RootState) => state.user.access);
//   const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isApplying, setIsApplying] = useState<boolean>(false);
//   const [errorMessage, setErrorMessage] = useState<string>("");
//   const [leaveData, setLeaveData] = useState<Leave[]>([]);
//   const [newRequests, setNewRequests] = useState<Leave[]>([]);
//   const [updatedRequests, setUpdatedRequests] = useState<Leave[]>([]);

//   // Fetch Leave Data
//   const fetchLeaveData = useCallback(async () => {
//     if (!access) {
//       setErrorMessage("User is not authenticated. Please log in.");
//       return;
//     }
//     try {
//       setIsLoading(true);
//       const res = await api.get("/", {
//         // const res = await axios.get("http://localhost:8000/api/leave-applications/", {
//         headers: { Authorization: `Bearer ${access}` },
//       });
//       console.log("res:",res.data);
//       const data: Leave[] = res.data;
//       console.log(data);
//       const pending = data.filter((item) => item.status === "Pending");
//       const reviewed = data
//         .filter((item) => item.status !== "Pending")
//         .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

//       setLeaveData(data);
//       setNewRequests(pending);
//       setUpdatedRequests(reviewed);
//     } catch (err: unknown) {
//       if (axios.isAxiosError(err)) {
//         console.error("API Fetch Error:", err.response ? err.response.data : err.message);
//         setErrorMessage(`Failed to fetch leave data: ${err.message}`);
//       } else {
//         console.error("Unexpected error:", err);
//         setErrorMessage("An unexpected error occurred.");
//       }
    
//     } finally {
//       setIsLoading(false);
//     }
//   }, [access]);

//   useEffect(() => {
//     fetchLeaveData();
//   }, [fetchLeaveData]);

//   // Apply for Leave
//   const handleApplyLeave = async (leave_date: string, message: string) => {
//     if (!access) return;
//     try {
//       setIsApplying(true);
//       await api.post(
//         "/create/",
//         { leave_date, message },
//         { headers: { Authorization: `Bearer ${access}` } }
//       );
//       Toast.show({ type: "success", text1: "Leave applied successfully." });
//       fetchLeaveData();
//     } catch (err) {
//       Toast.show({ type: "error", text1: "Error applying leave." });
//     } finally {
//       setIsApplying(false);
//     }
//   };

//   // Delete Leave Request
//   const handleDeleteLeave = async (id: string) => {
//     if (!access) return;
//     try {
//       setIsLoading(true);
//       await api.delete(`/${id}/`, { headers: { Authorization: `Bearer ${access}` } });
//       Toast.show({ type: "success", text1: "Leave deleted successfully." });
//       fetchLeaveData();
//     } catch (err) {
//       Toast.show({ type: "error", text1: "Failed to delete leave." });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//     <Animated.View style={{ flex: 1, padding: 20, backgroundColor: "#f9f9f9" }}>
//       <Text style={{ fontSize: 24, fontWeight: "bold", color: "#4A148C", marginBottom: 10 }}>My Leaves</Text>

//       {isLoading ? (
//         <ActivityIndicator size="large" color="#6200EA" />
//       ) : errorMessage ? (
//         <Text style={{ color: "red" }}>{errorMessage}</Text>
//       ) : (
//         <>
//           <Text style={{ fontSize: 18, fontWeight: "bold", color: "#4A148C", marginBottom: 5 }}>
//             My Pending Requests
//           </Text>
//           <FlatList
//             data={newRequests}
//             keyExtractor={(item) => item.id}
//             renderItem={({ item }) => (
//               <View style={{ backgroundColor: "white", padding: 15, marginVertical: 5, borderRadius: 10 }}>
//                 <Text>Applied On: {moment(item.applied_on).format("YYYY-MM-DD")}</Text>
//                 <Text>Leave Date: {moment(item.leave_date).format("YYYY-MM-DD")}</Text>
//                 <Text>Message: {item.message}</Text>
//                 <TouchableOpacity onPress={() => handleDeleteLeave(item.id)}>
//                   <Text style={{ color: "red", marginTop: 5 }}>Delete</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => handleDeleteLeave(item.id)}>
//                   <Text style={{ color: "red", marginTop: 5 }}>Delete</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity onPress={() => handleDeleteLeave(item.id)}>
//                   <Text style={{ color: "red", marginTop: 5 }}>Delete</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           />
//         </>
//       )}

//       {isApplying && <ActivityIndicator size="small" color="#6200EA" />}
//     </Animated.View>
//     </>
//   );
// };

// export default MyLeaves;

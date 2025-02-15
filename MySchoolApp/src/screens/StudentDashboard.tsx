import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


const StudentDashboard = () => {
  console.log('i was here');
  return (
    
    <View style={styles.container}>
      <Text style={styles.title}>Student Dashboard</Text>
      {/* teacher-specific UI */}
    </View>
  );

}
export default StudentDashboard
// export default function StudentDashboard() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Student Dashboard</Text>
//       {/* teacher-specific UI */}
//     </View>
//   );
// }

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
});

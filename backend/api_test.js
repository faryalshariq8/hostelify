const API_URL =
  "https://hostelify-production.up.railway.app/api";

let adminToken = "";
let studentToken = "";

async function makeReq(method, path, body, token) {
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const options = {
    method,
    headers,
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const res = await fetch(`${API_URL}${path}`, options);
  const textBody = await res.text();
  let resBody;
  try {
    resBody = JSON.parse(textBody);
  } catch (e) {
    resBody = textBody;
  }
  
  return {
    status: res.status,
    body: resBody
  };
}

async function runTests() {
  console.log("=== Starting API Tests ===");
  
  // 1. Login Admin
  let res = await makeReq("POST", "/auth/login", { email: "admin@hostel.com", password: "123456" });
  if (res.status !== 200) {
    console.error("Admin login failed", res);
    return;
  }
  adminToken = res.body.token;
  console.log("✅ Admin logged in");
  
  // 2. Login Student
  res = await makeReq("POST", "/auth/login", { email: "student1@test.com", password: "password123" });
  if (res.status !== 200) {
    console.error("Student login failed", res);
    return;
  }
  studentToken = res.body.token;
  console.log("✅ Student logged in");

  // Get a hostel
  res = await makeReq("GET", "/hostels", null, studentToken);
  let hostelsList = res.body.hostels || res.body;
  if (res.status !== 200 || !hostelsList.length) {
    console.error("Failed to get hostels", res);
    return;
  }
  const hostelId = hostelsList[0]._id;
  console.log("✅ Fetched hostel:", hostelId);

  // Get an available room
  res = await makeReq("GET", `/rooms?hostel=${hostelId}`, null, adminToken);
  let roomsList = res.body.rooms || res.body;
  let roomId = null;
  if (res.status === 200 && roomsList.length > 0) {
      const availableRoom = roomsList.find(r => r.isAvailable);
      if (availableRoom) roomId = availableRoom._id;
  }
  console.log("✅ Fetched available room:", roomId);

  // 3. Application
  res = await makeReq("POST", "/applications", { hostel: hostelId }, studentToken);
  if (res.status !== 201) {
    console.error("Failed to apply", res);
  }
  console.log("✅ Student applied for hostel", res.body);
  
  // Admin view applications
  res = await makeReq("GET", "/applications", null, adminToken);
  let appsList = res.body.applications || res.body;
  if (res.status !== 200) {
    console.error("Admin view applications failed", res);
  }
  const appId = appsList[0]._id;
  console.log("✅ Admin viewed applications. First ID:", appId);

  // Admin Approve
  res = await makeReq("PUT", `/applications/${appId}/approve`, { roomId }, adminToken);
  if (res.status !== 200) {
    console.error("Admin approve failed", res);
  }
  console.log("✅ Admin approved application:", res.body);

  // 4. Room Allocation (using dashboard)
  res = await makeReq("GET", "/dashboard", null, studentToken); // Assuming /dashboard has allocation
  console.log("✅ Dashboard result:", res.status);
  
  // 5. Fees
  res = await makeReq("POST", "/fees", { hostel: hostelId, roomType: "Single", amount: 16000 }, adminToken);
  console.log("✅ Created Fee Structure:", res.body);

  res = await makeReq("GET", "/fees/my", null, studentToken);
  console.log("✅ View My Fee:", res.body);

  // 6. Payments
  res = await makeReq("POST", "/payments/intent", { amount: 15000 }, studentToken);
  console.log("✅ Stripe Intent:", res.body);

  res = await makeReq("POST", "/payments/pay", { paymentMethod: "Card", amount: 15000, semester: "Fall 2026" }, studentToken);
  console.log("✅ Simulated Payment:", res.body);

  res = await makeReq("GET", "/payments/history", null, studentToken);
  console.log("✅ Payment History:", res.body);

  // 7. Complaints
  res = await makeReq("POST", "/complaints", { title: "WiFi Issue", description: "Slow internet" }, studentToken);
  let complaintId = res.body._id || res.body.complaint?._id;
  console.log("✅ Created Complaint:", res.body);

  if (complaintId) {
    res = await makeReq("PUT", `/complaints/${complaintId}`, { status: "Resolved" }, adminToken);
    console.log("✅ Admin resolved complaint:", res.body);
  }

  res = await makeReq("GET", "/complaints?search=wifi", null, adminToken);
  console.log("✅ Search complaints:", res.body);

  // 8. Announcements
  res = await makeReq("POST", "/announcements", { title: "Test", description: "Desc", targetAudience: "All" }, adminToken);
  let annId = res.body._id || res.body.announcement?._id;
  console.log("✅ Created announcement:", res.body);

  if (annId) {
    res = await makeReq("PUT", `/announcements/${annId}`, { title: "Updated Test" }, adminToken);
    console.log("✅ Edited announcement:", res.body);

    res = await makeReq("DELETE", `/announcements/${annId}`, null, adminToken);
    console.log("✅ Deleted announcement:", res.body);
  }

  // 9. Leave Requests
  res = await makeReq("POST", "/leaves", { startDate: "2026-08-15", endDate: "2026-08-18", reason: "Visit" }, studentToken);
  console.log("✅ Leave Request Submit:", res.body);

  // 10. Visitor Requests
  res = await makeReq("POST", "/visitors", { visitorName: "John", visitDate: "2026-08-15", purpose: "Visit", relation: "Friend" }, studentToken);
  console.log("✅ Visitor Request Submit:", res.body);

  // 11. Room Transfer
  // Need another available room for transfer
  res = await makeReq("GET", `/rooms?hostel=${hostelId}`, null, adminToken);
  let newRoomId = null;
  let newRoomsList = res.body.rooms || res.body;
  if (res.status === 200) {
    const availableRoom = newRoomsList.find(r => r.isAvailable && r._id !== roomId);
    if (availableRoom) newRoomId = availableRoom._id;
  }

  res = await makeReq("POST", "/rooms/transfer", { newRoom: newRoomId }, studentToken);
  console.log("✅ Room Transfer Request:", res.body);
  let transferId = res.body._id || res.body.transfer?._id || res.body.data?._id;

  if (transferId) {
    res = await makeReq("PUT", `/rooms/transfer/${transferId}/approve`, null, adminToken);
    console.log("✅ Approve Room Transfer:", res.body);
  }

  // 12. Reports
  const reports = ["dashboard", "revenue", "occupancy", "complaints", "applications"];
  for (const report of reports) {
    res = await makeReq("GET", `/reports/${report}`, null, adminToken);
    console.log(`✅ Report ${report}:`, res.status);
  }
}

runTests().catch(console.error);

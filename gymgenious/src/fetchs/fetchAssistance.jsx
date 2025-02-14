const convertToArgentinaTime = (timestamp) => {
  const date = new Date(timestamp);

  const argentinaTime = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);

  const [fecha, hora] = argentinaTime.split(', ');

  return { fecha, hora };
};  

const fetchAssistance = async (setOpenCircularProgress,setRows,setWarningConnection) => {
  setOpenCircularProgress(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
          console.error('Token not available in localStorage');
          return;
      }

      const usersRequest = await fetch('https://two024-duplagalactica.onrender.com/get_users', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
      });
      if (!usersRequest.ok) {
          throw new Error('Error fetching users: ' + usersRequest.statusText);
      }
      const users = await usersRequest.json();

      const attendanceRequest = await fetch('https://two024-duplagalactica.onrender.com/get_coach_clients_assistance', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
      });
      if (!attendanceRequest.ok) {
          throw new Error('Error fetching attendance data: ' + attendanceRequest.statusText);
      }
      const attendanceRecords = await attendanceRequest.json();

      const formattedAttendance = attendanceRecords.map(attendance => {
        const client = users.filter(user => user.uid===attendance.uid);
        const clientMail = client[0].Mail;
        const timestampCorrected = convertToArgentinaTime(attendance.timestamp);
          return {
              ...attendance,
              fecha: timestampCorrected['fecha'],
              hora: timestampCorrected['hora'],
              clientMail: clientMail,
          };
      });
      const sortedByDayAndHorAssistance = formattedAttendance.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      console.log("estos sopn los datos",sortedByDayAndHorAssistance)
      setRows(sortedByDayAndHorAssistance);

      
    } catch (error) {
      console.error("Error fetching classes:", error);
      setOpenCircularProgress(false);
      setWarningConnection(true);
      setTimeout(() => {
        setWarningConnection(false);
      }, 3000);
    }
    setOpenCircularProgress(false);
  };

export default fetchAssistance
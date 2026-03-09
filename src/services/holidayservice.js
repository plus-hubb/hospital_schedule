import axios from "axios"

const API_KEY = "PIC3M04nuQrZp3LB9eafDzjrQwdfX5Oc"

export const getHolidays = async () => {

   const year = new Date().getFullYear()

  const res = await axios.get(
    `https://calendarific.com/api/v2/holidays?api_key=${API_KEY}&country=TH&year=${year}`
  )

  return res.data.response.holidays
}
const Restaurant = require("../../../../fetch/restaurant");
const date = new Date();

const openToday = ({ weekday_text: weekDays }) => {
  const date = new Date();
  const n = date.getDay() + 6;

  const todayHours = weekDays[n % 7];

  return !todayHours.includes("Closed");

  // console.log(todayHours.indexOf(":"));
  // console.log("key", todayHours.slice(0, 6));
  // console.log("key", todayHours.slice(8, todayHours.length));
};
const getClosedDay = weekDays => {
  let closedDays = [];
  weekDays.forEach((day, i) => {
    if (day.includes("Closed")) closedDays.push((i + 1) % 7);
  });
  return closedDays;
};

const getTodayHours = ({ periods, weekday_text: weekDays }) => {
  const date = new Date();
  const n = date.getDay();
  const closedDays = getClosedDay(weekDays);
  const todayHours = closedDays.includes(n - 1) ? periods[n - 1] : periods[n];

  return todayHours;
};

const getNextDayHours = (todayHours, { periods }) => {
  const todayIndex = periods.indexOf(todayHours);
  const nextDayHours = periods[(todayIndex + 1) % periods.length];
  return nextDayHours;
};

module.exports = {
  findAllRestaurants: async (req, res, next) => {
    // const { user } = req;
    const filters = req.body;
    try {
      const restaurants = await Restaurant.findNearby(filters);
      res.status(200).json(restaurants);
    } catch (error) {
      console.log(error);
    }
  },
  getRestaurantSchedule: async (req, res, next) => {
    try {
      const { placeId, filters } = req.body;
      const restaruantDetail = await Restaurant.getPlaceDetail(
        placeId,
        filters
      );
      const { name, opening_hours: openingHours } = restaruantDetail.result;
      const isOpenToday = openToday(openingHours);
      const isOpenNow = openingHours.open_now;
      const todayHours = getTodayHours(openingHours);
      const nextDayHours = getNextDayHours(todayHours, openingHours);

      res
        .status(200)
        .json({ name, isOpenToday, isOpenNow, todayHours, nextDayHours });
    } catch (error) {
      console.log(error);
    }
  }
};

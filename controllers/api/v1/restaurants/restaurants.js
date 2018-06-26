const Restaurant = require("../../../../fetch/restaurant");
const date = new Date();

const openToday = weekDays => {
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
  weekDays &&
    weekDays.forEach((day, i) => {
      if (day.includes("Closed")) closedDays.push((i + 1) % 7);
    });
  return closedDays;
};

const getTodayHours = (periods, weekDays = []) => {
  const date = new Date();
  const n = date.getDay();
  const closedDays = getClosedDay(weekDays);
  if (!openToday(weekDays)) return "Closed";

  const todayHours = closedDays.includes(n) ? periods[n - 1] : periods[n];

  return todayHours;
};

const getNextDayHours = (todayHours, periods) => {
  const todayIndex = periods && periods.indexOf(todayHours);
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
      const restaruantSchedule = await Restaurant.getPlaceSchedule(
        placeId,
        filters
      );
      const { name, opening_hours: openingHours } = restaruantSchedule.result;
      if (openingHours) {
        const {
          periods,
          weekday_text: weekDays,
          open_now: isOpenNow
        } = openingHours;
        const isOpenToday = openToday(weekDays);
        const todayHours = getTodayHours(periods, weekDays);
        const nextDayHours = getNextDayHours(todayHours, periods);

        return res.status(200).json({
          name,
          isOpenToday,
          isOpenNow,
          todayHours,
          nextDayHours,
          weekDays
        });
      }
      res.status(200).json({
        name,
        notAvailable: "The business hour for this restaurant is not available."
      });

      // res.json(restaruantSchedule);
    } catch (error) {
      console.log(error);
    }
  }
};

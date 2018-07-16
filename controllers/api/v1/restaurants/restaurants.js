const Restaurant = require("../../../../fetch/restaurant");

const openToday = (weekDays, day) => {
  const n = day + 6;
  const todayHours = weekDays[n % 7];
  return !todayHours.includes("Closed");
};

const openTwentyFour = (weekDays, day) => {
  const n = day + 6;
  const todayHours = weekDays[n % 7];
  return todayHours.includes("Open 24 hours");
};

const getClosedDay = weekDays => {
  let closedDays = [];
  weekDays &&
    weekDays.forEach((day, i) => {
      if (day.includes("Closed")) closedDays.push((i + 1) % 7);
    });
  return closedDays;
};

const getTodayHours = (periods, weekDays = [], day) => {
  const closedDays = getClosedDay(weekDays);

  if (!openToday(weekDays, day)) return "Closed";
  if (openTwentyFour(weekDays, day)) return "Open 24 hours";

  return day > closedDays.length
    ? periods[day - closedDays.length]
    : periods[day];
};

const nextDaySchedule = ([firstDay, ...restDays], day) =>
  day < firstDay.open.day || day === 6
    ? firstDay
    : nextDaySchedule(restDays, day);

const getNextDayHours = (periods, day) => {
  const nextDayHours = nextDaySchedule(periods, day);
  return nextDayHours;
};

module.exports = {
  findAllRestaurants: async (req, res, next) => {
    const filters = req.body;
    try {
      const restaurants = await Restaurant.findNearby(filters);
      res.status(200).json(restaurants);
    } catch (error) {
      console.log(error);
    }
  },
  getNextRests: async (req, res, next) => {
    const { pageToken } = req.body;
    try {
      const nextRests = await Restaurant.getNext(pageToken);
      res.status(200).json(nextRests);
    } catch (error) {
      console.log(error);
    }
  },

  getDetails: async (req, res, next) => {
    try {
      const { placeId, filters, day } = req.body;
      const restaruantDetails = await Restaurant.getDetails(placeId, filters);
      const {
        opening_hours: openingHours,
        ...details
      } = restaruantDetails.result;

      if (openingHours) {
        const {
          periods,
          weekday_text: weekDays,
          open_now: isOpenNow
        } = openingHours;

        const todayHours = getTodayHours(periods, weekDays, day);

        if (todayHours === "Open 24 hours") {
          return res.status(200).json({
            schedule: { isOpenNow, immortal: "Open 24 hours" },
            details
          });
        }

        const isOpenToday = openToday(weekDays, day);
        const nextDayHours = getNextDayHours(periods, day);

        return res.status(200).json({
          schedule: {
            isOpenToday,
            isOpenNow,
            todayHours,
            nextDayHours,
            weekDays
          },
          details
        });
      }

      return res.status(200).json({
        schedule: { notAvailable: "Not available" },
        details
      });
    } catch (error) {
      console.log(error);
    }
  },
  getDetail: async (req, res, next) => {
    try {
      const { placeId, filters } = req.body;
      const { result } = await Restaurant.getDetails(placeId, filters);
      res.status(200).json(result);
    } catch (error) {
      console.log(error);
    }
  },
  getPhoto: async (req, res, next) => {
    try {
      const { photoId, maxWidth } = req.body;
      const photoUrl = await Restaurant.getPhoto(photoId, maxWidth);
      res.status(200).json({ photoUrl });
    } catch (error) {
      console.log(error);
    }
  },
  getPhotos: async (req, res, next) => {
    try {
      const { photos, maxWidth } = req.body;
      const photoUrls = await Restaurant.getPhotos(photos, maxWidth);
      res.status(200).json({ photoUrls });
    } catch (error) {
      console.log(error);
    }
  },
  getBusyHours: async (req, res, next) => {
    const { placeId } = req.body;
    try {
      const nextRests = await Restaurant.getBusyHours(placeId);
      res.status(200).json(nextRests);
    } catch (error) {
      console.log(error);
    }
  }
};

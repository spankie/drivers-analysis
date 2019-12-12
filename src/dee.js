const { getTrips, getDriver } = require('api');
/**
 * This function should return the trip data analysis
 *
 * Question 3
 * @returns {any} Trip data analysis
 */
function convertToNumber(str) {
  return typeof str === 'number'
    ? parseFloat(str)
    : parseFloat(str.replace(',', ''));
}

async function analysis() {
  const trips = await getTrips();
  let driverTrips = {};
  let result = {
    noOfCashTrips: 0,
    noOfNonCashTrips: 0,
    billedTotal: 0,
    cashBilledTotal: 0,
    nonCashBilledTotal: 0,
    noOfDriversWithMoreThanOneVehicle: 0,
  };
  let ht = { t: 0, d: '' };
  let ha = { t: 0, d: '' };
  trips.map(trip => {
    const ban = convertToNumber(trip.billedAmount);
    // populate cash trips details
    if (trip.isCash) {
      result.noOfCashTrips += 1;
      result.cashBilledTotal += ban;
    } else {
      result.noOfNonCashTrips += 1;
      result.nonCashBilledTotal += ban;
    }

    if (driverTrips[trip.driverID]) {
      driverTrips[trip.driverID].trips.push(trip);
      driverTrips[trip.driverID].totalAmountEarned += ban;
      if (ha.t < driverTrips[trip.driverID].totalAmountEarned) {
        ha = {
          t: driverTrips[trip.driverID].totalAmountEarned,
          d: trip.driverID,
        };
      }
      if (ht.t <= driverTrips[trip.driverID].trips.length)
        ht = { t: driverTrips[trip.driverID].trips.length, d: trip.driverID };
      // console.log(ha, ht);
    } else {
      driverTrips[trip.driverID] = { trips: [trip], totalAmountEarned: ban };
    }
  });
  // get total billed amount
  result.billedTotal = result.cashBilledTotal + result.nonCashBilledTotal;
  // get the noOfDriversWithMoreThanOneVehicle out here...
  // console.log(driverTrips);
  let pp = [];
  let htdriver; // = await getDriver(ht.d);
  let hadriver; // = await getDriver(ha.d);
  for (id in driverTrips) {
    try {
      const driver = await getDriver(id).then(d => {
        if (ht.d == id) {
          htdriver = d;
        }
        if (ha.d == id) {
          hadriver = d;
        }
        return d;
      });
      pp.push(driver);
    } catch (err) {
      console.error('No driver: ');
    }
    // console.log(driver);
  }

  let p = await Promise.all(pp)
    .then(drivers => {
      console.log(driver);

      if (driver.vehicleID && driver.vehicleID.length > 1) {
        console.log(driver.vehicleID.length);
        result.noOfDriversWithMoreThanOneVehicle += 1;
      }
      // console.log(driver);
      // trips = driverTrips[driver.id];
    })
    .catch(error => {
      console.log(error);
    });
  // p.then();
  // console.log(htdriver, ht);
  // console.log(hadriver, ha);
  console.log(result);
}

analysis();

module.export = analysis;

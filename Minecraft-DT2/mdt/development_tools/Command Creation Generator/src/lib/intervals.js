/* Intervals created by McRaZick v0.1.0 05/02/2023 */
const Intervals = {}



const createInterval = (intervalName, intervalFunction, delay, replace) => {

    if (replace != true && Intervals[intervalName]) {
        if (replace === false) return;
        return console.error(`Interval "${intervalName}" already exists in "Intervals" object. Set 'replace' parameter to 'true' in order to overwrite the interval.`);
    }

    if (Intervals[intervalName]) clearInterval(Intervals[intervalName].interval);

    Intervals[intervalName] = { function: intervalFunction, delay }
    Intervals[intervalName].interval = setInterval(
    Intervals[intervalName].function, delay);
}



const restartInterval = (intervalName, delay = false) => {

    if (!Intervals[intervalName]) {
        return console.error(`Cannot restart undefined interval: "${intervalName}".`);
    }
    if (!(delay === false)
    &&  !(isNaN(delay))
    && Intervals[intervalName].delay != delay) {
        Intervals[intervalName].delay =  Number(delay);
    }

    let interval = Intervals[intervalName];
    clearInterval( Intervals[intervalName].interval );

    Intervals[intervalName].interval = setInterval(
        interval.function, interval.delay
    );
}



const removeInterval = (intervalName) => {
    if (!Intervals[intervalName]) {
        return console.error(`Cannot remove undefined interval: "${intervalName}".`);
    }

    clearInterval(Intervals[intervalName].interval);
    delete Intervals[intervalName];
    }



const stopInterval = (intervalName) => {
    if (!Intervals[intervalName]) { 
        return console.error(`Cannot stop undefined interval: "${intervalName}".`);
    }
    clearInterval(Intervals[intervalName].interval);
}